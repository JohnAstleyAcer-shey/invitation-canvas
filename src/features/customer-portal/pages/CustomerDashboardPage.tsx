import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { useRealtimeRsvps } from "@/features/invitation/hooks/useRealtimeRsvps";
import { Users, CheckCircle, XCircle, HelpCircle, CalendarDays, TrendingUp, UtensilsCrossed, UserPlus, Printer, Eye, Wifi, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PIE_COLORS = ["hsl(142, 71%, 45%)", "hsl(0, 84%, 60%)", "hsl(48, 96%, 53%)", "hsl(215, 14%, 62%)"];

export default function CustomerDashboardPage() {
  const { session } = useCustomerAdmin();
  const invId = session!.invitation.id;

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
      return Object.entries(grouped).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
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
    { label: "Total Guests", value: guestCount ?? 0, icon: Users, gradient: "from-blue-500/10 to-blue-600/5", iconColor: "text-blue-500" },
    { label: "Attending", value: rsvpStats?.attending ?? 0, icon: CheckCircle, gradient: "from-green-500/10 to-green-600/5", iconColor: "text-green-500" },
    { label: "Declined", value: rsvpStats?.not_attending ?? 0, icon: XCircle, gradient: "from-red-500/10 to-red-600/5", iconColor: "text-red-500" },
    { label: "Maybe", value: rsvpStats?.maybe ?? 0, icon: HelpCircle, gradient: "from-yellow-500/10 to-yellow-600/5", iconColor: "text-yellow-500" },
    { label: "Extra Guests", value: rsvpStats?.totalCompanions ?? 0, icon: UserPlus, gradient: "from-purple-500/10 to-purple-600/5", iconColor: "text-purple-500" },
    { label: "Response Rate", value: responseRate, icon: TrendingUp, gradient: "from-emerald-500/10 to-emerald-600/5", iconColor: "text-emerald-500", suffix: "%" },
    { label: "Page Views", value: viewCount ?? 0, icon: Eye, gradient: "from-indigo-500/10 to-indigo-600/5", iconColor: "text-indigo-500" },
  ];

  const shareLink = () => {
    // Get the actual slug from the session
    const slug = (session!.invitation as any).slug || session!.invitation.id;
    const url = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <div className="space-y-6">
      {/* Live indicator + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>
          Live updates enabled
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs rounded-full gap-1" onClick={shareLink}>
            <Share2 className="h-3 w-3" /> Share
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs rounded-full gap-1 print:hidden" onClick={() => window.print()}>
            <Printer className="h-3 w-3" /> Print
          </Button>
        </div>
      </div>

      {/* Countdown banner */}
      {daysUntil !== null && daysUntil > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-lg text-foreground">{daysUntil} days to go</p>
            <p className="text-xs text-muted-foreground truncate">
              {session!.invitation.title}
              {eventDate && ` · ${format(new Date(eventDate), "MMMM d, yyyy")}`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`p-3.5 rounded-xl border border-border bg-gradient-to-br ${card.gradient} backdrop-blur-sm`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <card.icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{card.label}</span>
            </div>
            <p className="text-2xl font-bold font-display text-foreground">
              {card.value}{(card as any).suffix || ""}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* RSVP Pie Chart */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">RSVP Breakdown</h3>
          {pieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={pieData} innerRadius={55} outerRadius={85} dataKey="value" stroke="none" strokeWidth={0}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2.5 text-sm">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-foreground">{d.name}</span>
                    <span className="font-bold text-foreground ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Clock className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No responses yet</p>
            </div>
          )}
        </div>

        {/* Recent Responses */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Recent Responses</h3>
            <Badge variant="secondary" className="text-[10px]">{recentRsvps?.length ?? 0}</Badge>
          </div>
          {recentRsvps?.length ? (
            <div className="space-y-1 max-h-[320px] overflow-y-auto">
              {recentRsvps.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-accent/30 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-foreground text-sm truncate block">{(r.guests as any)?.full_name}</span>
                    {r.responded_at && <span className="text-muted-foreground text-[10px]">{format(new Date(r.responded_at), "MMM d, h:mm a")}</span>}
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${
                    r.status === "attending" ? "border-green-500/30 text-green-600 bg-green-500/5" :
                    r.status === "not_attending" ? "border-red-500/30 text-red-600 bg-red-500/5" :
                    "border-yellow-500/30 text-yellow-600 bg-yellow-500/5"
                  }`}>
                    {r.status === "attending" ? "Attending" : r.status === "not_attending" ? "Declined" : "Maybe"}
                  </Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No responses yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views by Device */}
        {viewsByDevice && viewsByDevice.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Views by Device</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={viewsByDevice}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Dietary Restrictions */}
        {dietaryList && dietaryList.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
              Dietary Restrictions
              <Badge variant="secondary" className="text-[10px]">{dietaryList.length}</Badge>
            </h3>
            <div className="grid sm:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto">
              {dietaryList.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm p-3 rounded-xl bg-accent/20 border border-border/50">
                  <span className="font-medium text-foreground shrink-0">{(r.guests as any)?.full_name}:</span>
                  <span className="text-muted-foreground">{r.dietary_notes}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold text-foreground mb-4">Attendance Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Expected headcount", value: `${(rsvpStats?.attending ?? 0) + (rsvpStats?.totalCompanions ?? 0)}` },
            { label: "Confirmed attending", value: `${rsvpStats?.attending ?? 0}` },
            { label: "Plus companions", value: `${rsvpStats?.totalCompanions ?? 0}` },
            { label: "Still pending", value: `${(guestCount ?? 0) - totalResponded}` },
            { label: "Total page views", value: `${viewCount ?? 0}` },
            { label: "Dietary needs", value: `${rsvpStats?.dietaryCount ?? 0}` },
          ].map(item => (
            <div key={item.label} className="space-y-1">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-bold font-display text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
