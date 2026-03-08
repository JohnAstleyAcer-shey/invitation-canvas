import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Monitor, Tablet, Wifi, WifiOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  // Track updates for "live" indicator
  useEffect(() => {
    setLastUpdate(new Date());
    setIsLive(true);
    const timer = setTimeout(() => setIsLive(false), 2000);
    return () => clearTimeout(timer);
  }, [blocks]);

  // Scroll sync from editor
  useEffect(() => {
    if (scrollSync && scrollPosition !== undefined && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition, scrollSync]);

  const handleScroll = () => {
    if (scrollRef.current && onScroll) {
      onScroll(scrollRef.current.scrollTop);
    }
  };

  if (!visibleBlocks.length) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-accent/50 flex items-center justify-center mx-auto">
            {previewMode === "mobile" ? <Smartphone className="h-8 w-8 text-muted-foreground/40" /> :
             previewMode === "tablet" ? <Tablet className="h-8 w-8 text-muted-foreground/40" /> :
             <Monitor className="h-8 w-8 text-muted-foreground/40" />}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Add blocks to see the live preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Live indicator bar */}
      <div className="flex items-center justify-between px-3 py-1 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: isLive ? [1, 1.2, 1] : 1, opacity: isLive ? 1 : 0.5 }}
            transition={{ duration: 0.5 }}
            className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500" : "bg-muted-foreground/30"}`}
          />
          <span className="text-[9px] text-muted-foreground font-medium">
            {isLive ? "Syncing..." : "Up to date"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isLive ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-muted-foreground/30" />}
          <span className="text-[8px] text-muted-foreground">
            {visibleBlocks.length} blocks
          </span>
        </div>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-y-auto" ref={scrollRef} onScroll={handleScroll}>
        <div className="min-h-full">
          <BlockViewRenderer blocks={visibleBlocks} />
        </div>
      </div>
    </div>
  );
}
