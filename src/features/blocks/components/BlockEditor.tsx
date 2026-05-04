import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Monitor, Smartphone, Tablet, Eye, Layers, Undo2, Redo2,
  Maximize2, Save, CheckCircle2, Loader2, Sparkles, Plus, Settings2,
  Trash2, Copy, Search, Command, Keyboard, Download, Upload, Share2,
  PanelLeft, X, MoreHorizontal, ChevronDown, Wand2, Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { BlockSidebar } from "./BlockSidebar";
import { BlockCanvas } from "./BlockCanvas";
import { BlockSettings } from "./BlockSettings";
import { BlockTemplatePanel } from "./BlockTemplatePanel";
import { useBlocks, useBlockHistory } from "../hooks/useBlocks";
import { BLOCK_REGISTRY } from "../registry";
import type { BlockType, BlockContent, BlockStyle } from "../types";
import { toast } from "sonner";

interface BlockEditorProps {
  invitationId: string;
  invitationTitle: string;
  invitationSlug: string;
}

interface ClipboardBlock { block_type: BlockType; content: BlockContent; style: BlockStyle; }
type Device = "mobile" | "tablet" | "desktop";
type SidePanel = "blocks" | "templates" | null;

export function BlockEditor({ invitationId, invitationTitle, invitationSlug }: BlockEditorProps) {
  const { blocks, isLoading, addBlock, updateBlock, removeBlock, duplicateBlock, reorderBlocks, addBlocksFromTemplate, batchUpdateBlocks } = useBlocks(invitationId);
  const { canUndo, canRedo, undo, redo } = useBlockHistory(blocks);
  const isMobile = useIsMobile();

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<Device>(isMobile ? "mobile" : "desktop");
  const [sidePanel, setSidePanel] = useState<SidePanel>(isMobile ? null : "blocks");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [clipboard, setClipboard] = useState<ClipboardBlock | null>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

  // Auto-open settings when block selected
  useEffect(() => {
    if (selectedBlock) setSettingsOpen(true);
  }, [selectedBlockId]);

  // Save state tracking
  useEffect(() => {
    if (updateBlock.isPending || addBlock.isPending || removeBlock.isPending || reorderBlocks.isPending) {
      setIsSaving(true);
    } else if (isSaving) {
      setLastSaved(new Date());
      setIsSaving(false);
    }
  }, [updateBlock.isPending, addBlock.isPending, removeBlock.isPending, reorderBlocks.isPending]);

  // Force mobile preview on small screens
  useEffect(() => {
    if (isMobile && previewMode === "desktop") setPreviewMode("mobile");
  }, [isMobile]);

  const handleAddBlock = useCallback((type: BlockType) => {
    addBlock.mutate({ blockType: type });
    if (isMobile) setSidePanel(null);
  }, [addBlock, isMobile]);

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

  const handleCopyBlock = useCallback(() => {
    if (!selectedBlock) return;
    setClipboard({
      block_type: selectedBlock.block_type as BlockType,
      content: structuredClone(selectedBlock.content) as BlockContent,
      style: structuredClone(selectedBlock.style) as BlockStyle,
    });
    toast.success("Block copied");
  }, [selectedBlock]);

  const handlePasteBlock = useCallback(() => {
    if (!clipboard) return;
    addBlocksFromTemplate.mutate([clipboard]);
    toast.success("Block pasted");
  }, [clipboard, addBlocksFromTemplate]);

  const handleExport = useCallback(() => {
    const data = blocks.map(b => ({ block_type: b.block_type, content: b.content, style: b.style, is_visible: b.is_visible }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${invitationSlug}-blocks.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Blocks exported");
  }, [blocks, invitationSlug]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (!Array.isArray(data)) throw new Error();
        addBlocksFromTemplate.mutate(data);
        toast.success("Blocks imported");
      } catch { toast.error("Invalid block file"); }
    };
    input.click();
  }, [addBlocksFromTemplate]);

  // Command palette items
  const commandItems = useMemo(() => {
    const items = [
      ...Object.values(BLOCK_REGISTRY).map(def => ({
        label: `Add ${def.label}`, category: "Add Block",
        action: () => { addBlock.mutate({ blockType: def.type }); setShowCommandBar(false); },
      })),
      { label: "Open Block Library", category: "Panels", action: () => { setSidePanel("blocks"); setShowCommandBar(false); } },
      { label: "Open Templates", category: "Panels", action: () => { setSidePanel("templates"); setShowCommandBar(false); } },
      { label: "Mobile preview", category: "View", action: () => { setPreviewMode("mobile"); setShowCommandBar(false); } },
      { label: "Tablet preview", category: "View", action: () => { setPreviewMode("tablet"); setShowCommandBar(false); } },
      { label: "Desktop preview", category: "View", action: () => { setPreviewMode("desktop"); setShowCommandBar(false); } },
      { label: "Export blocks", category: "File", action: () => { handleExport(); setShowCommandBar(false); } },
      { label: "Import blocks", category: "File", action: () => { handleImport(); setShowCommandBar(false); } },
      { label: "Open live page", category: "Navigation", action: () => { window.open(`/invite/${invitationSlug}`, "_blank"); setShowCommandBar(false); } },
      { label: "Undo", category: "Edit", action: () => { const r = undo(); if (r) batchUpdateBlocks.mutate(r); setShowCommandBar(false); } },
      { label: "Redo", category: "Edit", action: () => { const r = redo(); if (r) batchUpdateBlocks.mutate(r); setShowCommandBar(false); } },
    ];
    if (!commandSearch) return items.slice(0, 18);
    const q = commandSearch.toLowerCase();
    return items.filter(i => i.label.toLowerCase().includes(q));
  }, [commandSearch, addBlock, undo, redo, batchUpdateBlocks, handleExport, handleImport, invitationSlug]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedBlockId) {
        e.preventDefault();
        if (confirm("Delete this block?")) { removeBlock.mutate(selectedBlockId); setSelectedBlockId(null); }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedBlockId) { e.preventDefault(); duplicateBlock.mutate(selectedBlockId); }
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedBlock) { e.preventDefault(); handleCopyBlock(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "v" && clipboard) { e.preventDefault(); handlePasteBlock(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); const r = undo(); if (r) batchUpdateBlocks.mutate(r); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); const r = redo(); if (r) batchUpdateBlocks.mutate(r); }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setShowCommandBar(p => !p); setCommandSearch(""); }
      if (e.key === "Escape") { setSelectedBlockId(null); setShowCommandBar(false); setShowShortcuts(false); setSettingsOpen(false); }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) setShowShortcuts(p => !p);
      if (e.key === "ArrowUp" && !e.altKey) {
        const idx = blocks.findIndex(b => b.id === selectedBlockId);
        if (idx > 0) setSelectedBlockId(blocks[idx - 1].id);
      }
      if (e.key === "ArrowDown" && !e.altKey) {
        const idx = blocks.findIndex(b => b.id === selectedBlockId);
        if (idx >= 0 && idx < blocks.length - 1) setSelectedBlockId(blocks[idx + 1].id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedBlockId, selectedBlock, blocks, removeBlock, duplicateBlock, undo, redo, batchUpdateBlocks, clipboard, handleCopyBlock, handlePasteBlock]);

  useEffect(() => { if (showCommandBar) setTimeout(() => commandInputRef.current?.focus(), 80); }, [showCommandBar]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="h-12 w-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading editor…</p>
        </div>
      </div>
    );
  }

  // ---------------------- TOOLBAR (responsive) ----------------------
  const Toolbar = (
    <div className="flex items-center justify-between gap-2 px-2 sm:px-4 h-12 border-b border-border bg-card/95 backdrop-blur sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
              <Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Back</TooltipContent>
        </Tooltip>

        <Button variant="ghost" size="sm" className="h-8 px-2 lg:hidden" onClick={() => setSidePanel(sidePanel ? null : "blocks")}>
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0 hidden sm:block">
          <h2 className="font-display font-semibold text-sm truncate leading-tight">{invitationTitle}</h2>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="truncate">/invite/{invitationSlug}</span>
            {isSaving ? (
              <span className="flex items-center gap-0.5"><Loader2 className="h-2.5 w-2.5 animate-spin" /> Saving</span>
            ) : lastSaved ? (
              <span className="flex items-center gap-0.5 text-green-600"><CheckCircle2 className="h-2.5 w-2.5" /> Saved</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Center: device picker */}
      <div className="hidden md:flex border border-border rounded-full overflow-hidden h-8 shrink-0">
        {(["mobile", "tablet", "desktop"] as Device[]).map(mode => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <button onClick={() => setPreviewMode(mode)}
                className={`px-3 flex items-center justify-center text-xs transition-colors ${previewMode === mode ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                {mode === "mobile" ? <Smartphone className="h-3.5 w-3.5" /> : mode === "tablet" ? <Tablet className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent className="capitalize">{mode}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canUndo} onClick={() => { const r = undo(); if (r) batchUpdateBlocks.mutate(r); }}>
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canRedo} onClick={() => { const r = redo(); if (r) batchUpdateBlocks.mutate(r); }}>
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex" onClick={() => setShowCommandBar(true)}>
              <Command className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Command palette (⌘K)</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setSidePanel("templates")}><Wand2 className="h-3.5 w-3.5 mr-2" /> Templates</DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyBlock} disabled={!selectedBlock}><Copy className="h-3.5 w-3.5 mr-2" /> Copy block</DropdownMenuItem>
            <DropdownMenuItem onClick={handlePasteBlock} disabled={!clipboard}><Copy className="h-3.5 w-3.5 mr-2" /> Paste block</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExport}><Download className="h-3.5 w-3.5 mr-2" /> Export blocks</DropdownMenuItem>
            <DropdownMenuItem onClick={handleImport}><Upload className="h-3.5 w-3.5 mr-2" /> Import blocks</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowShortcuts(true)}><Keyboard className="h-3.5 w-3.5 mr-2" /> Shortcuts</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="default" size="sm" className="h-8 rounded-full px-3 hidden sm:flex" asChild>
          <a href={`/invite/${invitationSlug}`} target="_blank" rel="noopener">
            <Eye className="h-3.5 w-3.5" /> Preview
          </a>
        </Button>
      </div>
    </div>
  );

  // ---------------------- GLOBAL DIALOGS ----------------------
  const GlobalDialogs = (
    <>
      {/* Command Palette */}
      <Dialog open={showCommandBar} onOpenChange={setShowCommandBar}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Command className="h-4 w-4 text-muted-foreground" />
            <input ref={commandInputRef} value={commandSearch} onChange={e => setCommandSearch(e.target.value)}
              placeholder="Type a command…" className="flex-1 text-sm bg-transparent outline-none" />
            <kbd className="text-[9px] bg-muted px-1.5 py-0.5 rounded font-mono">ESC</kbd>
          </div>
          <ScrollArea className="max-h-72">
            <div className="p-2">
              {commandItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No results</p>
              ) : (() => {
                let lastCat = "";
                return commandItems.map((item, i) => {
                  const showCat = item.category !== lastCat;
                  lastCat = item.category;
                  return (
                    <div key={i}>
                      {showCat && <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold px-2 pt-2 pb-1">{item.category}</p>}
                      <button onClick={item.action} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent text-left">
                        {item.label}
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Shortcuts */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="sm:max-w-sm">
          <h3 className="font-display font-semibold text-base mb-2">Keyboard Shortcuts</h3>
          <div className="space-y-1 text-xs max-h-72 overflow-y-auto">
            {[
              ["↑ / ↓", "Select prev/next block"],
              ["Delete", "Remove selected"],
              ["Ctrl+D", "Duplicate"],
              ["Ctrl+C / V", "Copy / Paste block"],
              ["Ctrl+Z / Y", "Undo / Redo"],
              ["Ctrl+K", "Command palette"],
              ["Esc", "Deselect / close"],
              ["?", "Show shortcuts"],
            ].map(([k, d]) => (
              <div key={k} className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">{d}</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">{k}</kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  // ---------------------- DESKTOP LAYOUT ----------------------
  if (!isMobile) {
    return (
      <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden bg-muted/10">
        {Toolbar}
        <div className="flex flex-1 overflow-hidden">
          {sidePanel && (
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              className="border-r border-border bg-card flex flex-col w-72 shrink-0 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <div className="flex border border-border rounded-md overflow-hidden">
                  <button onClick={() => setSidePanel("blocks")}
                    className={`px-3 py-1 text-xs font-medium ${sidePanel === "blocks" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                    Blocks
                  </button>
                  <button onClick={() => setSidePanel("templates")}
                    className={`px-3 py-1 text-xs font-medium ${sidePanel === "templates" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                    Templates
                  </button>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSidePanel(null)}><X className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="flex-1 overflow-hidden">
                {sidePanel === "blocks" ? (
                  <BlockSidebar onAddBlock={handleAddBlock} isPending={addBlock.isPending} />
                ) : (
                  <BlockTemplatePanel invitationId={invitationId} onApplyTemplate={(tb) => { addBlocksFromTemplate.mutate(tb); setSidePanel("blocks"); }} />
                )}
              </div>
            </motion.div>
          )}

          <BlockCanvas
            blocks={blocks}
            invitationId={invitationId}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onReorder={(ids) => reorderBlocks.mutate(ids)}
            onToggleVisibility={(id, visible) => updateBlock.mutate({ id, is_visible: visible })}
            onDuplicate={(id) => duplicateBlock.mutate(id)}
            onRemove={(id) => { removeBlock.mutate(id); if (selectedBlockId === id) setSelectedBlockId(null); }}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onInsertBlock={handleInsertBlock}
            previewMode={previewMode}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          {selectedBlock && settingsOpen && (
            <BlockSettings
              key={selectedBlock.id}
              block={selectedBlock}
              onUpdate={handleUpdateBlock}
              onClose={() => { setSettingsOpen(false); setSelectedBlockId(null); }}
            />
          )}
        </div>
        {GlobalDialogs}
      </div>
    );
  }

  // ---------------------- MOBILE / TABLET LAYOUT ----------------------
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-muted/10">
      {Toolbar}

      {/* Canvas - full screen on mobile/tablet */}
      <BlockCanvas
        blocks={blocks}
        invitationId={invitationId}
        selectedBlockId={selectedBlockId}
        onSelectBlock={setSelectedBlockId}
        onReorder={(ids) => reorderBlocks.mutate(ids)}
        onToggleVisibility={(id, visible) => updateBlock.mutate({ id, is_visible: visible })}
        onDuplicate={(id) => duplicateBlock.mutate(id)}
        onRemove={(id) => { removeBlock.mutate(id); if (selectedBlockId === id) setSelectedBlockId(null); }}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onInsertBlock={handleInsertBlock}
        previewMode={previewMode}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Floating action bar - mobile */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-1.5 py-1.5 rounded-full bg-foreground text-background shadow-2xl">
        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-background hover:bg-background/10 hover:text-background"
          onClick={() => setSidePanel("blocks")}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-background hover:bg-background/10 hover:text-background"
          onClick={() => setSidePanel("templates")}>
          <Wand2 className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-background/20" />
        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-background hover:bg-background/10 hover:text-background"
          onClick={() => setSettingsOpen(true)} disabled={!selectedBlock}>
          <Settings2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-background hover:bg-background/10 hover:text-background" asChild>
          <a href={`/invite/${invitationSlug}`} target="_blank" rel="noopener"><Eye className="h-4 w-4" /></a>
        </Button>
      </div>

      {/* Block library / templates as side sheet */}
      <Sheet open={!!sidePanel} onOpenChange={(o) => !o && setSidePanel(null)}>
        <SheetContent side="left" className="w-[88vw] sm:w-[420px] p-0 flex flex-col">
          <SheetHeader className="px-4 py-3 border-b border-border">
            <SheetTitle className="text-base flex items-center gap-2">
              {sidePanel === "templates" ? <><Wand2 className="h-4 w-4" /> Templates</> : <><Grid3X3 className="h-4 w-4" /> Block Library</>}
            </SheetTitle>
            <div className="flex border border-border rounded-md overflow-hidden mt-1 self-start">
              <button onClick={() => setSidePanel("blocks")}
                className={`px-3 py-1 text-xs ${sidePanel === "blocks" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                Blocks
              </button>
              <button onClick={() => setSidePanel("templates")}
                className={`px-3 py-1 text-xs ${sidePanel === "templates" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                Templates
              </button>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            {sidePanel === "blocks" ? (
              <BlockSidebar onAddBlock={handleAddBlock} isPending={addBlock.isPending} />
            ) : sidePanel === "templates" ? (
              <BlockTemplatePanel invitationId={invitationId} onApplyTemplate={(tb) => { addBlocksFromTemplate.mutate(tb); setSidePanel(null); }} />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      {/* Settings as bottom/right sheet on mobile/tablet */}
      <Sheet open={settingsOpen && !!selectedBlock} onOpenChange={(o) => { setSettingsOpen(o); if (!o) setSelectedBlockId(null); }}>
        <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[85vh] p-0 flex flex-col" : "w-[420px] p-0 flex flex-col"}>
          {selectedBlock && (
            <BlockSettings
              key={selectedBlock.id}
              block={selectedBlock}
              onUpdate={handleUpdateBlock}
              onClose={() => { setSettingsOpen(false); setSelectedBlockId(null); }}
            />
          )}
        </SheetContent>
      </Sheet>

      {GlobalDialogs}
    </div>
  );
}
