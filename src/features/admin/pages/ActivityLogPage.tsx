import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useInvitations } from "../hooks/useInvitations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RSVP_STATUS_LABELS, type RsvpStatus } from "../types";
import { formatDistanceToNow } from "date-fns";

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

export default function ActivityLogPage() {
  const [events, setEvents] = useState<RsvpEvent[]>([]);
  const [filterInvitation, setFilterInvitation] = useState("all");
  const { data: invitations } = useInvitations();

  // Initial load
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

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("rsvps-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "rsvps" }, async (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const newRsvp = payload.new as any;
          // Fetch guest and invitation info
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Activity Log</h1>
          <p className="text-sm text-muted-foreground">Real-time RSVP feed</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <Select value={filterInvitation} onValueChange={setFilterInvitation}>
        <SelectTrigger className="w-56 rounded-xl"><SelectValue placeholder="All invitations" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Invitations</SelectItem>
          {invitations?.map(inv => <SelectItem key={inv.id} value={inv.title}>{inv.title}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">No activity yet. RSVPs will appear here in real-time.</p>
            </div>
          ) : (
            filtered.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-4 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{event.guest_name || "Unknown Guest"}</span>
                    {" responded "}
                    <Badge variant="outline" className="text-[10px] mx-1">{RSVP_STATUS_LABELS[event.status]}</Badge>
                    {event.invitation_title && <span className="text-muted-foreground">for <span className="font-medium">{event.invitation_title}</span></span>}
                  </p>
                  {event.message && <p className="text-xs text-muted-foreground mt-1 italic">"{event.message}"</p>}
                  {event.num_companions ? <p className="text-xs text-muted-foreground">+{event.num_companions} companion(s)</p> : null}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(event.responded_at || event.created_at), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
