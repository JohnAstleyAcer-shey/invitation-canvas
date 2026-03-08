import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface StoryNavigationProps {
  children: React.ReactNode[];
  pageLabels: string[];
}

export function StoryNavigation({ children, pageLabels }: StoryNavigationProps) {
  const [current, setCurrent] = useState(0);
  const total = children.length;
  const touchStartY = useRef(0);
  const isAnimating = useRef(false);

  const goTo = useCallback((idx: number) => {
    if (isAnimating.current || idx < 0 || idx >= total) return;
    isAnimating.current = true;
    setCurrent(idx);
    setTimeout(() => { isAnimating.current = false; }, 600);
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 30) return;
      e.deltaY > 0 ? next() : prev();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowUp") { e.preventDefault(); prev(); }
      if (e.key === "Home") { e.preventDefault(); goTo(0); }
      if (e.key === "End") { e.preventDefault(); goTo(total - 1); }
    };

    const handleTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [next, prev, goTo, total]);

  const progress = total > 1 ? ((current) / (total - 1)) * 100 : 100;

  return (
    <div className="relative h-screen w-full overflow-hidden" role="region" aria-label="Invitation pages" aria-roledescription="carousel">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-black/10">
        <motion.div
          className="h-full"
          style={{ background: "var(--inv-primary, #000)" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Page counter */}
      <div className="fixed top-3 left-4 z-50 text-xs px-2 py-1 rounded-full bg-black/20 backdrop-blur-md text-white font-medium tabular-nums">
        {current + 1} / {total}
      </div>

      {/* Progress dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {pageLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to ${label}`}
            aria-current={i === current ? "step" : undefined}
          >
            <span className="absolute right-6 whitespace-nowrap text-xs px-2 py-1 rounded bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {label}
            </span>
            <div
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-2.5 h-2.5 scale-125" : "w-2 h-2 hover:scale-110"
              }`}
              style={{
                background: i === current ? "var(--inv-primary, #000)" : "var(--inv-text, #000)",
                opacity: i === current ? 1 : 0.3,
              }}
            />
          </button>
        ))}
      </div>

      {/* Nav arrows */}
      {current > 0 && (
        <button
          onClick={prev}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-colors"
          aria-label="Previous page"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
      {current < total - 1 && (
        <button
          onClick={next}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-colors animate-bounce"
          aria-label="Next page"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      {/* Pages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="h-screen w-full"
          role="tabpanel"
          aria-label={pageLabels[current]}
        >
          {children[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
