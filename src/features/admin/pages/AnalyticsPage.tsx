import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { useRsvpStats, useGuestsPerInvitation, useRsvpTimeline } from "../hooks/useInvitationData";
import { useInvitationStats } from "../hooks/useInvitations";
import { TrendingUp, Users, CheckCircle, XCircle, HelpCircle, Clock, Eye, Smartphone, Monitor, Tablet, ArrowUpRight, Activity, RefreshCw } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { AnalyticsSkeleton } from "@/components/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const COLORS = ["hsl(var(--foreground))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))", "hsl(var(--border))"];
const DEVICE_ICONS: Record<string, React.ReactNode> = {
  mobile: <Smartphone className="w-4 h-4" />,
  desktop: <Monitor className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
};

const statConfigs = [
  { key: "total", label: "Total Invitations", icon: TrendingUp, gradient: "from-primary/10 to-primary/5" },
  { key: "totalGuests", label: "Total Guests", icon: Users, gradient: "from-blue-500/10 to-blue-500/5" },
  { key: "attending", label: "Attending", icon: CheckCircle, gradient: "from-green-500/10 to-green-500/5" },
  { key: "views", label: "Page Views", icon: Eye, gradient: "from-purple-500/10 to-purple-500/5" },
  { key: "conversion", label: "RSVP Conversion", icon: ArrowUpRight, gradient: "from-amber-500/10 to-amber-500/5", suffix: "%" },
];

function AnimatedNumber({ value, label, icon: Icon, suffix, gradient, index }: { value: number; label: string; icon: React.ElementType; suffix?: string; gradient: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`rounded-2xl border border-border bg-gradient-to-br ${gradient} p-4 sm:p-5 cursor-default transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.06 + 0.15 }}
        className="font-display text-2xl sm:text-3xl font-black"
      >
        {value}{suffix}
      </motion.p>
    </motion.div>
  );
}

function ChartCard({ title, children, className = "", delay = 0 }: { title: string; children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
      className={`rounded-2xl border border-border bg-card p-5 sm:p-6 transition-shadow hover:shadow-md ${className}`}
    >
      <h3 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useInvitationStats();
  const { data: rsvpStats, isLoading: rsvpLoading } = useRsvpStats();
  const { data: guestsPerInv } = useGuestsPerInvitation();
  const { data: rsvpTimeline } = useRsvpTimeline();
  const [refreshing, setRefreshing] = useState(false);

  const { data: totalViews, refetch: refetchViews } = useQuery({
    queryKey: ["analytics-total-views"],
    queryFn: async () => {
      const { count } = await supabase.from("invitation_views" as any).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: viewsByDevice } = useQuery({
    queryKey: ["analytics-views-device"],
    queryFn: async () => {
      const { data } = await supabase.from("invitation_views" as any).select("device_type");
      const grouped: Record<string, number> = {};
      (data as any[])?.forEach((v: any) => {
        const d = v.device_type || "unknown";
        grouped[d] = (grouped[d] || 0) + 1;
      });
      return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    },
  });

  const { data: viewsTimeline } = useQuery({
    queryKey: ["analytics-views-timeline"],
    queryFn: async () => {
      const { data } = await supabase.from("invitation_views" as any).select("viewed_at").order("viewed_at");
      const grouped: Record<string, number> = {};
      (data as any[])?.forEach((v: any) => {
        const date = v.viewed_at?.split("T")[0];
        if (date) grouped[date] = (grouped[date] || 0) + 1;
      });
      return Object.entries(grouped).map(([date, views]) => ({ date, views }));
    },
  });

  const isLoading = statsLoading || rsvpLoading;

  const pieData = rsvpStats ? [
    { name: "Attending", value: rsvpStats.attending },
    { name: "Declined", value: rsvpStats.not_attending },
    { name: "Maybe", value: rsvpStats.maybe },
    { name: "Pending", value: rsvpStats.pending },
  ].filter(d => d.value > 0) : [];

  const totalRsvps = pieData.reduce((a, b) => a + b.value, 0);
  const conversionRate = totalViews && totalViews > 0 ? Math.round((totalRsvps / totalViews) * 100) : 0;

  const statValues = [
    stats?.total || 0,
    stats?.totalGuests || 0,
    rsvpStats?.attending || 0,
    totalViews || 0,
    conversionRate,
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchViews();
    setTimeout(() => setRefreshing(false), 600);
  };

  if (isLoading) return <AnalyticsSkeleton />;

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <SEOHead title="Analytics" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-2xl sm:text-3xl font-black">
            Analytics
          </motion.h1>
          <p className="text-sm text-muted-foreground mt-0.5">Overview of your invitation performance</p>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-3 w-3 mr-1.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statConfigs.map((config, i) => (
          <AnimatedNumber
            key={config.key}
            value={statValues[i]}
            label={config.label}
            icon={config.icon}
            gradient={config.gradient}
            suffix={config.suffix}
            index={i}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* RSVP Donut */}
        <ChartCard title="RSVP Breakdown" delay={0.3}>
          {totalRsvps === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <HelpCircle className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No RSVPs yet</p>
              <p className="text-xs mt-1 opacity-60">RSVPs will appear once guests respond</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={pieData} innerRadius={55} outerRadius={90} dataKey="value" stroke="none" animationBegin={300} animationDuration={800}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5">
                {pieData.map((d, i) => (
                  <motion.div
                    key={d.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="font-bold ml-auto">{d.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>

        {/* Device breakdown */}
        <ChartCard title="Views by Device" delay={0.35}>
          {!viewsByDevice?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Monitor className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No views yet</p>
              <p className="text-xs mt-1 opacity-60">View data will appear once visitors access your invitations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {viewsByDevice.map((d, i) => {
                const total = viewsByDevice.reduce((a, b) => a + b.value, 0);
                const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                return (
                  <motion.div
                    key={d.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 capitalize">
                        {DEVICE_ICONS[d.name] || <Monitor className="w-4 h-4" />}
                        {d.name}
                      </div>
                      <span className="font-bold">{d.value} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2.5 rounded-full bg-accent overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-foreground"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 + i * 0.1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Views over time */}
      <AnimatePresence>
        {viewsTimeline && viewsTimeline.length > 0 && (
          <ChartCard title="Page Views Over Time" delay={0.45}>
            <div className="w-full overflow-x-auto -mx-2">
              <div className="min-w-[400px] px-2">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={viewsTimeline}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground))" fillOpacity={0.08} strokeWidth={2} animationDuration={1200} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartCard>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="Guests per Invitation" delay={0.5}>
          {!guestsPerInv?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No data</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto -mx-2">
              <div className="min-w-[300px] px-2">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={guestsPerInv}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="guests" fill="hsl(var(--foreground))" radius={[6, 6, 0, 0]} animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard title="RSVPs Over Time" delay={0.55}>
          {!rsvpTimeline?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Clock className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No RSVP data yet</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto -mx-2">
              <div className="min-w-[300px] px-2">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={rsvpTimeline}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ r: 3 }} animationDuration={1000} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
