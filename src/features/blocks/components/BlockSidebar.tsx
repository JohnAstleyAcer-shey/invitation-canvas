import { useState } from "react";
import { motion } from "framer-motion";
import {
  Type, AlignLeft, ImageIcon, Space, Minus, MousePointer,
  Timer, Mail, MapPin, Grid3X3, Play, Clock, Users,
  Shirt, Gift, HelpCircle, Code, Share2, BookOpen,
  Maximize, MessageSquare, LayoutGrid, Quote, Search, Plus,
  Columns, ChevronDown, Star, MoveHorizontal, Sparkles,
  Music, Disc3, Camera, Phone, Map, DollarSign, QrCode,
  Cloud, MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BLOCK_REGISTRY, BLOCK_CATEGORIES, getBlocksByCategory } from "../registry";
import type { BlockType } from "../types";

const iconMap: Record<string, React.FC<any>> = {
  Type, AlignLeft, ImageIcon, Space, Minus, MousePointer,
  Timer, Mail, MapPin, "Grid3x3": Grid3X3, Play, Clock, Users,
  Shirt, Gift, HelpCircle, Code, Share2, BookOpen,
  Maximize, MessageSquare, LayoutGrid, Quote, Columns,
  ChevronDown, Star, MoveHorizontal, Sparkles,
  Music, Disc3, Camera, Phone, Map, DollarSign, QrCode,
  Cloud, MessageCircle,
};

interface BlockSidebarProps {
  onAddBlock: (type: BlockType) => void;
  isPending?: boolean;
}

export function BlockSidebar({ onAddBlock, isPending }: BlockSidebarProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredBlocks = search
    ? Object.values(BLOCK_REGISTRY).filter(b =>
        b.label.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
      )
    : activeTab === "all"
      ? null
      : getBlocksByCategory(activeTab);

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm">Blocks</h3>
          <Badge variant="secondary" className="text-[9px]">{Object.keys(BLOCK_REGISTRY).length}</Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs rounded-lg"
          />
        </div>
      </div>

      {!search && (
        <div className="border-b border-border px-3 py-1.5">
          <div className="flex flex-wrap gap-1">
            <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>All</TabButton>
            {BLOCK_CATEGORIES.map(cat => (
              <TabButton key={cat.key} active={activeTab === cat.key} onClick={() => setActiveTab(cat.key)}>
                {cat.label}
              </TabButton>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {search || activeTab !== "all" ? (
            <div className="grid grid-cols-2 gap-1.5">
              {(filteredBlocks || Object.values(BLOCK_REGISTRY)).map(block => (
                <BlockCard
                  key={block.type}
                  block={block}
                  onAdd={() => onAddBlock(block.type)}
                  disabled={isPending}
                />
              ))}
              {filteredBlocks?.length === 0 && (
                <p className="col-span-2 text-xs text-muted-foreground text-center py-4">No blocks found</p>
              )}
            </div>
          ) : (
            BLOCK_CATEGORIES.map(cat => {
              const blocks = getBlocksByCategory(cat.key);
              if (!blocks.length) return null;
              return (
                <div key={cat.key}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    {cat.label} <span className="opacity-50">({blocks.length})</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {blocks.map(block => (
                      <BlockCard
                        key={block.type}
                        block={block}
                        onAdd={() => onAddBlock(block.type)}
                        disabled={isPending}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function BlockCard({ block, onAdd, disabled }: {
  block: typeof BLOCK_REGISTRY[keyof typeof BLOCK_REGISTRY];
  onAdd: () => void;
  disabled?: boolean;
}) {
  const Icon = iconMap[block.icon] || Type;

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onAdd}
      disabled={disabled}
      className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border bg-background hover:bg-accent/50 hover:border-primary/30 transition-all text-center disabled:opacity-50 cursor-pointer"
      title={block.description}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-[10px] font-medium leading-tight">{block.label}</span>
    </motion.button>
  );
}
