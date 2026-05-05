import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface StoryNavigationProps {
  children: React.ReactNode[];
  pageLabels: string[];
  transition?: "fade" | "slide" | "zoom" | "flip";
}

const variantsMap = {
  fade: {
    enter: () => ({ opacity: 0, filter: "blur(10px)" }),
    center: { opacity: 1, filter: "blur(0px)" },
    exit: () => ({ opacity: 0, filter: "blur(10px)" }),
  },
  slide: {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 120 : -120 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -120 : 120 }),
  },
  zoom: {
    enter: () => ({ opacity: 0, scale: 0.85, filter: "blur(8px)" }),
    center: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: () => ({ opacity: 0, scale: 1.1, filter: "blur(8px)" }),
  },
  flip: {
    enter: (d: number) => ({ opacity: 0, rotateX: d > 0 ? 60 : -60 }),
    center: { opacity: 1, rotateX: 0 },
    exit: (d: number) => ({ opacity: 0, rotateX: d > 0 ? -60 : 60 }),
  },
} as const;

export function StoryNavigation({ children, pageLabels, transition = "fade" }: StoryNavigationProps) {
  const pageVariants = variantsMap[transition] || variantsMap.fade;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = children.length;
  const touchStartY = useRef(0);
  const isAnimating = useRef(false);

  const goTo = useCallback((idx: number) => {
    if (isAnimating.current || idx < 0 || idx >= total) return;
    isAnimating.current = true;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    setTimeout(() => { isAnimating.current = false; }, 650);
  }, [total, current]);

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
      {/* Top progress bar with glow */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-black/10">
        <motion.div
          className="h-full relative"
          style={{ background: "var(--inv-primary, #000)" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute right-0 top-0 w-4 h-full blur-sm" style={{ background: "var(--inv-primary, #000)" }} />
        </motion.div>
      </div>

      {/* Page counter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-3 left-4 z-50 text-xs px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-md text-white font-medium tabular-nums"
      >
        {current + 1} / {total}
      </motion.div>

      {/* Progress dots - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-2"
      >
        {pageLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to ${label}`}
            aria-current={i === current ? "step" : undefined}
          >
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-6 whitespace-nowrap text-xs px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white pointer-events-none shadow-lg"
            >
              {label}
            </motion.span>
            <motion.div
              animate={{
                width: i === current ? 10 : 8,
                height: i === current ? 10 : 8,
                scale: i === current ? 1.2 : 1,
              }}
              whileHover={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-full transition-colors duration-300"
              style={{
                background: i === current ? "var(--inv-primary, #000)" : "var(--inv-text, #000)",
                opacity: i === current ? 1 : 0.3,
                boxShadow: i === current ? "0 0 8px var(--inv-primary, rgba(0,0,0,0.3))" : "none",
              }}
            />
          </button>
        ))}
      </motion.div>

      {/* Nav arrows — properly centered using inset-x-0 + mx-auto */}
      <AnimatePresence>
        {current > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.15, backgroundColor: "rgba(0,0,0,0.4)" }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="fixed top-4 inset-x-0 mx-auto z-50 w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-md text-white transition-colors shadow-lg"
            aria-label="Previous page"
          >
            <ChevronUp className="w-6 h-6 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {current < total - 1 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
            whileHover={{ scale: 1.15, backgroundColor: "rgba(0,0,0,0.4)" }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="fixed bottom-4 inset-x-0 mx-auto z-50 w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-md text-white transition-colors shadow-lg"
            aria-label="Next page"
          >
            <ChevronDown className="w-6 h-6 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Pages with cinematic transitions */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
