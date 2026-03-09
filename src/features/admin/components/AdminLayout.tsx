import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationCenter } from "./NotificationCenter";
import { ChevronRight, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  blocks: "Block Editor",
};

export function AdminLayout() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <div className="min-h-[100dvh] flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Top bar */}
          <header className="sticky top-0 z-40 h-14 flex items-center gap-2 border-b border-border bg-background/80 backdrop-blur-xl px-3 sm:px-4">
            <SidebarTrigger className="hidden md:flex" />
            
            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground flex-1 min-w-0">
              <Link to="/admin" className="hover:text-foreground transition-colors shrink-0">
                <Home className="h-3.5 w-3.5" />
              </Link>
              {segments.map((seg, i) => {
                const label = breadcrumbMap[seg] || seg;
                const path = "/" + segments.slice(0, i + 1).join("/");
                const isLast = i === segments.length - 1;
                return (
                  <span key={i} className="flex items-center gap-1 min-w-0">
                    <ChevronRight className="h-3 w-3 shrink-0" />
                    {isLast ? (
                      <span className="text-foreground font-medium truncate">{label}</span>
                    ) : (
                      <Link to={path} className="hover:text-foreground transition-colors truncate">{label}</Link>
                    )}
                  </span>
                );
              })}
            </nav>

            {/* Mobile page title */}
            <div className="sm:hidden flex-1 min-w-0">
              <p className="font-display font-semibold text-sm truncate">
                {breadcrumbMap[segments[segments.length - 1]] || "Dashboard"}
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
              <CommandPalette />
              <ThemeToggle />
            </div>
          </header>

          {/* Main content with page transitions */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 pb-24 md:pb-6 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Mobile bottom nav */}
          <MobileNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
