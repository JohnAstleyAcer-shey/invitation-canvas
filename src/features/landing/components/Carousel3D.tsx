import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Crown, Cake, Baby, Building2, Gem, Sparkles, Eye, ArrowRight } from "lucide-react";
import { ShowcaseDetailModal, type ShowcaseProject } from "./ShowcaseDetailModal";
import { SHOWCASE_PROJECTS } from "../data/showcaseProjects";

const CARDS = [
  { id: "debut",       title: "Debut",       subtitle: "Sweet Eighteen",      tag: "18 Roses · Candles",   icon: Crown,     emoji: "🌹" },
  { id: "wedding",     title: "Wedding",     subtitle: "Forever Begins",      tag: "Vows · Entourage",     icon: Heart,     emoji: "💍" },
  { id: "christening", title: "Christening", subtitle: "Blessed Beginnings",  tag: "Ninang · Ninong",      icon: Baby,      emoji: "👼" },
  { id: "birthday",    title: "Birthday",    subtitle: "Another Trip",        tag: "Cake · Candles",       icon: Cake,      emoji: "🎂" },
  { id: "corporate",   title: "Corporate",   subtitle: "Annual Gala",         tag: "Black-Tie · RSVP",     icon: Building2, emoji: "🏛️" },
  { id: "anniversary", title: "Anniversary", subtitle: "Years of Love",       tag: "Timeline · Vow Renew", icon: Gem,       emoji: "💎" },
  { id: "babyshower",  title: "Baby Shower", subtitle: "It's a Surprise",     tag: "Games · Wishes",       icon: Sparkles,  emoji: "🍼" },
];

export function Carousel3D() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openProject, setOpenProject] = useState<ShowcaseProject | null>(null);
  const total = CARDS.length;

  useEffect(() => {
    if (paused || openProject) return;
    const t = setInterval(() => setActive((i) => (i + 1) % total), 4000);
    return () => clearInterval(t);
  }, [paused, total, openProject]);

  const next = () => setActive((i) => (i + 1) % total);
  const prev = () => setActive((i) => (i - 1 + total) % total);
  const openActive = () => {
    const project = SHOWCASE_PROJECTS[CARDS[active].id];
    if (project) setOpenProject(project);
  };

  return (
    <section id="showcase" className="relative py-24 sm:py-32 bg-background border-b border-border overflow-hidden">
      <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Premium Showcase
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            A Style for Every <span className="italic font-normal">Story</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Hand-crafted, fully managed digital invitations across every milestone — composed with the same editorial precision.
          </p>
        </motion.div>

        {/* Stage */}
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
              const offset = ((i - active) + total) % total;
              const rel = offset > total / 2 ? offset - total : offset;
              const abs = Math.abs(rel);
              const x = rel * 180;
              const z = -abs * 220;
              const rotY = -rel * 22;
              const opacity = abs > 3 ? 0 : 1 - abs * 0.18;
              const scale = 1 - abs * 0.05;
              const Icon = card.icon;
              const isActive = i === active;

              return (
                <motion.button
                  key={card.id}
                  onClick={() => (isActive ? openActive() : setActive(i))}
                  animate={{ x, z, rotateY: rotY, opacity, scale }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                  className="absolute inset-0 overflow-hidden text-left cursor-pointer"
                  style={{ transformStyle: "preserve-3d", zIndex: 100 - abs }}
                >
                  <div className={`relative w-full h-full border ${isActive ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground"} shadow-2xl transition-colors`}>
                    <div className="relative h-full p-7 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold uppercase tracking-[0.25em] ${isActive ? "text-background/60" : "text-muted-foreground"}`}>
                          {card.tag}
                        </span>
                        <span className="text-2xl opacity-80">{card.emoji}</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className={`w-16 h-16 border ${isActive ? "border-background/30" : "border-border"} flex items-center justify-center mb-6`}>
                          <Icon className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-display text-3xl sm:text-4xl font-bold italic tracking-tight">
                          {card.title}
                        </h3>
                        <p className={`font-display italic text-base mt-2 ${isActive ? "text-background/70" : "text-muted-foreground"}`}>
                          {card.subtitle}
                        </p>
                      </div>

                      <div className={`pt-4 border-t ${isActive ? "border-background/20" : "border-border"} flex items-center justify-between text-[9px] uppercase tracking-[0.25em] ${isActive ? "text-background/60" : "text-muted-foreground"}`}>
                        <span>LynxInvitation</span>
                        <span>{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Controls */}
          <button
            onClick={prev}
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-11 h-11 bg-background border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-11 h-11 bg-background border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active label + indicators */}
        <div className="flex flex-col items-center gap-5 mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={CARDS[active].id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-center"
            >
              <p className="font-display text-2xl font-bold italic">{CARDS[active].title} Collection</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{CARDS[active].tag}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-px transition-all ${i === active ? "w-10 bg-foreground" : "w-4 bg-border hover:bg-muted-foreground"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={openActive}
            className="mt-2 inline-flex items-center gap-2 bg-foreground text-background px-7 py-3 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View {CARDS[active].title} Details <ArrowRight className="h-3.5 w-3.5" />
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
