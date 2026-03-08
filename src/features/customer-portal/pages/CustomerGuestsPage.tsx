import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { Search, Download, Filter, SortAsc, SortDesc } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      result = result.filter(g => {
        const r = rsvpMap[g.id];
        const s = r?.status || "pending";
        return s === statusFilter;
      });
    }
    // Sort
    result = [...result].sort((a, b) => {
      if (sortField === "name") {
        return sortDir === "asc" ? a.full_name.localeCompare(b.full_name) : b.full_name.localeCompare(a.full_name);
      }
      const sa = rsvpMap[a.id]?.status || "pending";
      const sb = rsvpMap[b.id]?.status || "pending";
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
    return result;
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
    if (!r) return { text: "Pending", cls: "bg-muted text-muted-foreground" };
    const s = r.status;
    if (s === "attending") return { text: "Attending", cls: "bg-green-100 text-green-700" };
    if (s === "not_attending") return { text: "Declined", cls: "bg-red-100 text-red-700" };
    if (s === "maybe") return { text: "Maybe", cls: "bg-yellow-100 text-yellow-700" };
    return { text: "Pending", cls: "bg-muted text-muted-foreground" };
  };

  const toggleSort = (field: "name" | "status") => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = sortDir === "asc" ? SortAsc : SortDesc;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Guest List ({guests?.length ?? 0})
        </h2>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="attending">Attending</SelectItem>
            <SelectItem value="not_attending">Declined</SelectItem>
            <SelectItem value="maybe">Maybe</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th onClick={() => toggleSort("name")} className="text-left px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none">
                <span className="flex items-center gap-1">Name {sortField === "name" && <SortIcon className="w-3 h-3" />}</span>
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Code</th>
              <th onClick={() => toggleSort("status")} className="text-left px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none">
                <span className="flex items-center gap-1">RSVP {sortField === "status" && <SortIcon className="w-3 h-3" />}</span>
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">+Guests</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g, i) => {
              const s = getStatusBadge(g.id);
              const r = rsvpMap[g.id];
              return (
                <motion.tr key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.015 }} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{g.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{g.email || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{g.phone || "—"}</td>
                  <td className="px-4 py-3 hidden lg:table-cell"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{g.invitation_code}</code></td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.text}</span></td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{r?.num_companions || 0}</td>
                </motion.tr>
              );
            })}
            {!filtered.length && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No guests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {filtered.length} of {guests?.length ?? 0} guests</span>
        <span>
          {Object.values(rsvpMap).filter((r: any) => r.status === "attending").length} attending + {Object.values(rsvpMap).reduce((sum: number, r: any) => sum + (r.num_companions || 0), 0)} companions = <span className="font-semibold text-foreground">
            {Object.values(rsvpMap).filter((r: any) => r.status === "attending").length + Object.values(rsvpMap).reduce((sum: number, r: any) => sum + (r.num_companions || 0), 0)} expected
          </span>
        </span>
      </div>
    </div>
  );
}
