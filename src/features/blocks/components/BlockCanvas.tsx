import { useState, useCallback, useRef, useEffect } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { GripVertical, Eye, EyeOff, Copy, Trash2, ChevronUp, ChevronDown, Plus, Layers, Sparkles, ArrowUp, ArrowDown, MoreHorizontal, Hash, Grip, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BLOCK_REGISTRY, BLOCK_CATEGORIES, getBlocksByCategory } from "../registry";
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
  const [hoveredInsertIndex, setHoveredInsertIndex] = useState<number | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleReorder = useCallback((newOrder: InvitationBlock[]) => {
    onReorder(newOrder.map(b => b.id));
  }, [onReorder]);

  // Auto-scroll selected block into view
  useEffect(() => {
    if (selectedBlockId && scrollRef.current) {
      const el = scrollRef.current.querySelector(`[data-block-id="${selectedBlockId}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedBlockId]);

  if (!blocks.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4 max-w-sm"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/30 flex items-center justify-center"
          >
            <Layers className="h-10 w-10 text-primary/40" />
          </motion.div>
          <div>
            <h3 className="font-display font-semibold text-lg">Start Building Your Invitation</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click blocks from the sidebar to add them, or choose a template to get started quickly.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["cover_hero", "heading", "text", "countdown", "rsvp"].map((type, i) => {
              const def = BLOCK_REGISTRY[type as BlockType];
              return (
                <motion.div key={type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 active:scale-95"
                    onClick={() => onInsertBlock(type as BlockType, 0)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> {def.label}
                  </Button>
                </motion.div>
              );
            })}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="pt-2">
            <p className="text-[10px] text-muted-foreground/50 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" /> Pro tip: Use templates for instant layouts
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4" ref={scrollRef}>
      <div className={`mx-auto ${previewMode === "mobile" ? "max-w-[375px]" : "max-w-[800px]"} transition-all duration-300 w-full`}>
        {/* Device frame */}
        <div className={`bg-background border border-border rounded-xl shadow-sm overflow-hidden min-h-[600px] ${
          previewMode === "mobile" ? "ring-4 ring-border/50 rounded-[2rem]" : ""
        }`}>
          {/* Mobile notch */}
          {previewMode === "mobile" && (
            <div className="flex justify-center py-1.5 bg-border/20">
              <div className="w-20 h-1 rounded-full bg-border/50" />
            </div>
          )}

          {/* Insert zone at top */}
          <InsertZone index={0} isHovered={hoveredInsertIndex === 0}
            onHover={() => setHoveredInsertIndex(0)} onLeave={() => setHoveredInsertIndex(null)}
            onInsert={type => onInsertBlock(type, 0)} />

          <Reorder.Group axis="y" values={blocks} onReorder={handleReorder} className="space-y-0">
            {blocks.map((block, index) => {
              const def = BLOCK_REGISTRY[block.block_type as keyof typeof BLOCK_REGISTRY];
              const isSelected = selectedBlockId === block.id;
              const isDragging = draggedBlockId === block.id;
              const isHovered = hoveredBlockId === block.id;

              return (
                <Reorder.Item
                  key={block.id}
                  value={block}
                  onDragStart={() => setDraggedBlockId(block.id)}
                  onDragEnd={() => setDraggedBlockId(null)}
                >
                  <motion.div
                    layout
                    data-block-id={block.id}
                    onMouseEnter={() => setHoveredBlockId(block.id)}
                    onMouseLeave={() => setHoveredBlockId(null)}
                    className={`group relative border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 shadow-lg"
                        : isDragging
                          ? "border-primary/50 shadow-xl scale-[1.02]"
                          : isHovered
                            ? "border-primary/30"
                            : "border-transparent"
                    } ${!block.is_visible ? "opacity-30" : ""}`}
                    onClick={() => onSelectBlock(isSelected ? null : block.id)}
                  >
                    {/* Block toolbar */}
                    <AnimatePresence>
                      {(isSelected || isDragging) && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute -top-0.5 left-0 right-0 flex items-center justify-between px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] z-10 rounded-t-sm"
                        >
                          <div className="flex items-center gap-1.5">
                            <GripVertical className="h-3 w-3 cursor-grab active:cursor-grabbing" />
                            <span className="font-medium">{def?.label || block.block_type}</span>
                            <span className="opacity-50 font-mono">#{index + 1}</span>
                            {!block.is_visible && (
                              <Badge variant="outline" className="h-3.5 text-[7px] border-primary-foreground/30 py-0">Hidden</Badge>
                            )}
                          </div>
                          <div className="flex items-center">
                            <ToolbarButton icon={<ArrowUp className="h-3 w-3" />} onClick={e => { e.stopPropagation(); onMoveUp(index); }} disabled={index === 0} />
                            <ToolbarButton icon={<ArrowDown className="h-3 w-3" />} onClick={e => { e.stopPropagation(); onMoveDown(index); }} disabled={index === blocks.length - 1} />
                            <ToolbarButton icon={block.is_visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                              onClick={e => { e.stopPropagation(); onToggleVisibility(block.id, !block.is_visible); }} />
                            <ToolbarButton icon={<Copy className="h-3 w-3" />} onClick={e => { e.stopPropagation(); onDuplicate(block.id); }} />
                            <ToolbarButton icon={<Trash2 className="h-3 w-3" />} onClick={e => { e.stopPropagation(); onRemove(block.id); }} danger />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Hover toolbar */}
                    {!isSelected && !isDragging && isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-0 left-0 right-0 flex items-center justify-between px-1.5 py-0.5 bg-primary/90 text-primary-foreground text-[10px] z-10 rounded-t-sm"
                      >
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="h-3 w-3 cursor-grab active:cursor-grabbing" />
                          <span className="font-medium">{def?.label || block.block_type}</span>
                        </div>
                        <div className="flex items-center">
                          <ToolbarButton icon={<Copy className="h-3 w-3" />} onClick={e => { e.stopPropagation(); onDuplicate(block.id); }} />
                          <ToolbarButton icon={<Trash2 className="h-3 w-3" />} onClick={e => { e.stopPropagation(); onRemove(block.id); }} danger />
                        </div>
                      </motion.div>
                    )}

                    {/* Block content preview */}
                    <div className="pointer-events-none select-none">
                      <BlockPreview block={block} />
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div layoutId="block-selection-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l" />
                    )}
                  </motion.div>

                  {/* Insert zone */}
                  <InsertZone
                    index={index + 1}
                    isHovered={hoveredInsertIndex === index + 1}
                    onHover={() => setHoveredInsertIndex(index + 1)}
                    onLeave={() => setHoveredInsertIndex(null)}
                    onInsert={type => onInsertBlock(type, index + 1)}
                  />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>

        {/* Bottom info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-3 space-y-2">
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> {blocks.length} block{blocks.length !== 1 ? "s" : ""}</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {blocks.filter(b => b.is_visible).length} visible</span>
            {blocks.filter(b => !b.is_visible).length > 0 && (
              <span className="flex items-center gap-1"><EyeOff className="h-3 w-3" /> {blocks.filter(b => !b.is_visible).length} hidden</span>
            )}
          </div>
          <p className="text-[9px] text-muted-foreground/50">Click a block to edit · Drag to reorder · Hover between blocks to insert</p>
        </motion.div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon, onClick, disabled, danger }: {
  icon: React.ReactNode; onClick: (e: React.MouseEvent) => void; disabled?: boolean; danger?: boolean;
}) {
  return (
    <button
      className={`h-5 w-5 flex items-center justify-center rounded-sm transition-colors ${
        danger ? "hover:bg-destructive/80" : "hover:bg-primary-foreground/20"
      } disabled:opacity-30`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}

function InsertZone({ index, isHovered, onHover, onLeave, onInsert }: {
  index: number; isHovered: boolean;
  onHover: () => void; onLeave: () => void;
  onInsert: (type: BlockType) => void;
}) {
  return (
    <div
      className="relative h-3 group/insert transition-all"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 transition-all ${
        isHovered ? "bg-primary" : "bg-transparent group-hover/insert:bg-primary/30"
      }`} />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Plus className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="max-h-72 overflow-y-auto w-52">
                {BLOCK_CATEGORIES.map(cat => (
                  <div key={cat.key}>
                    <DropdownMenuSeparator />
                    <p className="px-2 py-1 text-[9px] font-semibold uppercase text-muted-foreground tracking-wider">{cat.label}</p>
                    {getBlocksByCategory(cat.key).map(block => (
                      <DropdownMenuItem key={block.type} onClick={() => onInsert(block.type)} className="text-xs cursor-pointer">
                        <span className="flex-1">{block.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
