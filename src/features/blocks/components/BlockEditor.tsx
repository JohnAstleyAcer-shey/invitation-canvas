import { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Monitor, Smartphone, Tablet, Eye, Layers, Undo2, Redo2,
  ZoomIn, ZoomOut, Maximize2, PanelRightOpen, PanelRightClose,
  Keyboard, Download, Upload, Trash2, Copy, ChevronsUpDown,
  SplitSquareHorizontal, Grid3X3, LayoutList, Save, CheckCircle2, Loader2,
  Palette, Wand2, RotateCcw, Fullscreen, Search, Bell, Clock, Hash, MousePointer,
  Crosshair, Move, Lock, Unlock, AlignLeft, AlignCenter, AlignRight,
  ChevronLeft, ChevronRight, Settings2, Sparkles, History, FileJson,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
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
  const { blocks, isLoading, addBlock, updateBlock, removeBlock, duplicateBlock, reorderBlocks, addBlocksFromTemplate, batchUpdateBlocks } = useBlocks(invitationId);
  const { canUndo, canRedo, undo, redo } = useBlockHistory(blocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [sidebarPanel, setSidebarPanel] = useState<"blocks" | "templates" | "layers">("blocks");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

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
    types: [...new Set(blocks.map(b => b.block_type))].length,
  }), [blocks]);

  // Filtered blocks for search
  const filteredBlocks = useMemo(() => {
    if (!searchQuery) return blocks;
    const q = searchQuery.toLowerCase();
    return blocks.filter(b => {
      const def = BLOCK_REGISTRY[b.block_type as keyof typeof BLOCK_REGISTRY];
      return def?.label.toLowerCase().includes(q) || b.block_type.includes(q) ||
        JSON.stringify(b.content).toLowerCase().includes(q);
    });
  }, [blocks, searchQuery]);

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
        setShowSearch(false);
        setShowCommandBar(false);
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
      if (e.key === "h" && selectedBlockId && !e.ctrlKey && !e.metaKey) {
        const block = blocks.find(b => b.id === selectedBlockId);
        if (block) updateBlock.mutate({ id: selectedBlockId, is_visible: !block.is_visible });
      }
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        const restored = undo();
        if (restored) batchUpdateBlocks.mutate(restored);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        const restored = redo();
        if (restored) batchUpdateBlocks.mutate(restored);
      }
      // Search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
      // Command bar
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandBar(prev => !prev);
      }
      // Fullscreen
      if (e.key === "F11" || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "f")) {
        e.preventDefault();
        setIsFullscreen(prev => !prev);
      }
      // Collapse sidebar
      if (e.key === "[" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedBlockId, blocks, removeBlock, duplicateBlock, updateBlock, undo, redo, batchUpdateBlocks]);

  const handleAddBlock = useCallback((type: BlockType) => {
    addBlock.mutate({ blockType: type });
    setEditHistory(prev => [...prev, `Added ${type}`].slice(-20));
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

  const handleSelectAll = useCallback(() => {
    // Select first block
    if (blocks.length) setSelectedBlockId(blocks[0].id);
  }, [blocks]);

  const handleHideAll = useCallback(() => {
    blocks.forEach(b => updateBlock.mutate({ id: b.id, is_visible: false }));
    toast.success("All blocks hidden");
  }, [blocks, updateBlock]);

  const handleShowAll = useCallback(() => {
    blocks.forEach(b => updateBlock.mutate({ id: b.id, is_visible: true }));
    toast.success("All blocks visible");
  }, [blocks, updateBlock]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative">
            <div className="h-12 w-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <Sparkles className="h-4 w-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <p className="text-sm font-medium">Loading editor...</p>
            <p className="text-[10px] text-muted-foreground">Preparing your blocks</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-[calc(100dvh-4rem)]"} overflow-hidden`}>
      {/* Enhanced Toolbar */}
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
              {isSaving ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-0.5 text-[8px] text-muted-foreground">
                  <Loader2 className="h-2 w-2 animate-spin" /> Saving...
                </motion.span>
              ) : lastSaved ? (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-0.5 text-[8px] text-green-600">
                  <CheckCircle2 className="h-2 w-2" /> Saved
                </motion.span>
              ) : null}
            </div>
          </div>
          <Separator orientation="vertical" className="h-5 mx-1" />
          
          {/* Stats badges */}
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-[9px] shrink-0">
              <Layers className="h-2.5 w-2.5 mr-0.5" /> {blockStats.total}
            </Badge>
            {blockStats.hidden > 0 && (
              <Badge variant="outline" className="text-[9px] shrink-0 text-muted-foreground">
                <Eye className="h-2.5 w-2.5 mr-0.5" /> {blockStats.visible}
              </Badge>
            )}
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex items-center gap-1">
          {/* Undo / Redo */}
          <div className="flex border border-border rounded-md overflow-hidden mr-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none" onClick={() => { const r = undo(); if (r) batchUpdateBlocks.mutate(r); }} disabled={!canUndo}>
                  <Undo2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none" onClick={() => { const r = redo(); if (r) batchUpdateBlocks.mutate(r); }} disabled={!canRedo}>
                  <Redo2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>

          {/* Sidebar panel toggles */}
          <div className="flex border border-border rounded-md overflow-hidden mr-1">
            {([
              { key: "blocks" as const, icon: Grid3X3, tip: "Block library" },
              { key: "templates" as const, icon: ChevronsUpDown, tip: "Templates" },
              { key: "layers" as const, icon: LayoutList, tip: "Layers" },
            ]).map(({ key, icon: Icon, tip }) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <Button variant={sidebarPanel === key ? "secondary" : "ghost"} size="icon" className="h-6 w-6 rounded-none"
                    onClick={() => { setSidebarPanel(key); setSidebarCollapsed(false); }}>
                    <Icon className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{tip}</TooltipContent>
              </Tooltip>
            ))}
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

          {/* Zoom with progress indicator */}
          <div className="flex items-center gap-0.5 mx-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(z => Math.max(z - 10, 50))}>
                  <ZoomOut className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out (Ctrl+-)</TooltipContent>
            </Tooltip>
            <div className="relative w-12 h-4 flex items-center">
              <Progress value={((zoom - 50) / 100) * 100} className="h-1" />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono">{zoom}%</span>
            </div>
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
          {/* Search */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={showSearch ? "secondary" : "ghost"} size="icon" className="h-6 w-6" onClick={() => setShowSearch(!showSearch)}>
                <Search className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search blocks (Ctrl+F)</TooltipContent>
          </Tooltip>

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

          {/* Quick actions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsFullscreen(!isFullscreen)}>
                <Fullscreen className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fullscreen (F11)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleShowAll}>
                <Eye className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show all blocks</TooltipContent>
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

      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blocks by type or content..."
                className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <Badge variant="secondary" className="text-[9px]">
                  {filteredBlocks.length}/{blocks.length}
                </Badge>
              )}
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { setShowSearch(false); setSearchQuery(""); }}>
                ×
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 right-4 z-50 bg-popover border border-border rounded-xl shadow-xl p-4 w-80"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm">Keyboard Shortcuts</h3>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setShowShortcuts(false)}>×</Button>
            </div>
            <div className="space-y-1.5 text-xs max-h-64 overflow-y-auto">
              {[
                ["↑ / ↓", "Select prev/next block"],
                ["Alt + ↑/↓", "Move block up/down"],
                ["Delete", "Remove selected block"],
                ["Ctrl + D", "Duplicate block"],
                ["Ctrl + Z", "Undo"],
                ["Ctrl + Y", "Redo"],
                ["Ctrl + P", "Toggle live preview"],
                ["Ctrl + F", "Search blocks"],
                ["Ctrl + K", "Command palette"],
                ["Ctrl + [", "Toggle sidebar"],
                ["Ctrl + +/-", "Zoom in/out"],
                ["F11", "Fullscreen"],
                ["H", "Toggle block visibility"],
                ["Escape", "Deselect / close"],
                ["?", "Toggle shortcuts"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between py-0.5">
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
        {/* Left sidebar with collapse */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
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
                  onDuplicate={id => duplicateBlock.mutate(id)}
                />
              ) : (
                <BlockSidebar onAddBlock={handleAddBlock} isPending={addBlock.isPending} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar collapse toggle */}
        <div className="flex flex-col justify-center border-r border-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="px-0.5 py-4 hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{sidebarCollapsed ? "Show sidebar" : "Hide sidebar"} (Ctrl+[)</TooltipContent>
          </Tooltip>
        </div>

        {/* Canvas + Live Preview split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-hidden" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <BlockCanvas
              blocks={searchQuery ? filteredBlocks : blocks}
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
                <BlockLivePreview
                  blocks={blocks}
                  previewMode={previewMode}
                  scrollSync={scrollSyncEnabled}
                  scrollPosition={scrollPosition}
                  onScroll={setScrollPosition}
                />
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

      {/* Bottom status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between px-3 py-1 border-t border-border bg-muted/30 text-[9px] text-muted-foreground"
      >
        <div className="flex items-center gap-3">
          <span>{blockStats.total} blocks · {blockStats.visible} visible · {blockStats.types} types</span>
          {selectedBlock && (
            <span className="text-foreground font-medium">
              Selected: {BLOCK_REGISTRY[selectedBlock.block_type as keyof typeof BLOCK_REGISTRY]?.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {canUndo && <span>Undo available</span>}
          <span>{previewMode} view · {zoom}%</span>
          {lastSaved && (
            <span className="text-green-600">Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Enhanced Layers panel with drag indicators and duplicate
function BlockLayersPanel({
  blocks, selectedBlockId, onSelectBlock, onToggleVisibility, onRemove, onDuplicate,
}: {
  blocks: InvitationBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
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
            const isSelected = selectedBlockId === block.id;
            return (
              <motion.button
                key={block.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-xs transition-all group ${
                  isSelected ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "hover:bg-accent/50"
                } ${!block.is_visible ? "opacity-40" : ""}`}
                onClick={() => onSelectBlock(isSelected ? null : block.id)}
              >
                <span className="w-5 text-[9px] text-muted-foreground text-right shrink-0">{i + 1}</span>
                <span className="flex-1 truncate font-medium">{def?.label || block.block_type}</span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="h-5 w-5 flex items-center justify-center rounded-sm hover:bg-accent transition-all shrink-0"
                    onClick={e => { e.stopPropagation(); onToggleVisibility(block.id, !block.is_visible); }}
                  >
                    {block.is_visible ? <Eye className="h-2.5 w-2.5" /> : <span className="text-[8px]">👁</span>}
                  </button>
                  <button
                    className="h-5 w-5 flex items-center justify-center rounded-sm hover:bg-accent transition-all shrink-0"
                    onClick={e => { e.stopPropagation(); onDuplicate(block.id); }}
                  >
                    <Copy className="h-2.5 w-2.5" />
                  </button>
                  <button
                    className="h-5 w-5 flex items-center justify-center rounded-sm hover:bg-destructive/20 transition-all shrink-0"
                    onClick={e => { e.stopPropagation(); onRemove(block.id); }}
                  >
                    <Trash2 className="h-2.5 w-2.5 text-destructive" />
                  </button>
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
