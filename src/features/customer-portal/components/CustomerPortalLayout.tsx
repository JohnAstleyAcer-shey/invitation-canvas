import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { LayoutDashboard, Users, MessageSquare, LogOut } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              {session.invitation.title}
            </h1>
            <nav className="hidden md:flex items-center gap-1">
              {links.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`
                  }
                >
                  <l.icon className="w-4 h-4" /> {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">
              {session.admin.display_name || session.admin.username}
            </span>
            <button onClick={handleLogout} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="md:hidden flex border-t border-border">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <l.icon className="w-4 h-4" /> {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="p-4 md:p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
