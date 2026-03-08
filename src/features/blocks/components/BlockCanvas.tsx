import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { GripVertical, Eye, EyeOff, Copy, Trash2, Settings, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BLOCK_REGISTRY } from "../registry";
import type { InvitationBlock, BlockType } from "../types";
import { BlockPreview } from "./BlockPreview";

interface BlockCanvasProps {
  blocks: InvitationBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onReorder: (ids: string[]) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onInsertBlock: (type: BlockType, at: number) => void;
  previewMode: "mobile" | "desktop";
}

export function BlockCanvas({
  blocks, selectedBlockId, onSelectBlock,
  onReorder, onToggleVisibility, onDuplicate, onRemove,
  onMoveUp, onMoveDown, onInsertBlock, previewMode,
}: BlockCanvasProps) {
  const [showInsertAt, setShowInsertAt] = useState<number | null>(null);

  const handleReorder = useCallback((newOrder: InvitationBlock[]) => {
    onReorder(newOrder.map(b => b.id));
  }, [onReorder]);

  if (!blocks.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/50 flex items-center justify-center">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg">Start Building</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Drag blocks from the sidebar or click to add them to your invitation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className={`mx-auto ${previewMode === "mobile" ? "max-w-[375px]" : "max-w-[800px]"} transition-all`}>
        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden min-h-[600px]">
          <Reorder.Group axis="y" values={blocks} onReorder={handleReorder} className="space-y-0">
            {blocks.map((block, index) => {
              const def = BLOCK_REGISTRY[block.block_type as keyof typeof BLOCK_REGISTRY];
              const isSelected = selectedBlockId === block.id;

              return (
                <Reorder.Item key={block.id} value={block}>
                  <div
                    className={`group relative border-2 transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-primary/30"
                    } ${!block.is_visible ? "opacity-40" : ""}`}
                    onClick={() => onSelectBlock(isSelected ? null : block.id)}
                  >
                    {/* Block toolbar */}
                    <div className={`absolute -top-0 left-0 right-0 flex items-center justify-between px-1 py-0.5 bg-primary/90 text-primary-foreground text-[10px] z-10 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>
                      <div className="flex items-center gap-1">
                        <GripVertical className="h-3 w-3 cursor-grab" />
                        <span className="font-medium">{def?.label || block.block_type}</span>
                        {!block.is_visible && <Badge variant="outline" className="h-4 text-[8px] border-primary-foreground/30">Hidden</Badge>}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-primary-foreground hover:bg-primary-foreground/20"
                          onClick={e => { e.stopPropagation(); onMoveUp(index); }}>
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-primary-foreground hover:bg-primary-foreground/20"
                          onClick={e => { e.stopPropagation(); onMoveDown(index); }}>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-primary-foreground hover:bg-primary-foreground/20"
                          onClick={e => { e.stopPropagation(); onToggleVisibility(block.id, !block.is_visible); }}>
                          {block.is_visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-primary-foreground hover:bg-primary-foreground/20"
                          onClick={e => { e.stopPropagation(); onDuplicate(block.id); }}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-primary-foreground hover:bg-destructive/80"
                          onClick={e => { e.stopPropagation(); onRemove(block.id); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Block content preview */}
                    <div className="pointer-events-none">
                      <BlockPreview block={block} />
                    </div>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>
      </div>
    </div>
  );
}
