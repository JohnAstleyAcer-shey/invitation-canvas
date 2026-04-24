import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Monitor, Tablet, Wifi, WifiOff, Zap, RefreshCw, Moon, Sun, ChevronUp, ChevronDown, Layers, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BlockViewRenderer } from "./BlockViewRenderer";
import type { InvitationBlock } from "../types";

// Page transition variants matching StoryNavigation exactly
const pageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 80 : -80,
    scale: 0.95,
    filter: "blur(8px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -80 : 80,
    scale: 0.95,
    filter: "blur(8px)",
  }),
};

function getBlockLabel(block: InvitationBlock): string {
  const c = block.content as any;
  switch (block.block_type) {
    case "cover_hero": return c?.overlayText || "Cover";
    case "heading": return c?.text?.substring(0, 20) || "Heading";
    case "text": return "Message";
    case "message_card": return "Message";
    case "countdown":
    case "countdown_flip": return "Countdown";
    case "rsvp": return c?.rsvpTitle || "RSVP";
    case "location": return c?.venueName || "Location";
    case "timeline": return "Schedule";
    case "entourage": return c?.entourageTitle || "Entourage";
    case "gallery": return "Gallery";
    case "dress_code": return "Dress Code";
    case "gift_registry": return c?.registryTitle || "Gift Guide";
    case "faq": return c?.faqTitle || "FAQ";
    case "guestbook": return "Guestbook";
    case "social_links": return "Social";
    case "contact_card": return "Contact";
    case "video":
    case "hero_video": return "Video";
    case "quote": return "Quote";
    case "music_player":
    case "audio_player": return "Music";
    case "divider":
    case "separator_fancy": return "Divider";
    case "spacer": return "—";
    case "button": return c?.label || "Button";
    case "image": return "Image";
    default: return block.block_type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
  }
}

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
  const [viewMode, setViewMode] = useState<"pages" | "scroll">("pages");

  // Page-by-page state
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const isAnimating = useRef(false);

  // Reset page when blocks change significantly
  useEffect(() => {
    if (currentPage >= visibleBlocks.length) {
      setCurrentPage(Math.max(0, visibleBlocks.length - 1));
    }
  }, [visibleBlocks.length, currentPage]);

  const goToPage = useCallback((idx: number) => {
    if (isAnimating.current || idx < 0 || idx >= visibleBlocks.length) return;
    isAnimating.current = true;
    setDirection(idx > currentPage ? 1 : -1);
    setCurrentPage(idx);
    setTimeout(() => { isAnimating.current = false; }, 650);
  }, [visibleBlocks.length, currentPage]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  // Track updates
  useEffect(() => {
    setLastUpdate(new Date());
    setIsLive(true);
    setUpdateCount(c => c + 1);
    const timer = setTimeout(() => setIsLive(false), 2000);
    return () => clearTimeout(timer);
  }, [blocks]);

  // Block type summary
  const blockSummary = useMemo(() => {
    const types = new Map<string, number>();
    visibleBlocks.forEach(b => types.set(b.block_type, (types.get(b.block_type) || 0) + 1));
    return types;
  }, [visibleBlocks]);

  const progress = visibleBlocks.length > 1 ? (currentPage / (visibleBlocks.length - 1)) * 100 : 100;

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
      {/* Top progress bar (page mode) */}
      {viewMode === "pages" && (
        <div className="h-0.5 bg-border/50 relative">
          <motion.div
            className="h-full bg-primary/60"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}

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
          {viewMode === "pages" && (
            <span className="text-[9px] text-muted-foreground font-mono ml-1">
              {currentPage + 1}/{visibleBlocks.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {/* View mode toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setViewMode(v => v === "pages" ? "scroll" : "pages")}
                className={`p-0.5 rounded transition-colors ${viewMode === "pages" ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground/40"}`}
              >
                {viewMode === "pages" ? <LayoutList className="h-3 w-3" /> : <ScrollText className="h-3 w-3" />}
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px]">{viewMode === "pages" ? "Page-by-page (published)" : "Scroll mode"}</TooltipContent>
          </Tooltip>
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
      {viewMode === "pages" ? (
        /* Page-by-page mode — matches published StoryNavigation */
        <div className={`flex-1 relative overflow-hidden ${showDarkPreview ? "bg-gray-900" : "bg-background"}`}>
          {/* Page navigation arrows */}
          <AnimatePresence>
            {currentPage > 0 && (
              <motion.button
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                whileHover={{ scale: 1.15, backgroundColor: "rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.9 }}
                onClick={prevPage}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-md text-white shadow-lg"
              >
                <ChevronUp className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {currentPage < visibleBlocks.length - 1 && (
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: [0, 4, 0] }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
                whileHover={{ scale: 1.15, backgroundColor: "rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.9 }}
                onClick={nextPage}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-md text-white shadow-lg"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Progress dots on right */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1">
            {visibleBlocks.map((block, i) => (
              <Tooltip key={block.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => goToPage(i)}
                    className="group relative flex items-center justify-end"
                  >
                    <motion.div
                      animate={{
                        width: i === currentPage ? 8 : 5,
                        height: i === currentPage ? 8 : 5,
                        scale: i === currentPage ? 1.2 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="rounded-full"
                      style={{
                        background: i === currentPage ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        opacity: i === currentPage ? 1 : 0.3,
                        boxShadow: i === currentPage ? "0 0 6px hsl(var(--primary) / 0.4)" : "none",
                      }}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-[10px]">{getBlockLabel(block)}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Page content with cinematic transitions */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full w-full flex items-center justify-center overflow-auto ${showDarkPreview ? "dark" : ""}`}
            >
              <div className="w-full min-h-full flex items-center justify-center">
                <div className="w-full">
                  <BlockViewRenderer blocks={[visibleBlocks[currentPage]]} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Scroll mode — continuous */
        <div
          className={`flex-1 overflow-y-auto transition-colors ${showDarkPreview ? "bg-gray-900" : ""}`}
          ref={scrollRef}
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
      )}

      {/* Bottom bar with block summary */}
      <div className="px-3 py-1 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto">
            {viewMode === "pages" && visibleBlocks[currentPage] && (
              <Badge variant="secondary" className="text-[7px] py-0 h-4 shrink-0 bg-primary/10 text-primary">
                {getBlockLabel(visibleBlocks[currentPage])}
              </Badge>
            )}
            {Array.from(blockSummary.entries()).slice(0, viewMode === "pages" ? 3 : 5).map(([type, count]) => (
              <Badge key={type} variant="outline" className="text-[7px] py-0 h-4 shrink-0">
                {type.replace(/_/g, " ")} {count > 1 ? `×${count}` : ""}
              </Badge>
            ))}
            {blockSummary.size > 5 && viewMode !== "pages" && (
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
