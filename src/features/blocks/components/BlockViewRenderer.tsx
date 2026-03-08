import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring, useMotionValue, useMotionValueEvent } from "framer-motion";
import { MapPin, ExternalLink, Play, ChevronDown, Clock, Users, Gift, HelpCircle, Shirt, Mail, Quote as QuoteIcon, Instagram, Facebook, Twitter, Globe, Music, Disc3, Phone, Camera, Star, Heart, Calendar, Sparkles, DollarSign, QrCode, Cloud, Navigation, ChevronLeft, ChevronRight, X, Pause, Volume2, VolumeX, ArrowDown, Check, Loader2, Send, ImageIcon, Eye, Download, Maximize } from "lucide-react";
import type { InvitationBlock } from "../types";

// Enhanced animation variants — 30+ entrance types
const animationVariants: Record<string, any> = {
  "fade-up": { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
  "fade-in": { initial: { opacity: 0 }, animate: { opacity: 1 } },
  "fade-down": { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
  "fade-left": { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
  "fade-right": { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
  "slide-left": { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } },
  "slide-right": { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } },
  "slide-up": { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 } },
  "zoom": { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 } },
  "zoom-rotate": { initial: { opacity: 0, scale: 0.7, rotate: -8 }, animate: { opacity: 1, scale: 1, rotate: 0 } },
  "bounce": { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5, duration: 0.8 } } },
  "bounce-in": { initial: { opacity: 0, scale: 0.3 }, animate: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.6 } } },
  "rotate": { initial: { opacity: 0, rotate: -10 }, animate: { opacity: 1, rotate: 0 } },
  "rotate-in": { initial: { opacity: 0, rotate: -180, scale: 0.5 }, animate: { opacity: 1, rotate: 0, scale: 1 } },
  "flip": { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 } },
  "flip-y": { initial: { opacity: 0, rotateY: 90 }, animate: { opacity: 1, rotateY: 0 } },
  "blur-in": { initial: { opacity: 0, filter: "blur(20px)" }, animate: { opacity: 1, filter: "blur(0px)" } },
  "blur-up": { initial: { opacity: 0, y: 30, filter: "blur(10px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" } },
  "clip-up": { initial: { opacity: 0, clipPath: "inset(100% 0 0 0)" }, animate: { opacity: 1, clipPath: "inset(0 0 0 0)" } },
  "clip-left": { initial: { opacity: 0, clipPath: "inset(0 100% 0 0)" }, animate: { opacity: 1, clipPath: "inset(0 0 0 0)" } },
  "clip-circle": { initial: { opacity: 0, clipPath: "circle(0% at 50% 50%)" }, animate: { opacity: 1, clipPath: "circle(100% at 50% 50%)" } },
  "elastic": { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 10 } } },
  "swing": { initial: { opacity: 0, rotate: -15, originY: 0 }, animate: { opacity: 1, rotate: 0, transition: { type: "spring", damping: 8 } } },
  "pop": { initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 15 } } },
  "typewriter": { initial: { opacity: 0, width: 0 }, animate: { opacity: 1, width: "auto" } },
  "skew-in": { initial: { opacity: 0, skewY: 5, y: 30 }, animate: { opacity: 1, skewY: 0, y: 0 } },
  "perspective": { initial: { opacity: 0, rotateY: -30, perspective: 800 }, animate: { opacity: 1, rotateY: 0 } },
  "glitch": { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 500 } } },
};

const shadowMap: Record<string, string> = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px -1px rgba(0,0,0,0.1)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
  xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
  "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
  inner: "inset 0 2px 4px rgba(0,0,0,0.06)",
};

// Stagger children container
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function BlockViewRenderer({ blocks }: { blocks: InvitationBlock[] }) {
  return (
    <div className="w-full">
      {blocks.map((block, idx) => <BlockView key={block.id} block={block} index={idx} totalBlocks={blocks.length} />)}
    </div>
  );
}

// Parallax wrapper for sections that want depth
function useParallax(offset = 50) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  return { ref, y: smoothY };
}

