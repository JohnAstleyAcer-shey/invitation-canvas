import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, BarChart3, Activity, BookTemplate, Settings, HelpCircle, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

const mainNav = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "New Invitation", url: "/admin/create", icon: Plus },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Activity Log", url: "/admin/activity", icon: Activity },
  { title: "Templates", url: "/admin/templates", icon: BookTemplate },
];

const bottomNav = [
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Help", url: "/admin/help", icon: HelpCircle },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const initials = (profile?.full_name || user?.email || "U").split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <img src={logoDark} alt="" className="hidden dark:block h-7 w-7 shrink-0" />
          <img src={logoLight} alt="" className="block dark:hidden h-7 w-7 shrink-0" />
          {!collapsed && <span className="font-display text-lg font-bold truncate">LynxInvitation</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={`hover:bg-accent/50 transition-colors ${isActive(item.url) ? "bg-accent font-medium" : ""}`}
                      activeClassName="bg-accent text-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-2 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-accent/50 transition-colors"
                      activeClassName="bg-accent text-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-2 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="text-xs bg-primary/10">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{profile?.full_name || "User"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>
        {!collapsed && <Separator className="my-2" />}
        <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
