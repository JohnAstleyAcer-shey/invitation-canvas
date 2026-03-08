import { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Monitor, Smartphone, Tablet, Eye, Layers, Undo2, Redo2,
  ZoomIn, ZoomOut, Maximize2, PanelRightOpen, PanelRightClose,
  Keyboard, Download, Upload, Trash2, Copy, ChevronsUpDown,
  SplitSquareHorizontal, Grid3X3, LayoutList, Save, CheckCircle2, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockSidebar } from "./BlockSidebar";
import { BlockCanvas } from "./BlockCanvas";
import { BlockSettings } from "./BlockSettings";
import { BlockTemplatePanel } from "./BlockTemplatePanel";
import { BlockLivePreview } from "./BlockLivePreview";
import { useBlocks, useBlockHistory } from "../hooks/useBlocks";
import { BLOCK_REGISTRY } from "../registry";
import type { BlockType, BlockContent, BlockStyle, InvitationBlock } from "../types";
import { toast } from "sonner";

interface BlockEditorProps {
  invitationId: string;
  invitationTitle: string;
  invitationSlug: string;
}

export function BlockEditor({ invitationId, invitationTitle, invitationSlug }: BlockEditorProps) {
  const { blocks, isLoading, addBlock, updateBlock, removeBlock, duplicateBlock, reorderBlocks, addBlocksFromTemplate } = useBlocks(invitationId);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [sidebarPanel, setSidebarPanel] = useState<"blocks" | "templates" | "layers">("blocks");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Track save state from mutations
  useEffect(() => {
    if (updateBlock.isPending || addBlock.isPending || removeBlock.isPending || reorderBlocks.isPending) {
      setIsSaving(true);
    } else {
      if (isSaving) {
        setLastSaved(new Date());
        setIsSaving(false);
      }
    }
  }, [updateBlock.isPending, addBlock.isPending, removeBlock.isPending, reorderBlocks.isPending]);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Block stats
  const blockStats = useMemo(() => ({
    total: blocks.length,
    visible: blocks.filter(b => b.is_visible).length,
    hidden: blocks.filter(b => !b.is_visible).length,
  }), [blocks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedBlockId) {
        e.preventDefault();
        removeBlock.mutate(selectedBlockId);
        setSelectedBlockId(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedBlockId) {
        e.preventDefault();
        duplicateBlock.mutate(selectedBlockId);
      }
      if (e.key === "Escape") {
        setSelectedBlockId(null);
        setShowShortcuts(false);
      }
      if (e.key === "ArrowUp" && e.altKey && selectedBlockId) {
        e.preventDefault();
        const idx = blocks.findIndex(b => b.id === selectedBlockId);
        if (idx > 0) handleMoveUp(idx);
      }
      if (e.key === "ArrowDown" && e.altKey && selectedBlockId) {
        e.preventDefault();
        const idx = blocks.findIndex(b => b.id === selectedBlockId);
        if (idx < blocks.length - 1) handleMoveDown(idx);
      }
      if (e.key === "ArrowUp" && !e.altKey && !e.ctrlKey) {
        const idx = blocks.findIndex(b => b.id === selectedBlockId);
        if (idx > 0) setSelectedBlockId(blocks[idx - 1].id);
        else if (blocks.length) setSelectedBlockId(blocks[blocks.length - 1].id);
      }
      if (e.key === "ArrowDown" && !e.altKey && !e.ctrlKey) {
        const idx = blocks.findIndex(b => b.id === selectedBlockId);
        if (idx < blocks.length - 1) setSelectedBlockId(blocks[idx + 1].id);
        else if (blocks.length) setSelectedBlockId(blocks[0].id);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setShowLivePreview(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "=") {
        e.preventDefault();
        setZoom(z => Math.min(z + 10, 150));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        setZoom(z => Math.max(z - 10, 50));
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts(prev => !prev);
      }
      // Toggle visibility of selected block
      if (e.key === "h" && selectedBlockId && !e.ctrlKey && !e.metaKey) {
        const block = blocks.find(b => b.id === selectedBlockId);
        if (block) updateBlock.mutate({ id: selectedBlockId, is_visible: !block.is_visible });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedBlockId, blocks, removeBlock, duplicateBlock, updateBlock]);

  const handleAddBlock = useCallback((type: BlockType) => {
    addBlock.mutate({ blockType: type });
  }, [addBlock]);

  const handleUpdateBlock = useCallback((content?: BlockContent, style?: BlockStyle) => {
    if (!selectedBlockId) return;
    updateBlock.mutate({ id: selectedBlockId, content, style });
  }, [selectedBlockId, updateBlock]);

  const handleMoveUp = useCallback((index: number) => {
    if (index <= 0) return;
    const ids = blocks.map(b => b.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    reorderBlocks.mutate(ids);
  }, [blocks, reorderBlocks]);

  const handleMoveDown = useCallback((index: number) => {
    if (index >= blocks.length - 1) return;
    const ids = blocks.map(b => b.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    reorderBlocks.mutate(ids);
  }, [blocks, reorderBlocks]);

  const handleInsertBlock = useCallback((type: BlockType, at: number) => {
    addBlock.mutate({ blockType: type, insertAt: at });
  }, [addBlock]);

  const handleClearAll = useCallback(() => {
    if (!confirm("Remove all blocks? This cannot be undone.")) return;
    blocks.forEach(b => removeBlock.mutate(b.id));
    setSelectedBlockId(null);
  }, [blocks, removeBlock]);

  const handleExportBlocks = useCallback(() => {
    const data = blocks.map(b => ({
      block_type: b.block_type,
      content: b.content,
      style: b.style,
      is_visible: b.is_visible,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invitationSlug}-blocks.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Blocks exported");
  }, [blocks, invitationSlug]);

  const handleImportBlocks = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error("Invalid format");
        addBlocksFromTemplate.mutate(data);
        toast.success("Blocks imported");
      } catch {
        toast.error("Invalid block file");
      }
    };
    input.click();
  }, [addBlocksFromTemplate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Loading blocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 border-b border-border bg-card gap-1 sm:gap-2 overflow-x-auto">
        {/* Left: Back + title + save status */}
        <div className="flex items-center gap-2 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                <Link to="/admin"><ArrowLeft className="h-3.5 w-3.5" /></Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to dashboard</TooltipContent>
          </Tooltip>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-xs truncate">{invitationTitle}</h2>
            <div className="flex items-center gap-1.5">
              <p className="text-[9px] text-muted-foreground truncate">/invite/{invitationSlug}</p>
              {/* Save indicator */}
              {isSaving ? (
                <span className="flex items-center gap-0.5 text-[8px] text-muted-foreground">
                  <Loader2 className="h-2 w-2 animate-spin" /> Saving...
                </span>
              ) : lastSaved ? (
                <span className="flex items-center gap-0.5 text-[8px] text-green-600">
                  <CheckCircle2 className="h-2 w-2" /> Saved
                </span>
              ) : null}
            </div>
          </div>
          <Separator orientation="vertical" className="h-5 mx-1" />
          <Badge variant="secondary" className="text-[9px] shrink-0">
            <Layers className="h-2.5 w-2.5 mr-0.5" /> {blockStats.total}
          </Badge>
        </div>

        {/* Center: Device + Zoom + Sidebar toggles */}
        <div className="flex items-center gap-1">
          {/* Sidebar panel toggles */}
          <div className="flex border border-border rounded-md overflow-hidden mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={sidebarPanel === "blocks" ? "secondary" : "ghost"} size="icon" className="h-6 w-6 rounded-none"
                  onClick={() => setSidebarPanel("blocks")}>
                  <Grid3X3 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Block library</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={sidebarPanel === "templates" ? "secondary" : "ghost"} size="icon" className="h-6 w-6 rounded-none"
                  onClick={() => setSidebarPanel("templates")}>
                  <ChevronsUpDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Templates</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={sidebarPanel === "layers" ? "secondary" : "ghost"} size="icon" className="h-6 w-6 rounded-none"
                  onClick={() => setSidebarPanel("layers")}>
                  <LayoutList className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Layers</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-5" />

          {/* Device preview */}
          <div className="flex border border-border rounded-md overflow-hidden mx-1">
            {(["mobile", "tablet", "desktop"] as const).map(mode => (
              <Tooltip key={mode}>
                <TooltipTrigger asChild>
                  <Button variant={previewMode === mode ? "secondary" : "ghost"} size="icon" className="h-6 w-6 rounded-none"
                    onClick={() => setPreviewMode(mode)}>
                    {mode === "mobile" ? <Smartphone className="h-3 w-3" /> :
                     mode === "tablet" ? <Tablet className="h-3 w-3" /> :
                     <Monitor className="h-3 w-3" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="capitalize">{mode}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="h-5" />

          {/* Zoom */}
          <div className="flex items-center gap-0.5 mx-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(z => Math.max(z - 10, 50))}>
                  <ZoomOut className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out (Ctrl+-)</TooltipContent>
            </Tooltip>
            <span className="text-[9px] w-8 text-center font-mono">{zoom}%</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(z => Math.min(z + 10, 150))}>
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in (Ctrl+=)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(100)}>
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset zoom</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={showLivePreview ? "default" : "outline"} size="sm" className="h-6 text-[10px] gap-1"
                onClick={() => setShowLivePreview(!showLivePreview)}>
                <SplitSquareHorizontal className="h-3 w-3" />
                <span className="hidden sm:inline">{showLivePreview ? "Hide" : "Preview"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle live preview (Ctrl+P)</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleExportBlocks}>
                <Download className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export blocks</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleImportBlocks}>
                <Upload className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import blocks</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClearAll} disabled={!blocks.length}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear all blocks</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowShortcuts(!showShortcuts)}>
                <Keyboard className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Keyboard shortcuts (?)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 text-[10px]" asChild>
                <a href={`/invite/${invitationSlug}`} target="_blank" rel="noopener">
                  <Eye className="h-3 w-3 mr-1" /> Open
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open live page</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Keyboard shortcuts overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 right-4 z-50 bg-popover border border-border rounded-xl shadow-xl p-4 w-72"
          >
            <h3 className="font-display font-bold text-sm mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-1.5 text-xs">
              {[
                ["↑ / ↓", "Select prev/next block"],
                ["Alt + ↑/↓", "Move block up/down"],
                ["Delete", "Remove selected block"],
                ["Ctrl + D", "Duplicate block"],
                ["Ctrl + P", "Toggle live preview"],
                ["Ctrl + +/-", "Zoom in/out"],
                ["H", "Toggle block visibility"],
                ["Escape", "Deselect / close"],
                ["?", "Toggle shortcuts"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{desc}</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">{key}</kbd>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        {sidebarPanel === "templates" ? (
          <BlockTemplatePanel invitationId={invitationId} onApplyTemplate={(templateBlocks) => {
            addBlocksFromTemplate.mutate(templateBlocks);
            setSidebarPanel("blocks");
          }} />
        ) : sidebarPanel === "layers" ? (
          <BlockLayersPanel
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onToggleVisibility={(id, v) => updateBlock.mutate({ id, is_visible: v })}
            onRemove={id => { removeBlock.mutate(id); if (selectedBlockId === id) setSelectedBlockId(null); }}
          />
        ) : (
          <BlockSidebar onAddBlock={handleAddBlock} isPending={addBlock.isPending} />
        )}

        {/* Canvas + Live Preview split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-hidden" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <BlockCanvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onReorder={(ids) => reorderBlocks.mutate(ids)}
              onToggleVisibility={(id, visible) => updateBlock.mutate({ id, is_visible: visible })}
              onDuplicate={(id) => duplicateBlock.mutate(id)}
              onRemove={(id) => { removeBlock.mutate(id); if (selectedBlockId === id) setSelectedBlockId(null); }}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onInsertBlock={handleInsertBlock}
              previewMode={previewMode === "tablet" ? "desktop" : previewMode}
            />
          </div>

          {/* Live preview panel */}
          <AnimatePresence>
            {showLivePreview && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: previewMode === "mobile" ? 375 : previewMode === "tablet" ? 500 : 600, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-l border-border overflow-hidden flex flex-col bg-background"
              >
                <BlockLivePreview blocks={blocks} previewMode={previewMode} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right settings panel */}
        {selectedBlock && showSettings && (
          <BlockSettings
            key={selectedBlock.id}
            block={selectedBlock}
            onUpdate={handleUpdateBlock}
            onClose={() => setSelectedBlockId(null)}
          />
        )}
      </div>
    </div>
  );
}

// Layers panel
function BlockLayersPanel({
  blocks, selectedBlockId, onSelectBlock, onToggleVisibility, onRemove,
}: {
  blocks: InvitationBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h3 className="font-display font-bold text-sm">Layers</h3>
        <p className="text-[10px] text-muted-foreground">{blocks.length} blocks · {blocks.filter(b => b.is_visible).length} visible</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-1">
          {blocks.map((block, i) => {
            const def = BLOCK_REGISTRY[block.block_type as keyof typeof BLOCK_REGISTRY];
            return (
              <motion.button
                key={block.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-xs transition-colors group ${
                  selectedBlockId === block.id ? "bg-primary/10 text-primary" : "hover:bg-accent/50"
                } ${!block.is_visible ? "opacity-40" : ""}`}
                onClick={() => onSelectBlock(selectedBlockId === block.id ? null : block.id)}
              >
                <span className="w-5 text-[9px] text-muted-foreground text-right shrink-0">{i + 1}</span>
                <span className="flex-1 truncate font-medium">{def?.label || block.block_type}</span>
                <button
                  className="h-5 w-5 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 hover:bg-accent transition-all shrink-0"
                  onClick={e => { e.stopPropagation(); onToggleVisibility(block.id, !block.is_visible); }}
                >
                  {block.is_visible ? <Eye className="h-2.5 w-2.5" /> : <span className="text-[8px]">👁</span>}
                </button>
                <button
                  className="h-5 w-5 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all shrink-0"
                  onClick={e => { e.stopPropagation(); onRemove(block.id); }}
                >
                  <Trash2 className="h-2.5 w-2.5 text-destructive" />
                </button>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
