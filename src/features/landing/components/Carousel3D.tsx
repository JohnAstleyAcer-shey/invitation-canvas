import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Heart, Crown, Cake, Baby, Building2, Gem, Eye } from "lucide-react";
import { ShowcaseDetailModal, type ShowcaseProject } from "./ShowcaseDetailModal";
import { SHOWCASE_PROJECTS } from "../data/showcaseProjects";

const CARDS = [
  { id: "debut",       title: "Debut",       subtitle: "Sweet Eighteen",   tag: "18 Roses · Candles",   icon: Crown,     gradient: "from-rose-500 via-pink-500 to-fuchsia-600",  emoji: "🌹" },
  { id: "wedding",     title: "Wedding",     subtitle: "Forever Begins",   tag: "Vows · Entourage",     icon: Heart,     gradient: "from-amber-200 via-rose-300 to-rose-500",     emoji: "💍" },
  { id: "christening", title: "Christening", subtitle: "Blessed Beginnings", tag: "Ninang · Ninong",   icon: Baby,      gradient: "from-sky-300 via-blue-400 to-indigo-500",     emoji: "👼" },
  { id: "birthday",    title: "Birthday",    subtitle: "Another Trip",     tag: "Cake · Candles",       icon: Cake,      gradient: "from-orange-400 via-amber-500 to-yellow-500",  emoji: "🎂" },
  { id: "corporate",   title: "Corporate",   subtitle: "Annual Gala",      tag: "Black-Tie · RSVP",     icon: Building2, gradient: "from-slate-700 via-zinc-800 to-neutral-900",   emoji: "🏛️" },
  { id: "anniversary", title: "Anniversary", subtitle: "Years of Love",    tag: "Timeline · Vow Renew", icon: Gem,       gradient: "from-emerald-400 via-teal-500 to-cyan-600",   emoji: "💎" },
  { id: "babyshower",  title: "Baby Shower", subtitle: "It's a Surprise",  tag: "Games · Wishes",       icon: Sparkles,  gradient: "from-pink-200 via-purple-300 to-indigo-400",  emoji: "🍼" },
];

export function Carousel3D() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openProject, setOpenProject] = useState<ShowcaseProject | null>(null);
  const total = CARDS.length;

  // Auto-rotate
  useEffect(() => {
    if (paused || openProject) return;
    const t = setInterval(() => setActive((i) => (i + 1) % total), 3500);
    return () => clearInterval(t);
  }, [paused, total, openProject]);

  const next = () => setActive((i) => (i + 1) % total);
  const prev = () => setActive((i) => (i - 1 + total) % total);
  const openActive = () => {
    const project = SHOWCASE_PROJECTS[CARDS[active].id];
    if (project) setOpenProject(project);
  };

  return (
    <section id="showcase" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 bg-grid opacity-[0.05]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-border/20"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-border/10"
      />

      <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Premium Showcase
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            A Style for <span className="text-gradient">Every Story</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4 text-sm sm:text-base">
            Hand-crafted, fully managed digital invitations across every milestone. Hover and explore in 3D.
          </p>
        </motion.div>

        {/* 3D Stage */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          className="relative h-[480px] sm:h-[560px] flex items-center justify-center"
          style={{ perspective: "1600px" }}
        >
          <div
            className="relative w-[280px] sm:w-[320px] h-[420px] sm:h-[480px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {CARDS.map((card, i) => {
              // Position around a horizontal arc
              const offset = ((i - active) + total) % total;
              const rel = offset > total / 2 ? offset - total : offset;
              const abs = Math.abs(rel);
              const x = rel * 180;            // px
              const z = -abs * 220;           // depth
              const rotY = -rel * 22;         // deg
              const opacity = abs > 3 ? 0 : 1 - abs * 0.18;
              const scale = 1 - abs * 0.05;
              const Icon = card.icon;

              return (
                <motion.button
                  key={card.id}
                  onClick={() => (i === active ? openActive() : setActive(i))}
                  animate={{ x, z, rotateY: rotY, opacity, scale }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                  className="absolute inset-0 rounded-[2rem] overflow-hidden text-left cursor-pointer"
                  style={{ transformStyle: "preserve-3d", zIndex: 100 - abs }}
                >
                  {/* Card body */}
                  <div className={`relative w-full h-full bg-gradient-to-br ${card.gradient} shadow-2xl`}>
                    {/* Glass shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30" />
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
                    {/* Noise + frame */}
                    <div className="absolute inset-2 rounded-[1.6rem] border border-white/25" />

                    {/* Top emoji + tag */}
                    <div className="relative h-full p-7 flex flex-col text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
                          {card.tag}
                        </span>
                        <span className="text-3xl drop-shadow-lg">{card.emoji}</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <motion.div
                          animate={i === active ? { y: [0, -8, 0] } : { y: 0 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center mb-5 shadow-xl"
                        >
                          <Icon className="w-9 h-9" />
                        </motion.div>
                        <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight drop-shadow-md">
                          {card.title}
                        </h3>
                        <p className="font-display italic text-white/85 text-base mt-1">{card.subtitle}</p>
                      </div>

                      {/* Bottom badge */}
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/80">
                        <span>LynxInvitation</span>
                        <span>{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
                      </div>
                    </div>

                    {/* Reflection ground */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/40 blur-2xl rounded-full" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Controls */}
          <button
            onClick={prev}
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Active label + dots */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={CARDS[active].id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center"
            >
              <p className="font-display text-xl font-bold">{CARDS[active].title} Collection</p>
              <p className="text-xs text-muted-foreground">{CARDS[active].tag}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-1.5">
            {CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-foreground" : "w-1.5 bg-border hover:bg-muted-foreground"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={openActive}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition shadow-lg"
          >
            <Eye className="h-4 w-4" /> View {CARDS[active].title} Details
          </button>
        </div>
      </div>

      <ShowcaseDetailModal
        project={openProject}
        isOpen={!!openProject}
        onClose={() => setOpenProject(null)}
      />
    </section>
  );
}
