import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateGrid } from "../components/TemplateGrid";
import { TemplatePreviewDialog } from "../components/TemplatePreviewDialog";
import { ALL_TEMPLATES } from "../registry";
import type { TemplateDef } from "../types";
import { toast } from "sonner";

export default function TemplateCatalogPage() {
  const navigate = useNavigate();
  const [previewing, setPreviewing] = useState<TemplateDef | null>(null);
  const [applyingTo, setApplyingTo] = useState<TemplateDef | null>(null);
  const [selectedInv, setSelectedInv] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const { data: invitations = [] } = useQuery({
    queryKey: ["my-invitations-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitations")
        .select("id, title, celebrant_name")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const apply = async () => {
    if (!applyingTo || !selectedInv) return;
    setBusy(true);
    try {
      const { data: existing } = await supabase
        .from("invitation_blocks")
        .select("sort_order")
        .eq("invitation_id", selectedInv)
        .order("sort_order", { ascending: false })
        .limit(1);
      const startOrder = (existing?.[0]?.sort_order ?? -1) + 1;

      const { error } = await supabase.from("invitation_blocks").insert(
        applyingTo.blocks.map((b, i) => ({
          invitation_id: selectedInv,
          block_type: b.block_type,
          content: b.content as any,
          style: b.style as any,
          sort_order: startOrder + i,
          is_visible: true,
        })),
      );
      if (error) throw error;
      toast.success(`Applied "${applyingTo.name}" — ${applyingTo.blocks.length} blocks added`);
      setApplyingTo(null);
      navigate(`/admin/blocks/${selectedInv}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Template Catalog
          </h1>
          <p className="text-xs text-muted-foreground">
            {ALL_TEMPLATES.length} curated designs across debut, wedding, christening, birthday, corporate, anniversary, and baby shower.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <TemplateGrid
          onPreview={(t) => setPreviewing(t)}
          onApply={(t) => setApplyingTo(t)}
          applyLabel="Use"
        />
      </div>

      <TemplatePreviewDialog
        template={previewing}
        onClose={() => setPreviewing(null)}
        onApply={(t) => {
          setPreviewing(null);
          setApplyingTo(t);
        }}
      />

      <Dialog open={!!applyingTo} onOpenChange={(o) => !o && setApplyingTo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply "{applyingTo?.name}"</DialogTitle>
            <DialogDescription>
              Choose which invitation should receive these {applyingTo?.blocks.length} blocks. They will be appended to the end.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Select value={selectedInv} onValueChange={setSelectedInv}>
              <SelectTrigger>
                <SelectValue placeholder="Select an invitation..." />
              </SelectTrigger>
              <SelectContent>
                {invitations.map((inv: any) => (
                  <SelectItem key={inv.id} value={inv.id}>
                    {inv.celebrant_name ? `${inv.celebrant_name} — ` : ""}{inv.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setApplyingTo(null)}>Cancel</Button>
            <Button onClick={apply} disabled={!selectedInv || busy}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Apply blocks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
