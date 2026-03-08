import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Monitor, Tablet, Wifi, WifiOff, Maximize2, Zap, RefreshCw, ExternalLink, Moon, Sun, RotateCw, Minimize2, Layers, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BlockViewRenderer } from "./BlockViewRenderer";
import type { InvitationBlock } from "../types";

interface BlockLivePreviewProps {
  blocks: InvitationBlock[];
  previewMode?: "mobile" | "tablet" | "desktop";
  scrollSync?: boolean;
  scrollPosition?: number;
  onScroll?: (position: number) => void;
}

export function BlockLivePreview({ blocks, previewMode = "mobile", scrollSync, scrollPosition, onScroll }: BlockLivePreviewProps) {
  const visibleBlocks = blocks.filter(b => b.is_visible);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updateCount, setUpdateCount] = useState(0);
  const [showDarkPreview, setShowDarkPreview] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track updates
  useEffect(() => {
    setLastUpdate(new Date());
    setIsLive(true);
    setUpdateCount(c => c + 1);
    const timer = setTimeout(() => setIsLive(false), 2000);
    return () => clearTimeout(timer);
  }, [blocks]);

  // Scroll sync from editor
  useEffect(() => {
    if (scrollSync && scrollPosition !== undefined && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition, scrollSync]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      onScroll?.(scrollRef.current.scrollTop);
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setScrollProgress(scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0);
    }
  }, [onScroll]);

  // Block type summary
  const blockSummary = useMemo(() => {
    const types = new Map<string, number>();
    visibleBlocks.forEach(b => types.set(b.block_type, (types.get(b.block_type) || 0) + 1));
    return types;
  }, [visibleBlocks]);

  if (!visibleBlocks.length) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/50 to-muted flex items-center justify-center mx-auto"
          >
            {previewMode === "mobile" ? <Smartphone className="h-8 w-8 text-muted-foreground/40" /> :
             previewMode === "tablet" ? <Tablet className="h-8 w-8 text-muted-foreground/40" /> :
             <Monitor className="h-8 w-8 text-muted-foreground/40" />}
          </motion.div>
          <p className="text-xs text-muted-foreground text-center">
            Add blocks to see the live preview
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            Changes appear here in real-time
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scroll progress bar */}
      <div className="h-0.5 bg-border/50 relative">
        <motion.div
          className="h-full bg-primary/60"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Live indicator bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: isLive ? [1, 1.3, 1] : 1, opacity: isLive ? 1 : 0.4 }}
            transition={{ duration: 0.5 }}
            className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" : "bg-muted-foreground/30"}`}
          />
          <span className="text-[9px] text-muted-foreground font-medium">
            {isLive ? "Syncing..." : "Up to date"}
          </span>
          {isLive && (
            <motion.div initial={{ width: 0 }} animate={{ width: 30 }} className="h-0.5 bg-green-500/30 rounded-full overflow-hidden">
              <motion.div animate={{ x: [-30, 30] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-full w-3 bg-green-500 rounded-full" />
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => setShowDarkPreview(!showDarkPreview)} className="p-0.5 rounded hover:bg-accent transition-colors">
                {showDarkPreview ? <Sun className="h-3 w-3 text-amber-500" /> : <Moon className="h-3 w-3 text-muted-foreground/40" />}
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px]">{showDarkPreview ? "Light preview" : "Dark preview"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => setAutoRefresh(!autoRefresh)} className="p-0.5 rounded hover:bg-accent transition-colors">
                {autoRefresh ? <Zap className="h-3 w-3 text-green-500" /> : <RefreshCw className="h-3 w-3 text-muted-foreground/30" />}
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px]">{autoRefresh ? "Auto-refresh on" : "Auto-refresh off"}</TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-1">
            {isLive ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-muted-foreground/30" />}
            <span className="text-[8px] text-muted-foreground font-mono">
              {visibleBlocks.length}b
            </span>
          </div>
        </div>
      </div>

      {/* Preview content */}
      <div
        className={`flex-1 overflow-y-auto transition-colors ${showDarkPreview ? "bg-gray-900" : ""}`}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className="min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={updateCount}
              initial={autoRefresh ? { opacity: 0.95 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className={showDarkPreview ? "dark" : ""}
            >
              <BlockViewRenderer blocks={visibleBlocks} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar with block summary */}
      <div className="px-3 py-1 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto">
            {Array.from(blockSummary.entries()).slice(0, 5).map(([type, count]) => (
              <Badge key={type} variant="outline" className="text-[7px] py-0 h-4 shrink-0">
                {type.replace(/_/g, " ")} {count > 1 ? `×${count}` : ""}
              </Badge>
            ))}
            {blockSummary.size > 5 && (
              <span className="text-[8px] text-muted-foreground">+{blockSummary.size - 5} more</span>
            )}
          </div>
          <span className="text-[8px] text-muted-foreground shrink-0">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}
