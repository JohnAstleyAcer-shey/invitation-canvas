import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { GripVertical, Eye, EyeOff, Palette, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PAGE_TYPE_LABELS, STYLE_VARIANT_LABELS, type StyleVariant } from "../types";
import type { Tables } from "@/integrations/supabase/types";

type InvitationPage = Tables<"invitation_pages">;

interface DragDropPageListProps {
  pages: InvitationPage[];
  onToggle: (id: string, enabled: boolean) => void;
  onVariantChange: (id: string, variant: StyleVariant) => void;
  onReorder: (pageIds: string[]) => void;
}

export function DragDropPageList({ pages, onToggle, onVariantChange, onReorder }: DragDropPageListProps) {
  const [items, setItems] = useState(pages);

  // Sync from props when pages change externally
  if (pages.length !== items.length || pages.some((p, i) => p.id !== items[i]?.id)) {
    setItems(pages);
  }

  const handleReorder = useCallback((newItems: InvitationPage[]) => {
    setItems(newItems);
  }, []);

  const handleDragEnd = useCallback(() => {
    onReorder(items.map(p => p.id));
  }, [items, onReorder]);

  const enabledCount = items.filter(p => p.is_enabled).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Drag to reorder sections. {enabledCount} of {items.length} enabled.
        </p>
        <Badge variant="outline" className="text-xs">
          {enabledCount} active
        </Badge>
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-2"
      >
        <AnimatePresence>
          {items.map((page, idx) => (
            <Reorder.Item
              key={page.id}
              value={page}
              onDragEnd={handleDragEnd}
              className="list-none"
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: idx * 0.02 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-grab active:cursor-grabbing ${
                  page.is_enabled
                    ? "bg-card border-border hover:border-primary/30"
                    : "bg-muted/30 border-border/50"
                }`}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                
                <span className="text-xs font-mono text-muted-foreground w-5 text-center shrink-0">
                  {idx + 1}
                </span>

                <Switch
                  checked={page.is_enabled}
                  onCheckedChange={(v) => onToggle(page.id, v)}
                />

                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium truncate block ${
                    !page.is_enabled ? "text-muted-foreground line-through" : ""
                  }`}>
                    {page.custom_title || PAGE_TYPE_LABELS[page.page_type as keyof typeof PAGE_TYPE_LABELS] || page.page_type}
                  </span>
                  {page.custom_title && (
                    <span className="text-[10px] text-muted-foreground">
                      {PAGE_TYPE_LABELS[page.page_type as keyof typeof PAGE_TYPE_LABELS]}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {page.is_enabled ? (
                    <Eye className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}

                  <Select
                    value={page.style_variant}
                    onValueChange={(v) => onVariantChange(page.id, v as StyleVariant)}
                  >
                    <SelectTrigger className="w-24 h-7 text-[10px] rounded-lg border-border/50">
                      <Palette className="h-3 w-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STYLE_VARIANT_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}
