import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { format } from "date-fns";
import { MessageSquare, Download, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CustomerMessagesPage() {
  const { session } = useCustomerAdmin();
  const invId = session!.invitation.id;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: rsvps } = useQuery({
    queryKey: ["cp-messages", invId],
    queryFn: async () => {
      const { data } = await supabase
        .from("rsvps")
        .select("*, guests(full_name)")
        .eq("invitation_id", invId)
        .not("message", "is", null)
        .order("responded_at", { ascending: false });
      return data?.filter(r => r.message?.trim()) ?? [];
    },
  });

  const filtered = useMemo(() => {
    if (!rsvps) return [];
    let result = rsvps;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => (r.guests as any)?.full_name?.toLowerCase().includes(q) || r.message?.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") result = result.filter(r => r.status === statusFilter);
    return result;
  }, [rsvps, search, statusFilter]);

  const downloadMessages = () => {
    if (!filtered.length) return;
    const text = filtered.map(r =>
      `${(r.guests as any)?.full_name} (${r.status})${r.responded_at ? ` - ${format(new Date(r.responded_at), "MMM d, yyyy")}` : ""}\n"${r.message}"\n`
    ).join("\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `messages-${session!.invitation.title}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Guest Messages ({rsvps?.length ?? 0})
        </h2>
        <button onClick={downloadMessages} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Download className="w-4 h-4" /> Download All
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="attending">Attending</SelectItem>
            <SelectItem value="not_attending">Declined</SelectItem>
            <SelectItem value="maybe">Maybe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground text-sm">{(r.guests as any)?.full_name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    r.status === "attending" ? "bg-green-100 text-green-700" : r.status === "not_attending" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {r.status === "attending" ? "Attending" : r.status === "not_attending" ? "Declined" : "Maybe"}
                  </span>
                  {r.responded_at && <span className="text-xs text-muted-foreground">{format(new Date(r.responded_at), "MMM d, yyyy")}</span>}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{r.message}"</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm">
            {rsvps?.length ? "No messages match your filters." : "No messages from guests yet."}
          </p>
        </div>
      )}
    </div>
  );
}