function BlockView({ block, index, totalBlocks }: { block: InvitationBlock; index: number; totalBlocks: number }) {
  const c = block.content as any;
  const s = block.style as any;
  const anim = animationVariants[s.animation] || {};
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const { ref: parallaxRef, y: parallaxY } = useParallax(30);

  const wrapStyle: React.CSSProperties = {
    backgroundColor: s.backgroundColor || undefined,
    color: s.textColor || undefined,
    textAlign: s.textAlign || "center",
    padding: s.padding || "1rem",
    fontFamily: s.fontFamily || undefined,
    fontSize: s.fontSize || undefined,
    minHeight: s.fullHeight ? "100vh" : undefined,
    display: s.fullHeight ? "flex" : undefined,
    alignItems: s.fullHeight ? "center" : undefined,
    justifyContent: s.fullHeight ? "center" : undefined,
    position: "relative" as const,
    overflow: "hidden" as const,
    backgroundImage: s.gradient || (s.backgroundImage ? `url(${s.backgroundImage})` : undefined),
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: s.borderRadius || undefined,
    boxShadow: s.shadow && s.shadow !== "none" ? shadowMap[s.shadow] : undefined,
    border: s.borderWidth ? `${s.borderWidth} ${s.borderStyle || "solid"} ${s.borderColor || "#e5e7eb"}` : undefined,
    opacity: s.opacity !== undefined ? s.opacity / 100 : undefined,
    letterSpacing: s.letterSpacing || undefined,
    lineHeight: s.lineHeight || undefined,
    maxWidth: s.maxWidth || undefined,
    margin: s.maxWidth ? "0 auto" : s.margin || undefined,
  };

  const glassClass = s.glassmorphism ? "backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8" : "";

  const Wrap = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <motion.div
      ref={ref}
      {...anim}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={anim.animate}
      style={wrapStyle}
      className={className}
    >
      {s.backgroundImage && !s.gradient && <motion.img src={s.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" style={{ y: parallaxY }} />}
      {s.backgroundOverlay && <div className="absolute inset-0 transition-colors" style={{ backgroundColor: s.backgroundOverlay }} />}
      <div className={`relative z-10 w-full max-w-2xl mx-auto ${glassClass}`}>{children}</div>
    </motion.div>
  );

  switch (block.block_type) {
    case "heading": {
      const Tag = `h${c.level || 2}` as any;
      const sizes: Record<number, string> = { 1: "text-5xl md:text-6xl lg:text-7xl", 2: "text-4xl md:text-5xl", 3: "text-3xl md:text-4xl", 4: "text-2xl md:text-3xl" };
      return (
        <Wrap>
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tag className={`font-display font-bold ${sizes[c.level || 2]} leading-tight`}>
              {c.text}
            </Tag>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-16 h-0.5 mx-auto mt-4 bg-current opacity-20 origin-left"
            />
          </motion.div>
        </Wrap>
      );
    }

    case "text":
      return (
        <Wrap>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-pre-wrap leading-relaxed text-base md:text-lg"
          >
            {c.body}
          </motion.p>
        </Wrap>
      );

    case "image":
      return (
        <Wrap>
          {c.imageUrl && (
            <ImageWithLightbox src={c.imageUrl} alt={c.alt || ""} borderRadius={s.borderRadius} />
          )}
          {c.caption && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-sm opacity-70 mt-3 italic"
            >{c.caption}</motion.p>
          )}
        </Wrap>
      );

    case "spacer":
      return <div style={{ height: c.height || 48 }} />;

    case "divider":
      return (
        <Wrap>
          <motion.hr
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.2 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="border-t origin-center"
          />
        </Wrap>
      );

    case "button":
      return (
        <Wrap>
          <motion.a href={c.url || "#"} target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", damping: 15 }}
            whileHover={{ scale: 1.06, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-block rounded-full font-medium transition-all ${
              c.buttonSize === "lg" ? "px-10 py-4 text-lg" : c.buttonSize === "sm" ? "px-5 py-2 text-sm" : "px-8 py-3"
            } ${
              c.variant === "outline" ? "border-2 border-current hover:bg-current/10" :
              c.variant === "ghost" ? "hover:bg-current/10" :
              c.variant === "gradient" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg" :
              "bg-current text-white"
            }`}
          >
            {c.label || "Button"}
          </motion.a>
        </Wrap>
      );

    case "two_column":
      return (
        <Wrap>
          <div className={`grid gap-6 ${
            c.columnRatio === "2:1" ? "grid-cols-1 md:grid-cols-[2fr_1fr]" : c.columnRatio === "1:2" ? "grid-cols-1 md:grid-cols-[1fr_2fr]" : "grid-cols-1 md:grid-cols-2"
          }`}>
            {(c.columnContent || []).map((col: string, i: number) => (
              <motion.div key={i} className="whitespace-pre-wrap text-left"
                initial={{ opacity: 0, x: i === 0 ? -30 : 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >{col}</motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "three_column":
      return (
        <Wrap>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {(c.columnContent || []).map((col: string, i: number) => (
              <motion.div key={i} variants={staggerItem} className="whitespace-pre-wrap text-left">{col}</motion.div>
            ))}
          </motion.div>
        </Wrap>
      );

    case "cover_hero":
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ ...wrapStyle, backgroundImage: c.imageUrl ? `url(${c.imageUrl})` : s.gradient || undefined, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          {c.overlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70"
            />
          )}
          <div className="relative z-10 text-white text-center px-6">
            <motion.h1
              initial={{ y: 50, opacity: 0, filter: "blur(15px)", scale: 0.95 }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 drop-shadow-2xl"
            >{c.overlayText || "You're Invited"}</motion.h1>
            {c.overlaySubtext && (
              <motion.p
                initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-xl md:text-2xl opacity-90 font-light tracking-wide"
              >{c.overlaySubtext}</motion.p>
            )}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="w-20 h-px bg-white/40 mx-auto mt-6 origin-center"
            />
            {index === 0 && totalBlocks > 1 && (
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 12, 0] }}
                transition={{ opacity: { delay: 2 }, y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] opacity-40">Scroll</span>
                  <ArrowDown className="w-5 h-5 text-white/50" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      );

    case "hero_video": {
      const isYoutube = c.heroVideoUrl?.includes("youtube");
      const ytId = c.heroVideoUrl?.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
      return (
        <div style={{ ...wrapStyle, position: "relative", overflow: "hidden" }} className="flex items-center justify-center">
          {isYoutube && ytId ? (
            <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${ytId}`}
              className="absolute inset-0 w-full h-full" allow="autoplay" style={{ pointerEvents: "none" }} />
          ) : c.heroVideoUrl ? (
            <video src={c.heroVideoUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
          ) : <div className="absolute inset-0 bg-black/80" />}
          {c.heroOverlay && <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 z-[1]" />}
          <div className="relative z-10 text-white text-center px-6">
            <motion.h1 initial={{ scale: 0.85, opacity: 0, filter: "blur(10px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">{c.heroOverlayText || "Video Hero"}</motion.h1>
            {c.heroOverlaySubtext && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-xl opacity-90">{c.heroOverlaySubtext}</motion.p>}
          </div>
        </div>
      );
    }

    case "message_card":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0.9, opacity: 0, filter: "blur(6px)" }} whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div
              initial={{ opacity: 0, rotate: -10 }}
              whileInView={{ opacity: 0.2, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <QuoteIcon className="h-10 w-10 mx-auto mb-4" />
            </motion.div>
            <p className="whitespace-pre-wrap leading-relaxed italic text-lg md:text-xl">{c.body}</p>
          </motion.div>
        </Wrap>
      );

    case "countdown":
    case "countdown_flip":
      return <Wrap><CountdownTimer targetDate={c.targetDate} show={{ days: c.showDays, hours: c.showHours, minutes: c.showMinutes, seconds: c.showSeconds }} style={c.countdownStyle || (block.block_type === "countdown_flip" ? "flip" : "simple")} flipTheme={c.flipStyle} /></Wrap>;

    case "location":
      return (
        <Wrap>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
          >
            <MapPin className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold mb-2"
          >{c.venueName || "Venue"}</motion.h3>
          {c.venueAddress && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mb-3 text-base">{c.venueAddress}</motion.p>}
          {c.venuePhone && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-sm mb-3"><Phone className="h-3 w-3 inline mr-1" />{c.venuePhone}</motion.p>}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center gap-4 mt-4 flex-wrap"
          >
            {c.mapUrl && (
              <motion.a variants={staggerItem} href={c.mapUrl} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-current/10 text-sm font-medium hover:bg-current/20 transition-all shadow-sm hover:shadow-md">
                <ExternalLink className="h-4 w-4" /> View Map
              </motion.a>
            )}
            {c.showDirections && c.venueAddress && (
              <motion.a variants={staggerItem} href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(c.venueAddress)}`} target="_blank" rel="noopener"
                whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-current/10 text-sm font-medium hover:bg-current/20 transition-all shadow-sm hover:shadow-md">
                <Navigation className="h-4 w-4" /> Directions
              </motion.a>
            )}
          </motion.div>
        </Wrap>
      );

    case "map_embed":
      return (
        <Wrap>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            {c.mapEmbedUrl ? (
              <iframe src={c.mapEmbedUrl} className="w-full rounded-xl border-0 shadow-lg" style={{ height: c.mapHeight || 300 }} allowFullScreen loading="lazy" />
            ) : <div className="w-full rounded-xl bg-black/5 flex items-center justify-center" style={{ height: c.mapHeight || 300 }}><MapPin className="h-8 w-8 opacity-30" /></div>}
          </motion.div>
        </Wrap>
      );

    case "timeline":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0, rotate: -15 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <Clock className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="font-display text-2xl md:text-3xl font-bold mb-8">Schedule</motion.h3>
          <div className={`space-y-0 max-w-md mx-auto ${c.timelineLayout === "alternating" ? "relative" : ""}`}>
            {(c.events || []).map((ev: any, i: number) => (
              <motion.div key={i}
                initial={{ x: c.timelineLayout === "alternating" && i % 2 ? 40 : -40, opacity: 0, filter: "blur(4px)" }}
                whileInView={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-start gap-4 py-4 ${i > 0 ? "border-t border-current/10" : ""} ${c.timelineLayout === "alternating" && i % 2 ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="w-20 shrink-0 font-semibold text-sm opacity-70">{ev.time}</div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                  className="w-3 h-3 rounded-full bg-current opacity-40 shrink-0 mt-1.5 ring-4 ring-current/10"
                />
                <div>
                  <p className="font-semibold text-base">{ev.title}</p>
                  {ev.description && <p className="text-sm opacity-70 mt-0.5">{ev.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "entourage":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0, rotate: -15 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <Users className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 15, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="font-display text-2xl md:text-3xl font-bold mb-8">{c.entourageTitle || "Special People"}</motion.h3>
          {c.entourageLayout === "carousel" ? (
            <EntourageCarousel people={c.people || []} />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={c.entourageLayout === "list" ? "space-y-3 max-w-md mx-auto" : "grid grid-cols-2 sm:grid-cols-3 gap-5"}
            >
              {(c.people || []).map((p: any, i: number) => (
                <motion.div key={i} variants={staggerItem}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className={`transition-all duration-300 ${c.entourageLayout === "list" ? "flex items-center gap-4 text-left p-3 rounded-xl bg-current/5 hover:bg-current/8 hover:shadow-md" : "text-center group cursor-default"}`}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className={`${c.entourageLayout === "list" ? "w-12 h-12" : "w-20 h-20 mx-auto mb-3"} rounded-full object-cover ring-2 ring-current/10 group-hover:ring-4 group-hover:ring-current/20 transition-all duration-300`} loading="lazy" />
                  ) : (
                    <div className={`${c.entourageLayout === "list" ? "w-12 h-12" : "w-20 h-20 mx-auto mb-3"} rounded-full bg-current/10 flex items-center justify-center text-xl font-bold group-hover:bg-current/20 transition-colors duration-300`}>{p.name?.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    {p.role && <p className="text-xs opacity-60">{p.role}</p>}
                    {p.message && <p className="text-xs opacity-50 mt-1 italic">{p.message}</p>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Wrap>
      );

    case "gallery":
      return (
        <Wrap>
          {c.galleryLayout === "carousel" ? (
            <GalleryCarousel images={c.images || []} showCaptions={c.showCaptions} />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`grid grid-cols-${c.columns || 3} gap-2`}
            >
              {(c.images || []).map((img: any, i: number) => (
                <motion.div key={i} variants={staggerItem}
                  whileHover={{ scale: 1.04, zIndex: 10 }}
                  className="overflow-hidden rounded-lg group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <img src={img.url} alt={img.caption || ""} className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                  {c.showCaptions && img.caption && <p className="text-xs opacity-60 mt-1 text-center">{img.caption}</p>}
                </motion.div>
              ))}
            </motion.div>
          )}
        </Wrap>
      );

    case "video": {
      if (c.videoUrl?.includes("youtube")) {
        const id = c.videoUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
        return <Wrap><motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="aspect-video rounded-xl overflow-hidden shadow-2xl"><iframe src={`https://www.youtube.com/embed/${id}${c.autoplay ? "?autoplay=1" : ""}`} className="w-full h-full" allowFullScreen allow="autoplay" /></motion.div></Wrap>;
      }
      return <Wrap><motion.video initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} src={c.videoUrl} controls autoPlay={c.autoplay} muted={c.muted} loop={c.loop} poster={c.posterUrl} className="w-full rounded-xl shadow-2xl" /></Wrap>;
    }

    case "dress_code":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0, rotate: -20 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <Shirt className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="font-display text-2xl md:text-3xl font-bold mb-4">Dress Code</motion.h3>
          {c.dressCodeNote && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className="text-sm mb-6 max-w-md mx-auto">{c.dressCodeNote}</motion.p>}
          {c.dressCodeImage && <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} src={c.dressCodeImage} alt="Dress code" className="w-full max-w-sm mx-auto rounded-xl mb-6 shadow-lg" loading="lazy" />}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center gap-5 flex-wrap"
          >
            {(c.colors || []).map((col: any, i: number) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ scale: 1.15, y: -4 }} className="text-center group cursor-default">
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-16 h-16 rounded-full mx-auto border-2 border-white/20 shadow-lg ring-4 ring-current/5 group-hover:ring-8 group-hover:ring-current/15 transition-all duration-300"
                  style={{ backgroundColor: col.hex }}
                />
                {col.name && <p className="text-xs mt-2 font-medium">{col.name}</p>}
                {col.description && <p className="text-[10px] opacity-50">{col.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        </Wrap>
      );

    case "gift_registry":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0, rotate: 15 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <Gift className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="font-display text-2xl md:text-3xl font-bold mb-6">{c.registryTitle || "Gift Registry"}</motion.h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3 max-w-md mx-auto"
          >
            {(c.items || []).map((item: any, i: number) => (
              <motion.div key={i} variants={staggerItem}
                whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.06)" }}
                className="p-4 rounded-xl bg-current/5 text-left transition-all duration-300 group hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {item.imageUrl && <motion.img whileHover={{ scale: 1.1 }} src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 transition-transform" loading="lazy" />}
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {item.category && <span className="text-[10px] px-2 py-0.5 rounded-full bg-current/10 font-medium">{item.category}</span>}
                    </div>
                  </div>
                  {item.price && <span className="text-sm font-bold opacity-70 shrink-0">{item.price}</span>}
                </div>
                {item.description && <p className="text-sm opacity-70 mt-2">{item.description}</p>}
                {item.url && (
                  <motion.a href={item.url} target="_blank" rel="noopener" whileHover={{ x: 4 }}
                    className="text-xs underline mt-2 inline-flex items-center gap-1 font-medium opacity-70 hover:opacity-100 transition-opacity">
                    {item.linkLabel || "View"} <ExternalLink className="h-3 w-3" />
                  </motion.a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </Wrap>
      );

    case "faq":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0, rotate: -15 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <HelpCircle className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="font-display text-2xl md:text-3xl font-bold mb-6">{c.faqTitle || "FAQ"}</motion.h3>
          <div className="space-y-2 max-w-lg mx-auto text-left">
            {(c.faqs || []).map((faq: any, i: number) => <FaqItem key={i} question={faq.question} answer={faq.answer} index={i} />)}
          </div>
        </Wrap>
      );

    case "accordion":
      return (
        <Wrap>
          <div className="space-y-2 max-w-lg mx-auto text-left">
            {(c.accordionItems || []).map((item: any, i: number) => (
              <FaqItem key={i} question={item.title} answer={item.content} style={c.accordionStyle} index={i} />
            ))}
          </div>
        </Wrap>
      );

    case "icon_text": {
      const iconMap: Record<string, any> = { Heart, Star, Gift, Music, Camera, MapPin, Clock, Users, Mail, Phone, Calendar, Sparkles, Check, Eye, Download };
      const Icon = iconMap[c.iconName] || Star;
      const sizes = { sm: "h-8 w-8", md: "h-12 w-12", lg: "h-16 w-16" };
      return (
        <Wrap>
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 10, stiffness: 200 }}
          >
            <Icon className={`${sizes[c.iconSize as keyof typeof sizes] || sizes.md} mx-auto mb-4 opacity-70`} />
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="font-display text-xl md:text-2xl font-bold mb-2">{c.title}</motion.h3>
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="text-sm opacity-70 max-w-md mx-auto leading-relaxed">{c.description}</motion.p>
        </Wrap>
      );
    }

    case "testimonial":
      return (
        <Wrap>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8 max-w-lg mx-auto"
          >
            {(c.testimonials || []).map((t: any, i: number) => (
              <motion.div key={i} variants={staggerItem}
                whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                className="text-center p-6 rounded-2xl bg-current/5 transition-all duration-300">
                <QuoteIcon className="h-6 w-6 mx-auto mb-3 opacity-30" />
                <p className="italic text-lg leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center justify-center gap-3">
                  {t.imageUrl && <img src={t.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" loading="lazy" />}
                  <div>
                    <p className="font-semibold text-sm">{t.author}</p>
                    {t.role && <p className="text-xs opacity-60">{t.role}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Wrap>
      );

    case "rsvp":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0, rotate: -10 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <Mail className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="font-display text-2xl md:text-3xl font-bold mb-2">{c.rsvpTitle || "RSVP"}</motion.h3>
          {c.rsvpSubtitle && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className="text-sm mb-4">{c.rsvpSubtitle}</motion.p>}
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 0.5, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 }}
            className="text-sm bg-current/5 rounded-xl p-4 max-w-sm mx-auto">RSVP form appears with invitation codes.</motion.p>
        </Wrap>
      );

    case "embed": {
      if (c.embedType === "youtube" && c.embedUrl) {
        const id = c.embedUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
        return <Wrap><motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-xl overflow-hidden shadow-2xl" style={{ height: c.embedHeight || 315 }}><iframe src={`https://www.youtube.com/embed/${id}`} className="w-full h-full" allowFullScreen /></motion.div></Wrap>;
      }
      if (c.embedType === "spotify" && c.embedUrl) {
        return <Wrap><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><iframe src={c.embedUrl.replace("open.spotify.com", "open.spotify.com/embed")} className="w-full rounded-xl" style={{ height: c.embedHeight || 80 }} allow="encrypted-media" /></motion.div></Wrap>;
      }
      if (c.embedType === "vimeo" && c.embedUrl) {
        const vimeoId = c.embedUrl.match(/vimeo\.com\/(\d+)/)?.[1];
        return <Wrap><motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-xl overflow-hidden shadow-2xl" style={{ height: c.embedHeight || 315 }}><iframe src={`https://player.vimeo.com/video/${vimeoId}`} className="w-full h-full" allowFullScreen /></motion.div></Wrap>;
      }
      return <Wrap><p className="text-sm opacity-50">Embed: {c.embedUrl || "No URL set"}</p></Wrap>;
    }

    case "social_links": {
      const iconMap: Record<string, any> = { instagram: Instagram, facebook: Facebook, twitter: Twitter, tiktok: Globe, website: Globe, youtube: Play, spotify: Music, whatsapp: Phone, telegram: Globe, linkedin: Globe };
      return (
        <Wrap>
          {c.socialTitle && <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-lg font-bold mb-4">{c.socialTitle}</motion.h3>}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center gap-3 flex-wrap"
          >
            {(c.links || []).map((link: any, i: number) => {
              const Icon = iconMap[link.platform] || Globe;
              if (c.socialStyle === "buttons") {
                return <motion.a key={i} variants={staggerItem} href={link.url} target="_blank" rel="noopener" whileHover={{ scale: 1.06, y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 rounded-full bg-current/10 text-sm font-medium hover:bg-current/20 transition-all inline-flex items-center gap-2 shadow-sm"><Icon className="h-4 w-4" /> {link.label || link.platform}</motion.a>;
              }
              if (c.socialStyle === "pills") {
                return <motion.a key={i} variants={staggerItem} href={link.url} target="_blank" rel="noopener" whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 rounded-full border border-current/20 text-xs font-medium hover:bg-current/10 transition-all inline-flex items-center gap-1.5"><Icon className="h-3 w-3" /> {link.label || link.platform}</motion.a>;
              }
              return <motion.a key={i} variants={staggerItem} href={link.url} target="_blank" rel="noopener"
                whileHover={{ scale: 1.2, rotate: 8, y: -4 }} whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-current/10 flex items-center justify-center hover:bg-current/20 transition-all shadow-sm hover:shadow-md"><Icon className="h-5 w-5" /></motion.a>;
            })}
          </motion.div>
        </Wrap>
      );
    }

    case "guestbook":
      return (
        <Wrap>
          <motion.h3 initial={{ opacity: 0, y: 15, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold mb-4">{c.guestbookTitle || "Guestbook"}</motion.h3>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="text-sm mb-6">Messages from guests will appear here.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25, type: "spring" }}
            className="max-w-sm mx-auto p-4 rounded-xl bg-current/5 hover:bg-current/8 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-9 rounded-lg border border-current/20 px-3 flex items-center text-sm opacity-40">Leave a message...</div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-lg bg-current/10 flex items-center justify-center cursor-pointer"><Send className="h-4 w-4 opacity-40" /></motion.div>
            </div>
          </motion.div>
        </Wrap>
      );

    case "photo_collage":
      return (
        <Wrap>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`grid ${c.layout === "mosaic" ? "grid-cols-3 auto-rows-[200px]" : `grid-cols-${c.columns || 3}`} gap-2`}
          >
            {(c.collageImages || []).map((img: any, i: number) => (
              <motion.img key={i} variants={staggerItem} src={img.url} alt=""
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className={`w-full rounded-lg object-cover ${c.layout === "mosaic" && i % 3 === 0 ? "row-span-2" : ""} transition-all duration-500 shadow-sm hover:shadow-xl`}
                loading="lazy" />
            ))}
          </motion.div>
        </Wrap>
      );

    case "quote":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0.85, opacity: 0, filter: "blur(8px)" }} whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div initial={{ rotate: -15, opacity: 0 }} whileInView={{ rotate: 0, opacity: 0.2 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <QuoteIcon className="h-10 w-10 mx-auto mb-4" />
            </motion.div>
            <p className="italic text-xl md:text-2xl lg:text-3xl max-w-lg mx-auto leading-relaxed font-light">"{c.body}"</p>
            {c.author && (
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 0.6, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                className="text-sm mt-4 font-medium">— {c.author}</motion.p>
            )}
          </motion.div>
        </Wrap>
      );

    case "separator_fancy": {
      const separators: Record<string, string> = {
        dots: "• • •", stars: "✦ ✦ ✦", hearts: "♥ ♥ ♥",
        floral: "❀ ❀ ❀", wave: "〰〰〰", diamond: "◆ ◆ ◆",
      };
      return (
        <Wrap>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl tracking-[1em]"
          >{separators[c.separatorStyle || "floral"]}</motion.div>
        </Wrap>
      );
    }

    case "marquee_text":
      return (
        <div style={wrapStyle} className="overflow-hidden">
          <motion.div animate={{ x: c.marqueeDirection === "right" ? ["-100%", "100%"] : ["100%", "-100%"] }}
            transition={{ duration: c.marqueeSpeed || 20, repeat: Infinity, ease: "linear" }}
            className="font-display text-2xl md:text-4xl font-bold whitespace-nowrap opacity-80">
            {c.marqueeText || "Scrolling text..."} &nbsp;&nbsp;&nbsp; {c.marqueeText || ""}
          </motion.div>
        </div>
      );

    case "audio_player":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0, rotate: -20 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <Music className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="font-display text-lg font-bold">{c.audioTitle || "Audio"}</motion.h3>
          {c.audioArtist && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className="text-sm mb-4">{c.audioArtist}</motion.p>}
          {c.audioUrl && <motion.audio initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.35 }} src={c.audioUrl} controls autoPlay={c.audioAutoplay} className="w-full max-w-sm mx-auto" />}
        </Wrap>
      );

    case "music_player":
      return (
        <Wrap>
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 15 }}
            whileHover={{ y: -3, boxShadow: "0 12px 35px rgba(0,0,0,0.1)" }}
            className="flex items-center gap-4 max-w-sm mx-auto p-5 rounded-2xl bg-current/5 shadow-sm transition-all duration-300"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-current/10 flex items-center justify-center">
              {c.musicCoverUrl ? <img src={c.musicCoverUrl} alt="" className="w-full h-full object-cover" loading="lazy" /> : (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                  <Disc3 className="h-10 w-10 opacity-40" />
                </motion.div>
              )}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-semibold text-base truncate">{c.musicTitle || "Song"}</p>
              <p className="text-sm opacity-60 truncate">{c.musicArtist || "Artist"}</p>
              {c.musicUrl && <audio src={c.musicUrl} controls autoPlay={c.musicAutoplay} className="w-full mt-2" style={{ height: 32 }} />}
            </div>
          </motion.div>
        </Wrap>
      );

    case "photo_upload_wall":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0, rotate: 15 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <Camera className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="font-display text-2xl md:text-3xl font-bold mb-4">{c.wallTitle || "Photo Wall"}</motion.h3>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
            className="text-sm mb-4">Guests can upload and share photos here.</motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, type: "spring" }}
            whileHover={{ scale: 1.03, borderColor: "currentColor" }}
            className="max-w-xs mx-auto p-6 rounded-xl border-2 border-dashed border-current/20 text-center cursor-pointer transition-all duration-300"
          >
            <Camera className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm opacity-50">Tap to upload a photo</p>
          </motion.div>
        </Wrap>
      );

    case "seating_chart":
      return (
        <Wrap>
          <motion.h3 initial={{ opacity: 0, y: 15, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold mb-8">{c.seatingTitle || "Seating Chart"}</motion.h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {(c.tables || []).map((table: any, i: number) => (
              <motion.div key={i} variants={staggerItem}
                whileHover={{ y: -4, scale: 1.03 }}
                className="p-4 rounded-2xl bg-current/5 text-center hover:bg-current/10 transition-all duration-300 group hover:shadow-md">
                <motion.div whileHover={{ scale: 1.15 }} className="w-14 h-14 rounded-full bg-current/10 mx-auto mb-3 flex items-center justify-center font-bold text-lg transition-transform">{i + 1}</motion.div>
                <p className="font-semibold text-sm mb-2">{table.name}</p>
                <div className="text-xs opacity-60 space-y-0.5">{(table.seats || []).map((seat: string, j: number) => <p key={j}>{seat}</p>)}</div>
              </motion.div>
            ))}
          </motion.div>
        </Wrap>
      );

    case "pricing_table":
      return (
        <Wrap>
          <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold mb-8">{c.pricingTitle || "Packages"}</motion.h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {(c.pricingItems || []).map((item: any, i: number) => (
              <motion.div key={i} variants={staggerItem}
                whileHover={{ y: -6, boxShadow: "0 15px 40px rgba(0,0,0,0.1)" }}
                className={`p-6 rounded-2xl text-center transition-all duration-300 ${item.highlighted ? "bg-current/10 ring-2 ring-current/30 scale-105 shadow-xl" : "bg-current/5 hover:bg-current/10"}`}>
                <p className="font-bold text-lg">{item.name}</p>
                <p className="text-4xl font-display font-bold my-4">{item.price}</p>
                {item.description && <p className="text-sm opacity-70 mb-3">{item.description}</p>}
                {item.features && (
                  <ul className="text-sm opacity-60 space-y-1">
                    {item.features.map((f: string, j: number) => <li key={j} className="flex items-center gap-1 justify-center"><Check className="h-3 w-3" /> {f}</li>)}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        </Wrap>
      );

    case "weather_widget":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <Cloud className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <h3 className="font-display text-lg font-bold">Weather Forecast</h3>
          <p className="text-sm opacity-70 mt-1">{c.weatherLocation || "Location not set"}</p>
          {c.weatherDate && <p className="text-xs opacity-50 mt-1">{c.weatherDate}</p>}
        </Wrap>
      );

    case "qr_code":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0, rotate: -10 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}
            className="mx-auto rounded-2xl bg-white p-6 inline-block shadow-lg hover:shadow-xl transition-shadow">
            <QrCode className="opacity-30" style={{ width: c.qrSize || 200, height: c.qrSize || 200 }} />
          </motion.div>
          {c.qrLabel && <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 0.7, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-sm mt-4 font-medium">{c.qrLabel}</motion.p>}
        </Wrap>
      );

    case "contact_card":
      return (
        <Wrap>
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 15 }}
            whileHover={{ y: -4, boxShadow: "0 15px 40px rgba(0,0,0,0.1)" }}
            className="max-w-sm mx-auto p-8 rounded-2xl bg-current/5 text-center shadow-sm transition-all duration-300"
          >
            {c.contactImageUrl ? (
              <motion.img whileHover={{ scale: 1.05 }} src={c.contactImageUrl} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-current/10 transition-all" loading="lazy" />
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} className="w-24 h-24 rounded-full mx-auto mb-4 bg-current/10 flex items-center justify-center text-3xl font-bold transition-transform">{c.contactName?.charAt(0) || "?"}</motion.div>
            )}
            <h3 className="font-display text-xl font-bold">{c.contactName || "Contact"}</h3>
            {c.contactRole && <p className="text-sm opacity-60 mb-3">{c.contactRole}</p>}
            <div className="space-y-2 mt-4">
              {c.contactPhone && <motion.a whileHover={{ x: 3 }} href={`tel:${c.contactPhone}`} className="flex items-center justify-center gap-2 text-sm hover:opacity-80 transition"><Phone className="h-4 w-4" />{c.contactPhone}</motion.a>}
              {c.contactEmail && <motion.a whileHover={{ x: 3 }} href={`mailto:${c.contactEmail}`} className="flex items-center justify-center gap-2 text-sm hover:opacity-80 transition"><Mail className="h-4 w-4" />{c.contactEmail}</motion.a>}
            </div>
          </motion.div>
        </Wrap>
      );

    default:
      return null;
  }
}

