import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { Search, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerGuestsPage() {
  const { session } = useCustomerAdmin();
  const invId = session!.invitation.id;
  const [search, setSearch] = useState("");

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
    const map: Record<string, typeof rsvps extends (infer U)[] | undefined ? U : never> = {};
    rsvps?.forEach(r => { map[(r as any).guest_id] = r as any; });
    return map;
  }, [rsvps]);

  const filtered = useMemo(() => {
    if (!guests) return [];
    if (!search.trim()) return guests;
    const q = search.toLowerCase();
    return guests.filter(g => g.full_name.toLowerCase().includes(q) || g.email?.toLowerCase().includes(q));
  }, [guests, search]);

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ["Name", "Email", "Phone", "RSVP Status", "Companions", "Dietary Notes"];
    const rows = filtered.map(g => {
      const r = rsvpMap[g.id];
      return [
        g.full_name,
        g.email || "",
        g.phone || "",
        r ? (r as any).status : "pending",
        r ? String((r as any).num_companions || 0) : "0",
        r ? ((r as any).dietary_notes || "") : "",
      ];
    });
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `guests-${session!.invitation.title}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const statusLabel = (guestId: string) => {
    const r = rsvpMap[guestId];
    if (!r) return { text: "Pending", cls: "bg-muted text-muted-foreground" };
    const s = (r as any).status;
    if (s === "attending") return { text: "Attending", cls: "bg-green-100 text-green-700" };
    if (s === "not_attending") return { text: "Not Attending", cls: "bg-red-100 text-red-700" };
    if (s === "maybe") return { text: "Maybe", cls: "bg-yellow-100 text-yellow-700" };
    return { text: "Pending", cls: "bg-muted text-muted-foreground" };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guests..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">RSVP</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">+Guests</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g, i) => {
              const s = statusLabel(g.id);
              const r = rsvpMap[g.id];
              return (
                <motion.tr key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{g.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{g.email || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{g.phone || "—"}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.text}</span></td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{r ? (r as any).num_companions || 0 : 0}</td>
                </motion.tr>
              );
            })}
            {!filtered.length && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No guests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} guest{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
