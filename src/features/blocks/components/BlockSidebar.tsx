import { useState } from "react";
import { motion } from "framer-motion";
import {
  Type, AlignLeft, ImageIcon, Space, Minus, MousePointer,
  Timer, Mail, MapPin, Grid3X3, Play, Clock, Users,
  Shirt, Gift, HelpCircle, Code, Share2, BookOpen,
  Maximize, MessageSquare, LayoutGrid, Quote, Search, Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BLOCK_REGISTRY, BLOCK_CATEGORIES, getBlocksByCategory } from "../registry";
import type { BlockType } from "../types";

const iconMap: Record<string, React.FC<any>> = {
  Type, AlignLeft, ImageIcon, Space, Minus, MousePointer,
  Timer, Mail, MapPin, Grid3x3: Grid3X3, Play, Clock, Users,
  Shirt, Gift, HelpCircle, Code, Share2, BookOpen,
  Maximize, MessageSquare, LayoutGrid, Quote,
};

interface BlockSidebarProps {
  onAddBlock: (type: BlockType) => void;
  isPending?: boolean;
}

export function BlockSidebar({ onAddBlock, isPending }: BlockSidebarProps) {
  const [search, setSearch] = useState("");

  const filteredBlocks = search
    ? Object.values(BLOCK_REGISTRY).filter(b =>
        b.label.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h3 className="font-display font-bold text-sm mb-2">Blocks</h3>
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

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {filteredBlocks ? (
            <div className="grid grid-cols-2 gap-1.5">
              {filteredBlocks.map(block => (
                <BlockCard
                  key={block.type}
                  block={block}
                  onAdd={() => onAddBlock(block.type)}
                  disabled={isPending}
                />
              ))}
            </div>
          ) : (
            BLOCK_CATEGORIES.map(cat => (
              <div key={cat.key}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {cat.label}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {getBlocksByCategory(cat.key).map(block => (
                    <BlockCard
                      key={block.type}
                      block={block}
                      onAdd={() => onAddBlock(block.type)}
                      disabled={isPending}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
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
