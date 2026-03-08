import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { LayoutDashboard, Users, MessageSquare, LogOut, PartyPopper } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function CustomerPortalLayout() {
  const { session, logout } = useCustomerAdmin();
  const navigate = useNavigate();

  if (!session) return <Navigate to="/customer-admin" replace />;

  const handleLogout = () => { logout(); navigate("/customer-admin"); };

  const links = [
    { to: "/customer-admin/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/customer-admin/guests", icon: Users, label: "Guests" },
    { to: "/customer-admin/messages", icon: MessageSquare, label: "Messages" },
  ];

  const initials = (session.admin.display_name || session.admin.username || "U")
    .split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 md:px-6 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <PartyPopper className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-sm sm:text-base font-bold font-display text-foreground truncate">
                {session.invitation.title}
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-0.5 ml-4">
              {links.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`
                  }
                >
                  <l.icon className="w-4 h-4" /> {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground hidden lg:block max-w-[100px] truncate">
                {session.admin.display_name || session.admin.username}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile nav - bottom style at top for consistency */}
        <nav className="md:hidden flex border-t border-border bg-background">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors relative ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="customer-nav-indicator"
                      className="absolute top-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <l.icon className="w-4 h-4" />
                  {l.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto w-full pb-24 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
}
