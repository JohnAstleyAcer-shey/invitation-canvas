import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { format } from "date-fns";
import { MessageSquare, Download, Search, Quote, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">Guest Messages</h2>
          <p className="text-sm text-muted-foreground">{rsvps?.length ?? 0} messages received</p>
        </div>
        <Button onClick={downloadMessages} size="sm" className="rounded-full gap-1.5">
          <Download className="w-3.5 h-3.5" /> Download All
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl"><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="attending">Attending</SelectItem>
            <SelectItem value="not_attending">Declined</SelectItem>
            <SelectItem value="maybe">Maybe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-5 rounded-2xl border border-border bg-card relative overflow-hidden group"
            >
              <Quote className="absolute top-3 right-3 w-8 h-8 text-muted-foreground/10 group-hover:text-primary/10 transition-colors" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {((r.guests as any)?.full_name || "?")[0].toUpperCase()}
                  </div>
                  <span className="font-semibold text-foreground text-sm">{(r.guests as any)?.full_name}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] ${
                  r.status === "attending" ? "border-green-500/30 text-green-600 bg-green-500/5" :
                  r.status === "not_attending" ? "border-red-500/30 text-red-600 bg-red-500/5" :
                  "border-yellow-500/30 text-yellow-600 bg-yellow-500/5"
                }`}>
                  {r.status === "attending" ? "Attending" : r.status === "not_attending" ? "Declined" : "Maybe"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic mb-3">"{r.message}"</p>
              {r.responded_at && (
                <p className="text-[10px] text-muted-foreground/70">{format(new Date(r.responded_at), "MMMM d, yyyy 'at' h:mm a")}</p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-accent/50 flex items-center justify-center mb-4">
            <Heart className="w-7 h-7 opacity-40" />
          </div>
          <p className="text-sm font-medium">
            {rsvps?.length ? "No messages match your filters" : "No messages from guests yet"}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">Messages will appear here when guests RSVP</p>
        </div>
      )}
    </div>
  );
}
