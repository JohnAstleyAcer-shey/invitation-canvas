import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChevronRight, Home } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  admin: "Dashboard",
  create: "New Invitation",
  edit: "Edit Invitation",
  guests: "Guests",
  analytics: "Analytics",
  activity: "Activity Log",
  templates: "Templates",
  settings: "Settings",
  help: "Help",
};

export function AdminLayout() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-40 h-14 flex items-center gap-2 border-b border-border bg-background/80 backdrop-blur-xl px-4">
            <SidebarTrigger className="hidden md:flex" />
            
            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground flex-1">
              <Link to="/admin" className="hover:text-foreground transition-colors">
                <Home className="h-3.5 w-3.5" />
              </Link>
              {segments.map((seg, i) => {
                const label = breadcrumbMap[seg] || seg;
                const path = "/" + segments.slice(0, i + 1).join("/");
                const isLast = i === segments.length - 1;
                return (
                  <span key={i} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {isLast ? (
                      <span className="text-foreground font-medium">{label}</span>
                    ) : (
                      <Link to={path} className="hover:text-foreground transition-colors">{label}</Link>
                    )}
                  </span>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 ml-auto">
              <CommandPalette />
              <ThemeToggle />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
            <Outlet />
          </main>

          {/* Mobile bottom nav */}
          <MobileNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