// --- Sub-components with enhanced animations ---

function ImageWithLightbox({ src, alt, borderRadius }: { src: string; alt: string; borderRadius?: string }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <>
      <motion.img
        src={src}
        alt={alt}
        className="w-full rounded-xl object-cover cursor-pointer hover:shadow-2xl transition-shadow duration-500"
        style={{ borderRadius }}
        initial={{ scale: 1.08, opacity: 0, filter: "blur(8px)" }}
        whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.02 }}
        loading="lazy"
        onClick={() => setExpanded(true)}
      />
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setExpanded(false)}
          >
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.7, opacity: 0, rotateX: 10 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotateX: -10 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition text-white"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CountdownTimer({ targetDate, show, style = "simple", flipTheme }: {
  targetDate?: string; show: Record<string, boolean>; style?: string; flipTheme?: string;
}) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const update = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
      setRemaining({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    show.days !== false && { label: "Days", value: remaining.days },
    show.hours !== false && { label: "Hours", value: remaining.hours },
    show.minutes !== false && { label: "Minutes", value: remaining.minutes },
    show.seconds !== false && { label: "Seconds", value: remaining.seconds },
  ].filter(Boolean) as { label: string; value: number }[];

  if (style === "flip" || style === "circle") {
    const themeClass = flipTheme === "light" ? "bg-white text-black shadow-md" : flipTheme === "glass" ? "bg-white/10 backdrop-blur-md text-white border border-white/20" : "bg-black text-white";
    return (
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-center gap-4">
        {units.map(u => (
          <motion.div key={u.label} variants={staggerItem} className="text-center">
            <motion.div key={u.value} initial={{ rotateX: 90, scale: 0.8 }} animate={{ rotateX: 0, scale: 1 }} transition={{ duration: 0.4, type: "spring" }}
              className={`${style === "circle" ? "w-20 h-20 rounded-full" : "w-18 h-22 rounded-xl"} ${themeClass} flex items-center justify-center text-3xl md:text-4xl font-display font-bold`}>
              {String(u.value).padStart(2, "0")}
            </motion.div>
            <div className="text-xs opacity-60 mt-2 font-medium">{u.label}</div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (style === "minimal") {
    return (
      <div className="flex justify-center gap-2 text-2xl md:text-3xl font-mono font-light">
        {units.map((u, i) => (
          <span key={u.label}>
            {i > 0 && <span className="opacity-30 mx-1">:</span>}
            <motion.span key={u.value} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} className="font-bold">{String(u.value).padStart(2, "0")}</motion.span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-center gap-6 md:gap-8">
      {units.map(u => (
        <motion.div key={u.label} variants={staggerItem} className="text-center">
          <motion.div key={u.value} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 10 }}
            className="text-4xl md:text-6xl font-display font-bold">
            {String(u.value).padStart(2, "0")}
          </motion.div>
          <div className="text-xs opacity-60 mt-2 font-medium uppercase tracking-wider">{u.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function FaqItem({ question, answer, style, index = 0 }: { question: string; answer: string; style?: string; index?: number }) {
  const [open, setOpen] = useState(false);
  const cls = style === "filled" ? "bg-current/5 rounded-xl" : style === "simple" ? "" : "border border-current/10 rounded-xl";
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(2px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`overflow-hidden ${cls}`}
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-current/5 transition-colors duration-200 rounded-xl">
        <span className="font-semibold text-sm pr-4">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-4 pb-4 text-sm opacity-70 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GalleryCarousel({ images, showCaptions }: { images: { url: string; caption?: string }[]; showCaptions?: boolean }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  if (!images.length) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIdx}
            src={images[currentIdx].url}
            alt={images[currentIdx].caption || ""}
            initial={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
        </AnimatePresence>
      </div>
      {showCaptions && images[currentIdx].caption && (
        <motion.p key={`caption-${currentIdx}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 0.7, y: 0 }}
          className="text-sm mt-2 text-center italic">{images[currentIdx].caption}</motion.p>
      )}
      {images.length > 1 && (
        <>
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentIdx((currentIdx - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition backdrop-blur-sm">
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentIdx((currentIdx + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition backdrop-blur-sm">
            <ChevronRight className="h-4 w-4" />
          </motion.button>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {images.length <= 8 ? images.map((_, i) => (
              <motion.button key={i} onClick={() => setCurrentIdx(i)} whileHover={{ scale: 1.3 }}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentIdx ? "bg-current w-6" : "bg-current/30 w-2"}`} />
            )) : (
              <span className="text-xs opacity-50">{currentIdx + 1} / {images.length}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function EntourageCarousel({ people }: { people: { name: string; role?: string; imageUrl?: string; message?: string }[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  if (!people.length) return null;
  const p = people[currentIdx];

  return (
    <div className="relative max-w-sm mx-auto">
      <AnimatePresence mode="wait">
        <motion.div key={currentIdx}
          initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center py-6">
          {p.imageUrl ? (
            <img src={p.imageUrl} alt={p.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-current/10" loading="lazy" />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-current/10 flex items-center justify-center text-3xl font-bold">{p.name?.charAt(0)}</div>
          )}
          <p className="font-semibold text-lg">{p.name}</p>
          {p.role && <p className="text-sm opacity-60">{p.role}</p>}
          {p.message && <p className="text-sm opacity-50 mt-2 italic">"{p.message}"</p>}
        </motion.div>
      </AnimatePresence>
      {people.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentIdx((currentIdx - 1 + people.length) % people.length)}
            className="w-8 h-8 rounded-full bg-current/10 flex items-center justify-center hover:bg-current/20 transition">
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <span className="text-sm opacity-50 flex items-center">{currentIdx + 1}/{people.length}</span>
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentIdx((currentIdx + 1) % people.length)}
            className="w-8 h-8 rounded-full bg-current/10 flex items-center justify-center hover:bg-current/20 transition">
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      )}
    </div>
  );
}
