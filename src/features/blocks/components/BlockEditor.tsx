import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Monitor, Smartphone, Undo2, Eye, Save, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockSidebar } from "./BlockSidebar";
import { BlockCanvas } from "./BlockCanvas";
import { BlockSettings } from "./BlockSettings";
import { BlockTemplatePanel } from "./BlockTemplatePanel";
import { useBlocks } from "../hooks/useBlocks";
import type { BlockType, BlockContent, BlockStyle } from "../types";

interface BlockEditorProps {
  invitationId: string;
  invitationTitle: string;
  invitationSlug: string;
}

export function BlockEditor({ invitationId, invitationTitle, invitationSlug }: BlockEditorProps) {
  const { blocks, isLoading, addBlock, updateBlock, removeBlock, duplicateBlock, reorderBlocks, addBlocksFromTemplate } = useBlocks(invitationId);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [showTemplates, setShowTemplates] = useState(false);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

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

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-sm truncate">{invitationTitle}</h2>
            <p className="text-[10px] text-muted-foreground">/invite/{invitationSlug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            <Layers className="h-3 w-3 mr-1" /> {blocks.length} blocks
          </Badge>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={previewMode === "mobile" ? "secondary" : "ghost"}
              size="icon" className="h-7 w-7 rounded-none"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={previewMode === "desktop" ? "secondary" : "ghost"}
              size="icon" className="h-7 w-7 rounded-none"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowTemplates(!showTemplates)}>
            {showTemplates ? "Blocks" : "Templates"}
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
            <a href={`/invite/${invitationSlug}`} target="_blank" rel="noopener">
              <Eye className="h-3 w-3 mr-1" /> Preview
            </a>
          </Button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        {showTemplates ? (
          <BlockTemplatePanel invitationId={invitationId} onApplyTemplate={(templateBlocks) => {
            addBlocksFromTemplate.mutate(templateBlocks);
            setShowTemplates(false);
          }} />
        ) : (
          <BlockSidebar onAddBlock={handleAddBlock} isPending={addBlock.isPending} />
        )}

        {/* Canvas */}
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
          previewMode={previewMode}
        />

        {/* Right settings panel */}
        {selectedBlock && (
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
