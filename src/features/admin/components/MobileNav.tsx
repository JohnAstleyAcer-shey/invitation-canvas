import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, BarChart3, Activity, Settings } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { title: "Home", url: "/admin", icon: LayoutDashboard },
  { title: "Create", url: "/admin/create", icon: Plus },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Activity", url: "/admin/activity", icon: Activity },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function MobileNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="flex justify-around py-1.5 px-1 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {items.map((item) => {
          const active = isActive(item.url);
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium transition-colors rounded-xl min-w-[56px] ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 bg-accent rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="h-5 w-5 relative z-10" />
              <span className="relative z-10">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
