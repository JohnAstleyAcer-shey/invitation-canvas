import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { Search, Download, SortAsc, SortDesc, Users, UserCheck, UserX, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function CustomerGuestsPage() {
  const { session } = useCustomerAdmin();
  const invId = session!.invitation.id;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "status">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const { data: guests } = useQuery({
    queryKey: ["cp-guests", invId],
    queryFn: async () => {
      const { data } = await supabase.from("guests").select("*").eq("invitation_id", invId).order("full_name");
      return data ?? [];
    },
  });

  const { data: rsvps } = useQuery({
    queryKey: ["cp-guest-rsvps", invId],
    queryFn: async () => {
      const { data } = await supabase.from("rsvps").select("*").eq("invitation_id", invId);
      return data ?? [];
    },
  });

  const rsvpMap = useMemo(() => {
    const map: Record<string, any> = {};
    rsvps?.forEach(r => { map[r.guest_id] = r; });
    return map;
  }, [rsvps]);

  const filtered = useMemo(() => {
    if (!guests) return [];
    let result = guests;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(g => g.full_name.toLowerCase().includes(q) || g.email?.toLowerCase().includes(q) || g.phone?.includes(q));
    }
    if (statusFilter !== "all") {
      result = result.filter(g => (rsvpMap[g.id]?.status || "pending") === statusFilter);
    }
    return [...result].sort((a, b) => {
      if (sortField === "name") return sortDir === "asc" ? a.full_name.localeCompare(b.full_name) : b.full_name.localeCompare(a.full_name);
      const sa = rsvpMap[a.id]?.status || "pending";
      const sb = rsvpMap[b.id]?.status || "pending";
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }, [guests, search, statusFilter, sortField, sortDir, rsvpMap]);

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ["Name", "Email", "Phone", "Invitation Code", "RSVP Status", "Companions", "Dietary Notes", "Message"];
    const rows = filtered.map(g => {
      const r = rsvpMap[g.id];
      return [g.full_name, g.email || "", g.phone || "", g.invitation_code, r?.status || "pending", String(r?.num_companions || 0), r?.dietary_notes || "", r?.message || ""];
    });
    const csv = [headers, ...rows].map(r => r.map((c: string) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `guests-${session!.invitation.title}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (guestId: string) => {
    const r = rsvpMap[guestId];
    if (!r || r.status === "pending") return { text: "Pending", cls: "border-muted-foreground/30 text-muted-foreground bg-muted/50", icon: Clock };
    if (r.status === "attending") return { text: "Attending", cls: "border-green-500/30 text-green-600 bg-green-500/5", icon: UserCheck };
    if (r.status === "not_attending") return { text: "Declined", cls: "border-red-500/30 text-red-600 bg-red-500/5", icon: UserX };
    return { text: "Maybe", cls: "border-yellow-500/30 text-yellow-600 bg-yellow-500/5", icon: Clock };
  };

  const toggleSort = (field: "name" | "status") => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = sortDir === "asc" ? SortAsc : SortDesc;
  const attendingCount = Object.values(rsvpMap).filter((r: any) => r.status === "attending").length;
  const companionCount = Object.values(rsvpMap).reduce((sum: number, r: any) => sum + (r.num_companions || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">Guest List</h2>
          <p className="text-sm text-muted-foreground">{guests?.length ?? 0} guests invited</p>
        </div>
        <Button onClick={exportCSV} size="sm" className="rounded-full gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="attending">Attending</SelectItem>
            <SelectItem value="not_attending">Declined</SelectItem>
            <SelectItem value="maybe">Maybe</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th onClick={() => toggleSort("name")} className="text-left px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none">
                  <span className="flex items-center gap-1">Name {sortField === "name" && <SortIcon className="w-3 h-3" />}</span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Code</th>
                <th onClick={() => toggleSort("status")} className="text-left px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none">
                  <span className="flex items-center gap-1">RSVP {sortField === "status" && <SortIcon className="w-3 h-3" />}</span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">+Guests</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => {
                const s = getStatusBadge(g.id);
                const r = rsvpMap[g.id];
                return (
                  <motion.tr key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{g.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{g.email || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{g.phone || "—"}</td>
                    <td className="px-4 py-3 hidden lg:table-cell"><code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{g.invitation_code}</code></td>
                    <td className="px-4 py-3"><Badge variant="outline" className={`text-[10px] ${s.cls}`}>{s.text}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{r?.num_companions || 0}</td>
                  </motion.tr>
                );
              })}
              {!filtered.length && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No guests found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {filtered.map((g, i) => {
          const s = getStatusBadge(g.id);
          const r = rsvpMap[g.id];
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="p-3.5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground text-sm">{g.full_name}</span>
                <Badge variant="outline" className={`text-[10px] ${s.cls}`}>{s.text}</Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {g.email && <span>{g.email}</span>}
                {g.phone && <span>{g.phone}</span>}
                <span>Code: <code className="font-mono bg-muted px-1 rounded">{g.invitation_code}</code></span>
                {(r?.num_companions || 0) > 0 && <span>+{r.num_companions} guest(s)</span>}
              </div>
            </motion.div>
          );
        })}
        {!filtered.length && (
          <div className="flex flex-col items-center py-12 text-muted-foreground">
            <Users className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No guests found</p>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-muted-foreground gap-2 pt-2 border-t border-border">
        <span>Showing {filtered.length} of {guests?.length ?? 0} guests</span>
        <span className="font-medium">
          {attendingCount} attending + {companionCount} companions = <span className="text-foreground font-bold">{attendingCount + companionCount} expected</span>
        </span>
      </div>
    </div>
  );
}
