import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, BarChart3, Activity, Settings } from "lucide-react";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl safe-area-pb">
      <div className="flex justify-around py-2">
        {items.map((item) => (
          <Link
            key={item.url}
            to={item.url}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
              isActive(item.url) ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
