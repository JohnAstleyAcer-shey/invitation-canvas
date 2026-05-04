import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Copy, Trash2, Plus, Layers, Sparkles, ArrowUp, ArrowDown, GripVertical, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { BLOCK_REGISTRY, BLOCK_CATEGORIES, getBlocksByCategory } from "../registry";
import type { InvitationBlock, BlockType } from "../types";
import { BlockViewRenderer } from "./BlockViewRenderer";

interface BlockCanvasProps {
  blocks: InvitationBlock[];
  invitationId: string;
  selectedBlockId: string | null;
  multiSelectedIds?: Set<string>;
  onSelectBlock: (id: string | null) => void;
  onMultiSelect?: (id: string, shiftKey: boolean) => void;
  onReorder: (ids: string[]) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onInsertBlock: (type: BlockType, at: number) => void;
  previewMode: "mobile" | "tablet" | "desktop";
  onOpenSettings?: () => void;
}

/**
 * BlockCanvas — renders blocks using the SAME `BlockViewRenderer` as the live invitation,
 * so editor preview is 1:1 with the public guest view. Each rendered page gets an overlay
 * with selection / quick-action controls.
 */
export function BlockCanvas({
  blocks, invitationId, selectedBlockId, multiSelectedIds = new Set(),
  onSelectBlock, onMultiSelect, onReorder, onToggleVisibility, onDuplicate, onRemove,
  onMoveUp, onMoveDown, onInsertBlock, previewMode, onOpenSettings,
}: BlockCanvasProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected block into view
  useEffect(() => {
    if (selectedBlockId && scrollRef.current) {
      const el = scrollRef.current.querySelector(`[data-block-id="${selectedBlockId}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedBlockId]);

  if (!blocks.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-5 max-w-md">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/10 to-accent/30 flex items-center justify-center">
            <Layers className="h-12 w-12 text-primary/40" />
          </motion.div>
          <div>
            <h3 className="font-display font-semibold text-xl">Start building</h3>
            <p className="text-sm text-muted-foreground mt-1.5">Add your first block from the library, or pick a template to get going quickly.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {(["cover_hero", "heading", "countdown", "rsvp", "gallery"] as BlockType[]).map((type, i) => {
              const def = BLOCK_REGISTRY[type];
              return (
                <motion.div key={type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                  <Button variant="outline" size="sm" className="text-xs rounded-full" onClick={() => onInsertBlock(type, 0)}>
                    <Plus className="h-3 w-3" /> {def.label}
                  </Button>
                </motion.div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1 pt-2">
            <Sparkles className="h-3 w-3" /> Tip: press <kbd className="px-1 py-0.5 rounded bg-muted">⌘K</kbd> for the command palette
          </p>
        </motion.div>
      </div>
    );
  }

  // Device frame width
  const frameWidth = previewMode === "mobile" ? "max-w-[390px]" : previewMode === "tablet" ? "max-w-[768px]" : "max-w-[1100px]";
  const frameClass = previewMode === "mobile" ? "rounded-[2.5rem] ring-[10px] ring-foreground/5 shadow-2xl" : previewMode === "tablet" ? "rounded-[1.5rem] ring-[8px] ring-foreground/5 shadow-xl" : "rounded-2xl shadow-lg";

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto bg-muted/20 px-2 sm:px-6 py-4 sm:py-6">
      <div className={`mx-auto w-full ${frameWidth} transition-all duration-300`}>
        {/* Device chrome */}
        {previewMode === "mobile" && (
          <div className="flex items-center justify-between px-4 py-1.5 text-[9px] text-muted-foreground tabular-nums">
            <span>9:41</span>
            <span>{blocks.length} pages · {previewMode}</span>
          </div>
        )}

        <div className={`bg-background overflow-hidden ${frameClass}`}>
          {previewMode === "mobile" && (
            <div className="flex justify-center pt-1.5 pb-1 bg-foreground/5">
              <div className="w-24 h-1 rounded-full bg-foreground/20" />
            </div>
          )}

          {/* Insert at top */}
          <InsertBar onInsert={(type) => onInsertBlock(type, 0)} compact />

          <div className="divide-y divide-border/40">
            {blocks.map((block, index) => {
              const def = BLOCK_REGISTRY[block.block_type as keyof typeof BLOCK_REGISTRY];
              const isSelected = selectedBlockId === block.id;
              const isMultiSelected = multiSelectedIds.has(block.id);
              const isHovered = hoveredId === block.id;

              return (
                <div key={block.id} data-block-id={block.id}>
                  {/* Page indicator */}
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-muted/30 text-[10px] text-muted-foreground sticky top-0 z-20 backdrop-blur">
                    <span className="font-mono opacity-50">P{index + 1}</span>
                    <span className="font-medium truncate">{def?.label || block.block_type}</span>
                    {!block.is_visible && <Badge variant="outline" className="h-4 text-[8px]">Hidden</Badge>}
                    <span className="flex-1" />
                    <button onClick={() => onMoveUp(index)} disabled={index === 0}
                      className="h-5 w-5 rounded hover:bg-accent disabled:opacity-30 flex items-center justify-center"><ArrowUp className="h-3 w-3" /></button>
                    <button onClick={() => onMoveDown(index)} disabled={index === blocks.length - 1}
                      className="h-5 w-5 rounded hover:bg-accent disabled:opacity-30 flex items-center justify-center"><ArrowDown className="h-3 w-3" /></button>
                    <button onClick={() => onToggleVisibility(block.id, !block.is_visible)}
                      className="h-5 w-5 rounded hover:bg-accent flex items-center justify-center">
                      {block.is_visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </button>
                    <button onClick={() => onDuplicate(block.id)}
                      className="h-5 w-5 rounded hover:bg-accent flex items-center justify-center"><Copy className="h-3 w-3" /></button>
                    <button onClick={() => { if (confirm("Delete this block?")) { onRemove(block.id); } }}
                      className="h-5 w-5 rounded hover:bg-destructive/10 hover:text-destructive flex items-center justify-center"><Trash2 className="h-3 w-3" /></button>
                  </div>

                  {/* Real invitation render - 1:1 with guest view */}
                  <div
                    onMouseEnter={() => setHoveredId(block.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={(e) => {
                      if ((e.ctrlKey || e.metaKey || e.shiftKey) && onMultiSelect) {
                        e.preventDefault();
                        onMultiSelect(block.id, e.shiftKey);
                      } else {
                        onSelectBlock(isSelected ? null : block.id);
                        if (!isSelected) onOpenSettings?.();
                      }
                    }}
                    className={`relative cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-primary ring-inset" :
                      isMultiSelected ? "ring-2 ring-primary/50 ring-inset bg-primary/[0.03]" :
                      isHovered ? "ring-2 ring-primary/30 ring-inset" : ""
                    } ${!block.is_visible ? "opacity-40" : ""}`}
                  >
                    {/* Render block at "page" height — scaled to fit canvas */}
                    <div className="pointer-events-none select-none">
                      <BlockViewRenderer blocks={[block]} invitationId={invitationId} />
                    </div>

                    {/* Hover quick-edit fab */}
                    <AnimatePresence>
                      {(isHovered || isSelected) && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={(e) => { e.stopPropagation(); onSelectBlock(block.id); onOpenSettings?.(); }}
                          className="absolute top-3 right-3 h-9 px-3 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg flex items-center gap-1.5 z-10"
                        >
                          <Settings2 className="h-3.5 w-3.5" /> Edit
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Insert between */}
                  <InsertBar onInsert={(type) => onInsertBlock(type, index + 1)} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-4 mb-8 text-[10px] text-muted-foreground">
          <span className="flex items-center justify-center gap-3 flex-wrap">
            <span><Layers className="h-3 w-3 inline mr-1" /> {blocks.length} pages</span>
            <span><Eye className="h-3 w-3 inline mr-1" /> {blocks.filter(b => b.is_visible).length} visible</span>
            <span className="opacity-60">{previewMode} preview · matches live invitation</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function InsertBar({ onInsert, compact }: { onInsert: (type: BlockType) => void; compact?: boolean }) {
  return (
    <div className={`group/insert relative flex items-center justify-center transition-all ${compact ? "h-2 hover:h-7" : "h-3 hover:h-8"}`}>
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-px bg-transparent group-hover/insert:bg-primary/40 transition-colors" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="opacity-0 group-hover/insert:opacity-100 transition-opacity relative h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="max-h-80 w-56 overflow-y-auto">
          {BLOCK_CATEGORIES.map((cat, i) => (
            <div key={cat.key}>
              {i > 0 && <DropdownMenuSeparator />}
              <p className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{cat.label}</p>
              {getBlocksByCategory(cat.key).map(block => (
                <DropdownMenuItem key={block.type} onClick={() => onInsert(block.type)} className="text-xs">
                  {block.label}
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
