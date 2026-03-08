import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { useRealtimeRsvps } from "@/features/invitation/hooks/useRealtimeRsvps";
import { Users, CheckCircle, XCircle, HelpCircle, CalendarDays, TrendingUp, UtensilsCrossed, UserPlus, Printer, Eye, Wifi } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

const PIE_COLORS = ["#22c55e", "#ef4444", "#eab308", "#94a3b8"];

export default function CustomerDashboardPage() {
  const { session } = useCustomerAdmin();
  const invId = session!.invitation.id;

  // Enable real-time RSVP updates
  useRealtimeRsvps(invId);

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
      const { data } = await supabase.from("rsvps").select("status, num_companions, dietary_notes").eq("invitation_id", invId);
      const stats = { attending: 0, not_attending: 0, maybe: 0, pending: 0, totalCompanions: 0, dietaryCount: 0 };
      data?.forEach(r => {
        if (r.status in stats) stats[r.status as keyof typeof stats]++;
        stats.totalCompanions += r.num_companions || 0;
        if (r.dietary_notes?.trim()) stats.dietaryCount++;
      });
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
        .limit(10);
      return data ?? [];
    },
  });

  const { data: dietaryList } = useQuery({
    queryKey: ["cp-dietary", invId],
    queryFn: async () => {
      const { data } = await supabase
        .from("rsvps")
        .select("dietary_notes, guests(full_name)")
        .eq("invitation_id", invId)
        .not("dietary_notes", "is", null);
      return data?.filter(r => r.dietary_notes?.trim()) ?? [];
    },
  });

  const { data: viewCount } = useQuery({
    queryKey: ["cp-view-count", invId],
    queryFn: async () => {
      const { count } = await supabase.from("invitation_views" as any).select("*", { count: "exact", head: true }).eq("invitation_id", invId);
      return count ?? 0;
    },
  });

  const { data: viewsByDevice } = useQuery({
    queryKey: ["cp-views-device", invId],
    queryFn: async () => {
      const { data } = await supabase.from("invitation_views" as any).select("device_type").eq("invitation_id", invId);
      const grouped: Record<string, number> = {};
      (data as any[])?.forEach((v: any) => {
        const d = v.device_type || "unknown";
        grouped[d] = (grouped[d] || 0) + 1;
      });
      return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    },
  });

  const eventDate = session!.invitation.event_date;
  const daysUntil = eventDate ? Math.ceil((new Date(eventDate).getTime() - Date.now()) / 86400000) : null;

  const totalResponded = (rsvpStats?.attending ?? 0) + (rsvpStats?.not_attending ?? 0) + (rsvpStats?.maybe ?? 0);
  const responseRate = (guestCount ?? 0) > 0 ? Math.round((totalResponded / (guestCount ?? 1)) * 100) : 0;

  const pieData = rsvpStats ? [
    { name: "Attending", value: rsvpStats.attending },
    { name: "Declined", value: rsvpStats.not_attending },
    { name: "Maybe", value: rsvpStats.maybe },
    { name: "Pending", value: rsvpStats.pending },
  ].filter(d => d.value > 0) : [];

  const cards = [
    { label: "Total Guests", value: guestCount ?? 0, icon: Users, color: "text-blue-500" },
    { label: "Attending", value: rsvpStats?.attending ?? 0, icon: CheckCircle, color: "text-green-500" },
    { label: "Declined", value: rsvpStats?.not_attending ?? 0, icon: XCircle, color: "text-red-500" },
    { label: "Maybe", value: rsvpStats?.maybe ?? 0, icon: HelpCircle, color: "text-yellow-500" },
    { label: "Extra Guests", value: rsvpStats?.totalCompanions ?? 0, icon: UserPlus, color: "text-purple-500" },
    { label: "Response Rate", value: responseRate, icon: TrendingUp, color: "text-emerald-500", suffix: "%" },
    { label: "Page Views", value: viewCount ?? 0, icon: Eye, color: "text-indigo-500" },
  ];

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Wifi className="w-3 h-3 text-green-500 animate-pulse" />
        <span>Live updates enabled</span>
      </div>

      {/* Countdown banner */}
      {daysUntil !== null && daysUntil > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-primary" />
            <p className="text-sm text-foreground">
              <span className="font-bold">{daysUntil} days</span> until {session!.invitation.title}
              {eventDate && <span className="text-muted-foreground ml-2">({format(new Date(eventDate), "MMMM d, yyyy")})</span>}
            </p>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground print:hidden">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </motion.div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="p-3 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{card.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{card.value}{(card as any).suffix || ""}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* RSVP Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-semibold text-foreground mb-4">RSVP Breakdown</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center justify-center gap-4">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-foreground">{d.name}: <span className="font-semibold">{d.value}</span></span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No responses yet</p>
          )}
        </div>

        {/* Recent Responses */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-semibold text-foreground mb-4">Recent Responses</h3>
          {recentRsvps?.length ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {recentRsvps.map(r => (
                <div key={r.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                  <div>
                    <span className="font-medium text-foreground">{(r.guests as any)?.full_name}</span>
                    {r.responded_at && <span className="text-muted-foreground ml-2 text-xs">{format(new Date(r.responded_at), "MMM d, h:mm a")}</span>}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    r.status === "attending" ? "bg-green-100 text-green-700" : r.status === "not_attending" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {r.status === "attending" ? "Attending" : r.status === "not_attending" ? "Declined" : "Maybe"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No responses yet.</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views by Device */}
        {viewsByDevice && viewsByDevice.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground mb-4">Views by Device</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={viewsByDevice}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Dietary Restrictions Summary */}
        {dietaryList && dietaryList.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-muted-foreground" /> Dietary Restrictions ({dietaryList.length})
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {dietaryList.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-accent/30">
                  <span className="font-medium text-foreground">{(r.guests as any)?.full_name}:</span>
                  <span className="text-muted-foreground">{r.dietary_notes}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Attendance Summary for Print */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground mb-2">Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-muted-foreground">Expected headcount:</p>
          <p className="font-semibold text-foreground">{(rsvpStats?.attending ?? 0) + (rsvpStats?.totalCompanions ?? 0)} people</p>
          <p className="text-muted-foreground">Confirmed attending:</p>
          <p className="font-semibold text-foreground">{rsvpStats?.attending ?? 0} guests</p>
          <p className="text-muted-foreground">Plus companions:</p>
          <p className="font-semibold text-foreground">{rsvpStats?.totalCompanions ?? 0} extra</p>
          <p className="text-muted-foreground">Still pending:</p>
          <p className="font-semibold text-foreground">{(guestCount ?? 0) - totalResponded} guests</p>
          <p className="text-muted-foreground">Total page views:</p>
          <p className="font-semibold text-foreground">{viewCount ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
