import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type, AlignLeft, ImageIcon, Space, Minus, MousePointer,
  Timer, Mail, MapPin, Grid3X3, Play, Clock, Users,
  Shirt, Gift, HelpCircle, Code, Share2, BookOpen,
  Maximize, MessageSquare, LayoutGrid, Quote, Search, Plus,
  Columns, ChevronDown, Star, MoveHorizontal, Sparkles,
  Music, Disc3, Camera, Phone, Map, DollarSign, QrCode,
  Cloud, MessageCircle, History, Heart, Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

// Popular blocks shown as quick-add
const POPULAR_BLOCKS: BlockType[] = ["heading", "text", "image", "cover_hero", "countdown", "rsvp", "gallery", "location"];

interface BlockSidebarProps {
  onAddBlock: (type: BlockType) => void;
  isPending?: boolean;
}

export function BlockSidebar({ onAddBlock, isPending }: BlockSidebarProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [recentlyUsed, setRecentlyUsed] = useState<BlockType[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("recent-blocks") || "[]");
    } catch { return []; }
  });
  const [favorites, setFavorites] = useState<BlockType[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("fav-blocks") || "[]");
    } catch { return []; }
  });

  const handleAddBlock = useCallback((type: BlockType) => {
    onAddBlock(type);
    setRecentlyUsed(prev => {
      const next = [type, ...prev.filter(t => t !== type)].slice(0, 8);
      localStorage.setItem("recent-blocks", JSON.stringify(next));
      return next;
    });
  }, [onAddBlock]);

  const toggleFavorite = useCallback((type: BlockType, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
      localStorage.setItem("fav-blocks", JSON.stringify(next));
      return next;
    });
  }, []);

  const filteredBlocks = useMemo(() => {
    if (search) {
      return Object.values(BLOCK_REGISTRY).filter(b =>
        b.label.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (activeTab === "favorites") return favorites.map(t => BLOCK_REGISTRY[t]).filter(Boolean);
    if (activeTab === "recent") return recentlyUsed.map(t => BLOCK_REGISTRY[t]).filter(Boolean);
    if (activeTab === "popular") return POPULAR_BLOCKS.map(t => BLOCK_REGISTRY[t]).filter(Boolean);
    if (activeTab !== "all") return getBlocksByCategory(activeTab);
    return null;
  }, [search, activeTab, favorites, recentlyUsed]);

  return (
    <div className="w-48 sm:w-56 md:w-64 border-r border-border bg-card flex flex-col h-full shrink-0">
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
            <TabButton active={activeTab === "popular"} onClick={() => setActiveTab("popular")} icon={<Zap className="h-2.5 w-2.5" />}>Popular</TabButton>
            {favorites.length > 0 && (
              <TabButton active={activeTab === "favorites"} onClick={() => setActiveTab("favorites")} icon={<Heart className="h-2.5 w-2.5" />}>Favs</TabButton>
            )}
            {recentlyUsed.length > 0 && (
              <TabButton active={activeTab === "recent"} onClick={() => setActiveTab("recent")} icon={<History className="h-2.5 w-2.5" />}>Recent</TabButton>
            )}
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
                  onAdd={() => handleAddBlock(block.type)}
                  disabled={isPending}
                  isFavorite={favorites.includes(block.type)}
                  onToggleFavorite={(e) => toggleFavorite(block.type, e)}
                />
              ))}
              {filteredBlocks?.length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">No blocks found</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Try a different search term</p>
                </div>
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
                        onAdd={() => handleAddBlock(block.type)}
                        disabled={isPending}
                        isFavorite={favorites.includes(block.type)}
                        onToggleFavorite={(e) => toggleFavorite(block.type, e)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Quick add strip */}
      <div className="p-2 border-t border-border bg-muted/20">
        <p className="text-[8px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 px-1">Quick Add</p>
        <div className="flex gap-1 overflow-x-auto">
          {POPULAR_BLOCKS.slice(0, 5).map(type => {
            const def = BLOCK_REGISTRY[type];
            const Icon = iconMap[def.icon] || Type;
            return (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddBlock(type)}
                    className="h-7 w-7 rounded-lg bg-accent/50 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors shrink-0"
                  >
                    <Icon className="h-3 w-3" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px]">{def.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children, icon }: { active: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-colors flex items-center gap-0.5 ${
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function BlockCard({ block, onAdd, disabled, isFavorite, onToggleFavorite }: {
  block: typeof BLOCK_REGISTRY[keyof typeof BLOCK_REGISTRY];
  onAdd: () => void;
  disabled?: boolean;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const Icon = iconMap[block.icon] || Type;
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    onAdd();
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAdd}
      disabled={disabled || isAdding}
      className={`relative flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border bg-background hover:bg-accent/50 hover:border-primary/30 hover:shadow-sm transition-all text-center disabled:opacity-50 cursor-pointer overflow-hidden group ${
        isAdding ? "ring-2 ring-primary/50" : ""
      }`}
      title={block.description}
    >
      {/* Favorite button */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-1 right-1 h-4 w-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 z-10"
      >
        <Heart className={`h-2.5 w-2.5 ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </button>

      {isAdding && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-primary/20 rounded-lg"
        />
      )}
      <motion.div
        animate={isAdding ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </motion.div>
      <span className="text-[10px] font-medium leading-tight">{block.label}</span>
    </motion.button>
  );
}
