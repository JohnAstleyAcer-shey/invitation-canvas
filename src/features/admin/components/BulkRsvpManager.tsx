import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, HelpCircle, Clock, ChevronDown, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { RSVP_STATUS_LABELS, type RsvpStatus } from "../types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface RsvpEntry {
  id: string;
  guest_name: string;
  status: RsvpStatus;
  num_companions: number;
  message: string | null;
  responded_at: string | null;
}

interface BulkRsvpManagerProps {
  invitationId: string;
  rsvps: RsvpEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<RsvpStatus, { icon: React.ElementType; color: string }> = {
  attending: { icon: CheckCircle, color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
  not_attending: { icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20" },
  maybe: { icon: HelpCircle, color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" },
  pending: { icon: Clock, color: "bg-muted text-muted-foreground border-border" },
};

export function BulkRsvpManager({ invitationId, rsvps, open, onOpenChange }: BulkRsvpManagerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [newStatus, setNewStatus] = useState<RsvpStatus>("attending");
  const [updating, setUpdating] = useState(false);
  const qc = useQueryClient();

  const toggleAll = () => {
    if (selected.size === rsvps.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rsvps.map(r => r.id)));
    }
  };

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkUpdate = async () => {
    if (selected.size === 0) return;
    setUpdating(true);
    const { error } = await supabase
      .from("rsvps")
      .update({ status: newStatus, responded_at: new Date().toISOString() })
      .in("id", Array.from(selected));

    if (error) {
      toast.error("Failed to update RSVPs");
    } else {
      toast.success(`Updated ${selected.size} RSVP(s) to ${RSVP_STATUS_LABELS[newStatus]}`);
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ["rsvps"] });
    }
    setUpdating(false);
  };

  const exportRsvps = () => {
    const headers = ["Guest", "Status", "Companions", "Message", "Responded At"];
    const rows = rsvps.map(r => [
      r.guest_name,
      RSVP_STATUS_LABELS[r.status],
      r.num_companions,
      r.message || "",
      r.responded_at || "Not responded",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvps-export.csv`;
    a.click();
    toast.success("RSVPs exported");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display">Bulk RSVP Management</DialogTitle>
        </DialogHeader>

        {/* Bulk action bar */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20"
            >
              <span className="text-xs font-medium">{selected.size} selected</span>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as RsvpStatus)}>
                <SelectTrigger className="w-36 h-8 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RSVP_STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" className="h-8 rounded-lg text-xs" onClick={handleBulkUpdate} disabled={updating}>
                {updating ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : null}
                Update
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RSVP list */}
        <div className="flex-1 overflow-auto space-y-1.5">
          <div className="flex items-center gap-2 px-1 py-1">
            <Checkbox
              checked={selected.size === rsvps.length && rsvps.length > 0}
              onCheckedChange={toggleAll}
            />
            <span className="text-xs text-muted-foreground font-medium">Select all ({rsvps.length})</span>
          </div>

          {rsvps.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No RSVPs found</div>
          ) : (
            rsvps.map((r, i) => {
              const config = statusConfig[r.status];
              const Icon = config.icon;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/20 transition-colors ${selected.has(r.id) ? "bg-primary/5 border-primary/20" : ""}`}
                >
                  <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} />
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{r.guest_name}</p>
                    {r.message && <p className="text-xs text-muted-foreground truncate italic">"{r.message}"</p>}
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${config.color}`}>
                    {RSVP_STATUS_LABELS[r.status]}
                  </Badge>
                  {r.num_companions > 0 && (
                    <span className="text-[10px] text-muted-foreground">+{r.num_companions}</span>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        <DialogFooter className="flex-row justify-between">
          <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={exportRsvps}>
            <Download className="h-3 w-3 mr-1.5" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
