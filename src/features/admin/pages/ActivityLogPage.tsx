import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, Filter, UserCheck, UserX, HelpCircle, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useInvitations } from "../hooks/useInvitations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RSVP_STATUS_LABELS, type RsvpStatus } from "../types";
import { formatDistanceToNow } from "date-fns";
import { SEOHead } from "@/components/SEOHead";

type RsvpEvent = {
  id: string;
  status: RsvpStatus;
  responded_at: string | null;
  created_at: string;
  message: string | null;
  num_companions: number | null;
  guest_name?: string;
  invitation_title?: string;
};

const statusIcons: Record<string, React.ReactNode> = {
  attending: <UserCheck className="h-4 w-4 text-green-500" />,
  not_attending: <UserX className="h-4 w-4 text-destructive" />,
  maybe: <HelpCircle className="h-4 w-4 text-amber-500" />,
  pending: <Clock className="h-4 w-4 text-muted-foreground" />,
};

const statusColors: Record<string, string> = {
  attending: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  not_attending: "bg-destructive/10 text-destructive border-destructive/20",
  maybe: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  pending: "bg-muted text-muted-foreground border-border",
};

export default function ActivityLogPage() {
  const [events, setEvents] = useState<RsvpEvent[]>([]);
  const [filterInvitation, setFilterInvitation] = useState("all");
  const { data: invitations } = useInvitations();

  useEffect(() => {
    const fetchRsvps = async () => {
      const { data } = await supabase
        .from("rsvps")
        .select("*, guests(full_name), invitations(title)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (data) {
        setEvents(data.map((r: any) => ({
          id: r.id,
          status: r.status,
          responded_at: r.responded_at,
          created_at: r.created_at,
          message: r.message,
          num_companions: r.num_companions,
          guest_name: r.guests?.full_name,
          invitation_title: r.invitations?.title,
        })));
      }
    };
    fetchRsvps();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("rsvps-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "rsvps" }, async (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const newRsvp = payload.new as any;
          const [{ data: guest }, { data: inv }] = await Promise.all([
            supabase.from("guests").select("full_name").eq("id", newRsvp.guest_id).maybeSingle(),
            supabase.from("invitations").select("title").eq("id", newRsvp.invitation_id).maybeSingle(),
          ]);

          const event: RsvpEvent = {
            id: newRsvp.id,
            status: newRsvp.status,
            responded_at: newRsvp.responded_at,
            created_at: newRsvp.created_at,
            message: newRsvp.message,
            num_companions: newRsvp.num_companions,
            guest_name: guest?.full_name,
            invitation_title: inv?.title,
          };

          setEvents(prev => {
            const existing = prev.findIndex(e => e.id === event.id);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = event;
              return updated;
            }
            return [event, ...prev];
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = filterInvitation === "all"
    ? events
    : events.filter(e => e.invitation_title === filterInvitation);

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <SEOHead title="Activity Log" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-2xl sm:text-3xl font-black">
            Activity Log
          </motion.h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time RSVP feed</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">Live</span>
          </div>
          <Badge variant="secondary" className="text-xs">{filtered.length} events</Badge>
        </div>
      </div>

      <Select value={filterInvitation} onValueChange={setFilterInvitation}>
        <SelectTrigger className="w-full sm:w-64 rounded-xl"><SelectValue placeholder="All invitations" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Invitations</SelectItem>
          {invitations?.map(inv => <SelectItem key={inv.id} value={inv.title}>{inv.title}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-2xl bg-accent mx-auto mb-5 flex items-center justify-center">
                <Bell className="h-9 w-9 text-muted-foreground/30" />
              </div>
              <h3 className="font-display text-lg font-bold mb-1">No activity yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">RSVPs will appear here in real-time as guests respond to your invitations.</p>
            </motion.div>
          ) : (
            filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: i * 0.02 }}
                className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 hover:bg-accent/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  {statusIcons[event.status] || <Clock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-sm font-bold truncate">{event.guest_name || "Unknown Guest"}</p>
                    <Badge variant="outline" className={`text-[10px] w-fit ${statusColors[event.status] || ""}`}>
                      {RSVP_STATUS_LABELS[event.status]}
                    </Badge>
                  </div>
                  {event.invitation_title && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      for <span className="font-medium text-foreground">{event.invitation_title}</span>
                    </p>
                  )}
                  {event.message && (
                    <p className="text-xs text-muted-foreground mt-1.5 italic bg-accent/30 rounded-lg px-2.5 py-1.5">"{event.message}"</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                    {event.num_companions ? <span>+{event.num_companions} companion(s)</span> : null}
                    <span>{formatDistanceToNow(new Date(event.responded_at || event.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
