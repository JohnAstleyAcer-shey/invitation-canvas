import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { LayoutDashboard, Plus, BarChart3, Activity, BookTemplate, Settings, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const commands = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, group: "Navigation" },
  { title: "Create Invitation", url: "/admin/create", icon: Plus, group: "Navigation" },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3, group: "Navigation" },
  { title: "Activity Log", url: "/admin/activity", icon: Activity, group: "Navigation" },
  { title: "Templates", url: "/admin/templates", icon: BookTemplate, group: "Navigation" },
  { title: "Settings", url: "/admin/settings", icon: Settings, group: "Navigation" },
  { title: "Help", url: "/admin/help", icon: HelpCircle, group: "Navigation" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground rounded-lg h-8 px-3"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search...</span>
        <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {commands.map((cmd) => (
              <CommandItem
                key={cmd.url}
                onSelect={() => {
                  navigate(cmd.url);
                  setOpen(false);
                }}
                className="gap-2"
              >
                <cmd.icon className="h-4 w-4" />
                <span>{cmd.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
