import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useRsvpStats, useGuestsPerInvitation, useRsvpTimeline } from "../hooks/useInvitationData";
import { useInvitationStats } from "../hooks/useInvitations";
import { TrendingUp, Users, CheckCircle, XCircle, HelpCircle, Clock } from "lucide-react";

const COLORS = ["hsl(var(--foreground))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))", "hsl(var(--border))"];

function AnimatedNumber({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 text-center"
    >
      <div className="flex justify-center mb-2 text-muted-foreground">{icon}</div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-display text-3xl font-black"
      >
        {value}
      </motion.p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const { data: stats } = useInvitationStats();
  const { data: rsvpStats } = useRsvpStats();
  const { data: guestsPerInv } = useGuestsPerInvitation();
  const { data: rsvpTimeline } = useRsvpTimeline();

  const pieData = rsvpStats ? [
    { name: "Attending", value: rsvpStats.attending },
    { name: "Declined", value: rsvpStats.not_attending },
    { name: "Maybe", value: rsvpStats.maybe },
    { name: "Pending", value: rsvpStats.pending },
  ].filter(d => d.value > 0) : [];

  const totalRsvps = pieData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Overview of your invitation performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedNumber value={stats?.total || 0} label="Total Invitations" icon={<TrendingUp className="h-5 w-5" />} />
        <AnimatedNumber value={stats?.totalGuests || 0} label="Total Guests" icon={<Users className="h-5 w-5" />} />
        <AnimatedNumber value={rsvpStats?.attending || 0} label="Attending" icon={<CheckCircle className="h-5 w-5" />} />
        <AnimatedNumber value={stats?.pendingRsvps || 0} label="Pending RSVPs" icon={<Clock className="h-5 w-5" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* RSVP Donut */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">RSVP Breakdown</h3>
          {totalRsvps === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No RSVPs yet</p>
          ) : (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={250} height={250}>
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={100} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 ml-4">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span>{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guests per invitation */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Guests per Invitation</h3>
          {!guestsPerInv?.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={guestsPerInv}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="guests" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* RSVP Timeline */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">RSVPs Over Time</h3>
        {!rsvpTimeline?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">No RSVP data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rsvpTimeline}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
