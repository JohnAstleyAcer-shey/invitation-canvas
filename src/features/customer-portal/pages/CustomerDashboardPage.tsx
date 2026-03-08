import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { Users, CheckCircle, XCircle, HelpCircle, Clock, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function CustomerDashboardPage() {
  const { session } = useCustomerAdmin();
  const invId = session!.invitation.id;

  const { data: guestCount } = useQuery({
    queryKey: ["cp-guest-count", invId],
    queryFn: async () => {
      const { count } = await supabase.from("guests").select("*", { count: "exact", head: true }).eq("invitation_id", invId);
      return count ?? 0;
    },
  });

  const { data: rsvpStats } = useQuery({
    queryKey: ["cp-rsvp-stats", invId],
    queryFn: async () => {
      const { data } = await supabase.from("rsvps").select("status").eq("invitation_id", invId);
      const stats = { attending: 0, not_attending: 0, maybe: 0, pending: 0 };
      data?.forEach(r => { if (r.status in stats) stats[r.status as keyof typeof stats]++; });
      return stats;
    },
  });

  const { data: recentRsvps } = useQuery({
    queryKey: ["cp-recent-rsvps", invId],
    queryFn: async () => {
      const { data } = await supabase
        .from("rsvps")
        .select("*, guests(full_name)")
        .eq("invitation_id", invId)
        .not("responded_at", "is", null)
        .order("responded_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const eventDate = session!.invitation.event_date;
  const daysUntil = eventDate ? Math.ceil((new Date(eventDate).getTime() - Date.now()) / 86400000) : null;

  const cards = [
    { label: "Total Guests", value: guestCount ?? 0, icon: Users, color: "text-blue-500" },
    { label: "Attending", value: rsvpStats?.attending ?? 0, icon: CheckCircle, color: "text-green-500" },
    { label: "Not Attending", value: rsvpStats?.not_attending ?? 0, icon: XCircle, color: "text-red-500" },
    { label: "Maybe", value: rsvpStats?.maybe ?? 0, icon: HelpCircle, color: "text-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      {daysUntil !== null && daysUntil > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <CalendarDays className="w-5 h-5 text-primary" />
          <p className="text-sm text-foreground">
            <span className="font-bold">{daysUntil} days</span> until {session!.invitation.title}
            {eventDate && <span className="text-muted-foreground ml-2">({format(new Date(eventDate), "MMMM d, yyyy")})</span>}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Recent Responses</h3>
        {recentRsvps?.length ? (
          <div className="space-y-3">
            {recentRsvps.map(r => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-foreground">{(r.guests as any)?.full_name}</span>
                  {r.responded_at && (
                    <span className="text-muted-foreground ml-2 text-xs">{format(new Date(r.responded_at), "MMM d, h:mm a")}</span>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  r.status === "attending" ? "bg-green-100 text-green-700" :
                  r.status === "not_attending" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {r.status === "attending" ? "Attending" : r.status === "not_attending" ? "Not Attending" : "Maybe"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No responses yet.</p>
        )}
      </div>
    </div>
  );
}
