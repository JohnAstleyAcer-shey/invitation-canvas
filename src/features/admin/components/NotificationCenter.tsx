import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, UserCheck, UserX, HelpCircle, Clock, Eye, Trash2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

type Notification = {
  id: string;
  type: "rsvp" | "view" | "guest";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

const typeIcons: Record<string, React.ReactNode> = {
  rsvp: <UserCheck className="h-4 w-4 text-green-500" />,
  view: <Eye className="h-4 w-4 text-blue-500" />,
  guest: <Clock className="h-4 w-4 text-amber-500" />,
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Listen for real-time RSVP changes
    const channel = supabase
      .channel("notifications-rsvps")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "rsvps" }, async (payload) => {
        const rsvp = payload.new as any;
        const { data: guest } = await supabase.from("guests").select("full_name").eq("id", rsvp.guest_id).maybeSingle();
        const statusMap: Record<string, string> = {
          attending: "confirmed attendance",
          not_attending: "declined",
          maybe: "responded as maybe",
        };
        setNotifications(prev => [{
          id: rsvp.id,
          type: "rsvp" as const,
          title: "New RSVP",
          description: `${guest?.full_name || "A guest"} ${statusMap[rsvp.status] || "responded"}`,
          timestamp: rsvp.created_at,
          read: false,
        }, ...prev].slice(0, 50));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "invitation_views" }, (payload) => {
        const view = payload.new as any;
        setNotifications(prev => [{
          id: view.id,
          type: "view",
          title: "New Page View",
          description: `Someone viewed your invitation (${view.device_type || "unknown"} device)`,
          timestamp: view.viewed_at,
          read: false,
        }, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => setNotifications([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl relative">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-destructive flex items-center justify-center"
              >
                <span className="text-[9px] font-bold text-destructive-foreground">{unreadCount > 9 ? "9+" : unreadCount}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="font-display font-bold text-sm">Notifications</h4>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs rounded-lg" onClick={markAllRead}>
                <CheckCheck className="h-3 w-3 mr-1" /> Read all
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs rounded-lg text-muted-foreground" onClick={clearAll}>
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="py-10 text-center">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">Real-time updates will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id + i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`px-4 py-3 flex items-start gap-3 hover:bg-accent/30 transition-colors cursor-default ${!n.read ? "bg-primary/5" : ""}`}
                  onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    {typeIcons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold">{n.title}</p>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.description}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
