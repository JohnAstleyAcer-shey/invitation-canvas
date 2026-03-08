import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { MapPin, ExternalLink, Play, ChevronDown, Clock, Users, Gift, HelpCircle, Shirt, Mail, Quote as QuoteIcon, Instagram, Facebook, Twitter, Globe, Music, Disc3, Phone, Camera, Star, Heart, Calendar, Sparkles, DollarSign, QrCode, Cloud, Navigation, ChevronLeft, ChevronRight, X, Pause, Volume2, VolumeX, ArrowDown, Check, Loader2, Send, ImageIcon, Eye, Download, Maximize } from "lucide-react";
import type { InvitationBlock } from "../types";

const animationVariants: Record<string, any> = {
  "fade-up": { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
  "fade-in": { initial: { opacity: 0 }, animate: { opacity: 1 } },
  "slide-left": { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
  "slide-right": { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
  "zoom": { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
  "bounce": { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5 } } },
  "rotate": { initial: { opacity: 0, rotate: -5 }, animate: { opacity: 1, rotate: 0 } },
  "flip": { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 } },
};

const shadowMap: Record<string, string> = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px -1px rgba(0,0,0,0.1)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
  xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
  "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
  inner: "inset 0 2px 4px rgba(0,0,0,0.06)",
};

export function BlockViewRenderer({ blocks }: { blocks: InvitationBlock[] }) {
  return (
    <div className="w-full">
      {blocks.map((block, idx) => <BlockView key={block.id} block={block} index={idx} totalBlocks={blocks.length} />)}
    </div>
  );
}

function BlockView({ block, index, totalBlocks }: { block: InvitationBlock; index: number; totalBlocks: number }) {
  const c = block.content as any;
  const s = block.style as any;
  const anim = animationVariants[s.animation] || {};
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

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
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={anim.animate}
      style={wrapStyle}
      className={className}
    >
      {s.backgroundImage && !s.gradient && <img src={s.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
      {s.backgroundOverlay && <div className="absolute inset-0" style={{ backgroundColor: s.backgroundOverlay }} />}
      <div className={`relative z-10 w-full max-w-2xl mx-auto ${glassClass}`}>{children}</div>
    </motion.div>
  );

  switch (block.block_type) {
    case "heading": {
      const Tag = `h${c.level || 2}` as any;
      const sizes: Record<number, string> = { 1: "text-5xl md:text-6xl", 2: "text-4xl md:text-5xl", 3: "text-3xl", 4: "text-2xl" };
      return (
        <Wrap>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Tag className={`font-display font-bold ${sizes[c.level || 2]} leading-tight`}>{c.text}</Tag>
          </motion.div>
        </Wrap>
      );
    }

    case "text":
      return (
        <Wrap>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
          {c.caption && <p className="text-sm opacity-70 mt-3 italic">{c.caption}</p>}
        </Wrap>
      );

    case "spacer":
      return <div style={{ height: c.height || 48 }} />;

    case "divider":
      return (
        <Wrap>
          <motion.hr
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t opacity-20 origin-left"
          />
        </Wrap>
      );

    case "button":
      return (
        <Wrap>
          <motion.a href={c.url || "#"} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
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
              <motion.div key={i} className="whitespace-pre-wrap text-left" initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>{col}</motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "three_column":
      return (
        <Wrap>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(c.columnContent || []).map((col: string, i: number) => (
              <motion.div key={i} className="whitespace-pre-wrap text-left" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>{col}</motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "cover_hero":
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
          style={{ ...wrapStyle, backgroundImage: c.imageUrl ? `url(${c.imageUrl})` : s.gradient || undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
          {c.overlay && <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />}
          <div className="relative z-10 text-white text-center px-6">
            <motion.h1 initial={{ y: 40, opacity: 0, filter: "blur(10px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} transition={{ delay: 0.3, duration: 1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 drop-shadow-lg">{c.overlayText || "You're Invited"}</motion.h1>
            {c.overlaySubtext && (
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
                className="text-xl md:text-2xl opacity-90 font-light tracking-wide">{c.overlaySubtext}</motion.p>
            )}
            {/* Animated scroll hint */}
            {index === 0 && totalBlocks > 1 && (
              <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs uppercase tracking-widest opacity-50">Scroll</span>
                  <ArrowDown className="w-5 h-5 text-white/60" />
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
            <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}
              className="font-display text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">{c.heroOverlayText || "Video Hero"}</motion.h1>
            {c.heroOverlaySubtext && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xl opacity-90">{c.heroOverlaySubtext}</motion.p>}
          </div>
        </div>
      );
    }

    case "message_card":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <QuoteIcon className="h-8 w-8 mx-auto mb-4 opacity-20" />
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
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
            <MapPin className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">{c.venueName || "Venue"}</h3>
          {c.venueAddress && <p className="opacity-70 mb-3 text-base">{c.venueAddress}</p>}
          {c.venuePhone && <p className="text-sm opacity-60 mb-3"><Phone className="h-3 w-3 inline mr-1" />{c.venuePhone}</p>}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {c.mapUrl && (
              <motion.a href={c.mapUrl} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-current/10 text-sm font-medium hover:bg-current/20 transition">
                <ExternalLink className="h-4 w-4" /> View Map
              </motion.a>
            )}
            {c.showDirections && c.venueAddress && (
              <motion.a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(c.venueAddress)}`} target="_blank" rel="noopener"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-current/10 text-sm font-medium hover:bg-current/20 transition">
                <Navigation className="h-4 w-4" /> Directions
              </motion.a>
            )}
          </div>
        </Wrap>
      );

    case "map_embed":
      return (
        <Wrap>
          {c.mapEmbedUrl ? (
            <iframe src={c.mapEmbedUrl} className="w-full rounded-xl border-0" style={{ height: c.mapHeight || 300 }} allowFullScreen loading="lazy" />
          ) : <div className="w-full rounded-xl bg-black/5 flex items-center justify-center" style={{ height: c.mapHeight || 300 }}><MapPin className="h-8 w-8 opacity-30" /></div>}
        </Wrap>
      );

    case "timeline":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
            <Clock className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-8">Schedule</h3>
          <div className={`space-y-0 max-w-md mx-auto ${c.timelineLayout === "alternating" ? "relative" : ""}`}>
            {(c.events || []).map((ev: any, i: number) => (
              <motion.div key={i} initial={{ x: c.timelineLayout === "alternating" && i % 2 ? 30 : -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 py-4 ${i > 0 ? "border-t border-current/10" : ""} ${c.timelineLayout === "alternating" && i % 2 ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="w-20 shrink-0 font-semibold text-sm opacity-70">{ev.time}</div>
                <div className="w-3 h-3 rounded-full bg-current opacity-40 shrink-0 mt-1.5 ring-4 ring-current/10" />
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
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
            <Users className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-8">{c.entourageTitle || "Special People"}</h3>
          {c.entourageLayout === "carousel" ? (
            <EntourageCarousel people={c.people || []} />
          ) : (
            <div className={c.entourageLayout === "list" ? "space-y-3 max-w-md mx-auto" : "grid grid-cols-2 sm:grid-cols-3 gap-5"}>
              {(c.people || []).map((p: any, i: number) => (
                <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, type: "spring", damping: 12 }}
                  className={c.entourageLayout === "list" ? "flex items-center gap-4 text-left p-3 rounded-xl bg-current/5" : "text-center group"}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className={`${c.entourageLayout === "list" ? "w-12 h-12" : "w-20 h-20 mx-auto mb-3"} rounded-full object-cover ring-2 ring-current/10 group-hover:ring-4 transition-all`} loading="lazy" />
                  ) : (
                    <div className={`${c.entourageLayout === "list" ? "w-12 h-12" : "w-20 h-20 mx-auto mb-3"} rounded-full bg-current/10 flex items-center justify-center text-xl font-bold group-hover:bg-current/20 transition-colors`}>{p.name?.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    {p.role && <p className="text-xs opacity-60">{p.role}</p>}
                    {p.message && <p className="text-xs opacity-50 mt-1 italic">{p.message}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Wrap>
      );

    case "gallery":
      return (
        <Wrap>
          {c.galleryLayout === "carousel" ? (
            <GalleryCarousel images={c.images || []} showCaptions={c.showCaptions} />
          ) : (
            <div className={`grid grid-cols-${c.columns || 3} gap-2`}>
              {(c.images || []).map((img: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="overflow-hidden rounded-lg group cursor-pointer">
                  <img src={img.url} alt={img.caption || ""} className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  {c.showCaptions && img.caption && <p className="text-xs opacity-60 mt-1 text-center">{img.caption}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </Wrap>
      );

    case "video": {
      if (c.videoUrl?.includes("youtube")) {
        const id = c.videoUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
        return <Wrap><div className="aspect-video rounded-xl overflow-hidden shadow-xl"><iframe src={`https://www.youtube.com/embed/${id}${c.autoplay ? "?autoplay=1" : ""}`} className="w-full h-full" allowFullScreen allow="autoplay" /></div></Wrap>;
      }
      return <Wrap><video src={c.videoUrl} controls autoPlay={c.autoplay} muted={c.muted} loop={c.loop} poster={c.posterUrl} className="w-full rounded-xl shadow-xl" /></Wrap>;
    }

    case "dress_code":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
            <Shirt className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Dress Code</h3>
          {c.dressCodeNote && <p className="text-sm opacity-70 mb-6 max-w-md mx-auto">{c.dressCodeNote}</p>}
          {c.dressCodeImage && <img src={c.dressCodeImage} alt="Dress code" className="w-full max-w-sm mx-auto rounded-xl mb-6" loading="lazy" />}
          <div className="flex justify-center gap-5 flex-wrap">
            {(c.colors || []).map((col: any, i: number) => (
              <motion.div key={i} initial={{ scale: 0, rotate: -20 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring", damping: 10 }} className="text-center group">
                <div className="w-16 h-16 rounded-full mx-auto border-2 border-white/20 shadow-lg ring-4 ring-current/5 group-hover:ring-8 group-hover:scale-110 transition-all duration-300" style={{ backgroundColor: col.hex }} />
                {col.name && <p className="text-xs mt-2 font-medium">{col.name}</p>}
                {col.description && <p className="text-[10px] opacity-50">{col.description}</p>}
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "gift_registry":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
            <Gift className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-6">{c.registryTitle || "Gift Registry"}</h3>
          <div className="space-y-3 max-w-md mx-auto">
            {(c.items || []).map((item: any, i: number) => (
              <motion.div key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-current/5 text-left hover:bg-current/10 transition-colors group">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform" loading="lazy" />}
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {item.category && <span className="text-[10px] px-2 py-0.5 rounded-full bg-current/10 font-medium">{item.category}</span>}
                    </div>
                  </div>
                  {item.price && <span className="text-sm font-bold opacity-70 shrink-0">{item.price}</span>}
                </div>
                {item.description && <p className="text-sm opacity-70 mt-2">{item.description}</p>}
                {item.url && (
                  <motion.a href={item.url} target="_blank" rel="noopener" whileHover={{ x: 3 }}
                    className="text-xs underline mt-2 inline-flex items-center gap-1 font-medium">
                    {item.linkLabel || "View"} <ExternalLink className="h-3 w-3" />
                  </motion.a>
                )}
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "faq":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
            <HelpCircle className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-6">{c.faqTitle || "FAQ"}</h3>
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
          <motion.div initial={{ scale: 0, rotate: -10 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}>
            <Icon className={`${sizes[c.iconSize as keyof typeof sizes] || sizes.md} mx-auto mb-4 opacity-70`} />
          </motion.div>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-2">{c.title}</h3>
          <p className="text-sm opacity-70 max-w-md mx-auto leading-relaxed">{c.description}</p>
        </Wrap>
      );
    }

    case "testimonial":
      return (
        <Wrap>
          <div className="space-y-8 max-w-lg mx-auto">
            {(c.testimonials || []).map((t: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-current/5 hover:bg-current/8 transition-colors">
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
          </div>
        </Wrap>
      );

    case "rsvp":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
            <Mail className="h-10 w-10 mx-auto mb-4 opacity-60" />
          </motion.div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">{c.rsvpTitle || "RSVP"}</h3>
          {c.rsvpSubtitle && <p className="text-sm opacity-70 mb-4">{c.rsvpSubtitle}</p>}
          <p className="text-sm opacity-50 bg-current/5 rounded-xl p-4 max-w-sm mx-auto">RSVP form appears with invitation codes.</p>
        </Wrap>
      );

    case "embed": {
      if (c.embedType === "youtube" && c.embedUrl) {
        const id = c.embedUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
        return <Wrap><div className="rounded-xl overflow-hidden shadow-xl" style={{ height: c.embedHeight || 315 }}><iframe src={`https://www.youtube.com/embed/${id}`} className="w-full h-full" allowFullScreen /></div></Wrap>;
      }
      if (c.embedType === "spotify" && c.embedUrl) {
        return <Wrap><iframe src={c.embedUrl.replace("open.spotify.com", "open.spotify.com/embed")} className="w-full rounded-xl" style={{ height: c.embedHeight || 80 }} allow="encrypted-media" /></Wrap>;
      }
      if (c.embedType === "vimeo" && c.embedUrl) {
        const vimeoId = c.embedUrl.match(/vimeo\.com\/(\d+)/)?.[1];
        return <Wrap><div className="rounded-xl overflow-hidden shadow-xl" style={{ height: c.embedHeight || 315 }}><iframe src={`https://player.vimeo.com/video/${vimeoId}`} className="w-full h-full" allowFullScreen /></div></Wrap>;
      }
      return <Wrap><p className="text-sm opacity-50">Embed: {c.embedUrl || "No URL set"}</p></Wrap>;
    }

    case "social_links": {
      const iconMap: Record<string, any> = { instagram: Instagram, facebook: Facebook, twitter: Twitter, tiktok: Globe, website: Globe, youtube: Play, spotify: Music, whatsapp: Phone, telegram: Globe, linkedin: Globe };
      return (
        <Wrap>
          {c.socialTitle && <h3 className="font-display text-lg font-bold mb-4">{c.socialTitle}</h3>}
          <div className="flex justify-center gap-3 flex-wrap">
            {(c.links || []).map((link: any, i: number) => {
              const Icon = iconMap[link.platform] || Globe;
              if (c.socialStyle === "buttons") {
                return <motion.a key={i} href={link.url} target="_blank" rel="noopener" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 rounded-full bg-current/10 text-sm font-medium hover:bg-current/20 transition inline-flex items-center gap-2 shadow-sm"><Icon className="h-4 w-4" /> {link.label || link.platform}</motion.a>;
              }
              if (c.socialStyle === "pills") {
                return <motion.a key={i} href={link.url} target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 rounded-full border border-current/20 text-xs font-medium hover:bg-current/10 transition inline-flex items-center gap-1.5"><Icon className="h-3 w-3" /> {link.label || link.platform}</motion.a>;
              }
              return <motion.a key={i} href={link.url} target="_blank" rel="noopener" whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-current/10 flex items-center justify-center hover:bg-current/20 transition shadow-sm"><Icon className="h-5 w-5" /></motion.a>;
            })}
          </div>
        </Wrap>
      );
    }

    case "guestbook":
      return (
        <Wrap>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">{c.guestbookTitle || "Guestbook"}</h3>
          <p className="text-sm opacity-70 mb-6">Messages from guests will appear here.</p>
          <div className="max-w-sm mx-auto p-4 rounded-xl bg-current/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-9 rounded-lg border border-current/20 px-3 flex items-center text-sm opacity-40">Leave a message...</div>
              <div className="w-9 h-9 rounded-lg bg-current/10 flex items-center justify-center"><Send className="h-4 w-4 opacity-40" /></div>
            </div>
          </div>
        </Wrap>
      );

    case "photo_collage":
      return (
        <Wrap>
          <div className={`grid ${c.layout === "mosaic" ? "grid-cols-3 auto-rows-[200px]" : `grid-cols-${c.columns || 3}`} gap-2`}>
            {(c.collageImages || []).map((img: any, i: number) => (
              <motion.img key={i} src={img.url} alt="" className={`w-full rounded-lg object-cover ${c.layout === "mosaic" && i % 3 === 0 ? "row-span-2" : ""} hover:scale-105 transition-transform duration-500`}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} loading="lazy" />
            ))}
          </div>
        </Wrap>
      );

    case "quote":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <QuoteIcon className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p className="italic text-xl md:text-2xl lg:text-3xl max-w-lg mx-auto leading-relaxed font-light">"{c.body}"</p>
            {c.author && <p className="text-sm opacity-60 mt-4 font-medium">— {c.author}</p>}
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
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-2xl opacity-30 tracking-[1em]">{separators[c.separatorStyle || "floral"]}</motion.div>
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
          <Music className="h-10 w-10 mx-auto mb-4 opacity-60" />
          <h3 className="font-display text-lg font-bold">{c.audioTitle || "Audio"}</h3>
          {c.audioArtist && <p className="text-sm opacity-60 mb-4">{c.audioArtist}</p>}
          {c.audioUrl && <audio src={c.audioUrl} controls autoPlay={c.audioAutoplay} className="w-full max-w-sm mx-auto" />}
        </Wrap>
      );

    case "music_player":
      return (
        <Wrap>
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
            className="flex items-center gap-4 max-w-sm mx-auto p-5 rounded-2xl bg-current/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-current/10 flex items-center justify-center">
              {c.musicCoverUrl ? <img src={c.musicCoverUrl} alt="" className="w-full h-full object-cover" loading="lazy" /> : <Disc3 className="h-10 w-10 opacity-40 animate-spin" style={{ animationDuration: "3s" }} />}
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
          <Camera className="h-10 w-10 mx-auto mb-4 opacity-60" />
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">{c.wallTitle || "Photo Wall"}</h3>
          <p className="text-sm opacity-70 mb-4">Guests can upload and share photos here.</p>
          <motion.div
            whileHover={{ scale: 1.02, borderColor: "currentColor" }}
            className="max-w-xs mx-auto p-6 rounded-xl border-2 border-dashed border-current/20 text-center cursor-pointer transition-colors"
          >
            <Camera className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm opacity-50">Tap to upload a photo</p>
          </motion.div>
        </Wrap>
      );

    case "seating_chart":
      return (
        <Wrap>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-8">{c.seatingTitle || "Seating Chart"}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            {(c.tables || []).map((table: any, i: number) => (
              <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, type: "spring" }}
                className="p-4 rounded-2xl bg-current/5 text-center hover:bg-current/10 transition-colors group">
                <div className="w-14 h-14 rounded-full bg-current/10 mx-auto mb-3 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">{i + 1}</div>
                <p className="font-semibold text-sm mb-2">{table.name}</p>
                <div className="text-xs opacity-60 space-y-0.5">{(table.seats || []).map((seat: string, j: number) => <p key={j}>{seat}</p>)}</div>
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "pricing_table":
      return (
        <Wrap>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-8">{c.pricingTitle || "Packages"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {(c.pricingItems || []).map((item: any, i: number) => (
              <motion.div key={i} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl text-center transition-all ${item.highlighted ? "bg-current/10 ring-2 ring-current/30 scale-105 shadow-xl" : "bg-current/5 hover:bg-current/10"}`}>
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
          </div>
        </Wrap>
      );

    case "weather_widget":
      return (
        <Wrap>
          <Cloud className="h-10 w-10 mx-auto mb-4 opacity-60" />
          <h3 className="font-display text-lg font-bold">Weather Forecast</h3>
          <p className="text-sm opacity-70 mt-1">{c.weatherLocation || "Location not set"}</p>
          {c.weatherDate && <p className="text-xs opacity-50 mt-1">{c.weatherDate}</p>}
        </Wrap>
      );

    case "qr_code":
      return (
        <Wrap>
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 12 }}
            className="mx-auto rounded-2xl bg-white p-6 inline-block shadow-lg">
            <QrCode className="opacity-30" style={{ width: c.qrSize || 200, height: c.qrSize || 200 }} />
          </motion.div>
          {c.qrLabel && <p className="text-sm mt-4 opacity-70 font-medium">{c.qrLabel}</p>}
        </Wrap>
      );

    case "contact_card":
      return (
        <Wrap>
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
            className="max-w-sm mx-auto p-8 rounded-2xl bg-current/5 text-center shadow-sm hover:shadow-md transition-shadow">
            {c.contactImageUrl ? <img src={c.contactImageUrl} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-current/10" loading="lazy" /> :
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-current/10 flex items-center justify-center text-3xl font-bold">{c.contactName?.charAt(0) || "?"}</div>}
            <h3 className="font-display text-xl font-bold">{c.contactName || "Contact"}</h3>
            {c.contactRole && <p className="text-sm opacity-60 mb-3">{c.contactRole}</p>}
            <div className="space-y-2 mt-4">
              {c.contactPhone && <a href={`tel:${c.contactPhone}`} className="flex items-center justify-center gap-2 text-sm hover:opacity-80 transition"><Phone className="h-4 w-4" />{c.contactPhone}</a>}
              {c.contactEmail && <a href={`mailto:${c.contactEmail}`} className="flex items-center justify-center gap-2 text-sm hover:opacity-80 transition"><Mail className="h-4 w-4" />{c.contactEmail}</a>}
            </div>
          </motion.div>
        </Wrap>
      );

    default:
      return null;
  }
}

// --- Sub-components ---

// Image with click-to-expand lightbox
function ImageWithLightbox({ src, alt, borderRadius }: { src: string; alt: string; borderRadius?: string }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <>
      <motion.img
        src={src}
        alt={alt}
        className="w-full rounded-xl object-cover cursor-pointer"
        style={{ borderRadius }}
        initial={{ scale: 1.05, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        loading="lazy"
        onClick={() => setExpanded(true)}
      />
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setExpanded(false)}
          >
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition text-white">
              <X className="h-5 w-5" />
            </button>
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
      <div className="flex justify-center gap-4">
        {units.map(u => (
          <div key={u.label} className="text-center">
            <motion.div key={u.value} initial={{ rotateX: 90, scale: 0.8 }} animate={{ rotateX: 0, scale: 1 }} transition={{ duration: 0.4, type: "spring" }}
              className={`${style === "circle" ? "w-20 h-20 rounded-full" : "w-18 h-22 rounded-xl"} ${themeClass} flex items-center justify-center text-3xl md:text-4xl font-display font-bold`}>
              {String(u.value).padStart(2, "0")}
            </motion.div>
            <div className="text-xs opacity-60 mt-2 font-medium">{u.label}</div>
          </div>
        ))}
      </div>
    );
  }

  if (style === "minimal") {
    return (
      <div className="flex justify-center gap-2 text-2xl md:text-3xl font-mono font-light">
        {units.map((u, i) => (
          <span key={u.label}>
            {i > 0 && <span className="opacity-30 mx-1">:</span>}
            <motion.span key={u.value} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-bold">{String(u.value).padStart(2, "0")}</motion.span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-6 md:gap-8">
      {units.map(u => (
        <div key={u.label} className="text-center">
          <motion.div key={u.value} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 10 }}
            className="text-4xl md:text-6xl font-display font-bold">
            {String(u.value).padStart(2, "0")}
          </motion.div>
          <div className="text-xs opacity-60 mt-2 font-medium uppercase tracking-wider">{u.label}</div>
        </div>
      ))}
    </div>
  );
}

function FaqItem({ question, answer, style, index = 0 }: { question: string; answer: string; style?: string; index?: number }) {
  const [open, setOpen] = useState(false);
  const cls = style === "filled" ? "bg-current/5 rounded-xl" : style === "simple" ? "" : "border border-current/10 rounded-xl";
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}
      className={`overflow-hidden ${cls}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-current/5 transition-colors rounded-xl">
        <span className="font-semibold text-sm pr-4">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-4 pb-4 text-sm opacity-70 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Gallery carousel with improved navigation
function GalleryCarousel({ images, showCaptions }: { images: { url: string; caption?: string }[]; showCaptions?: boolean }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  if (!images.length) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIdx}
            src={images[currentIdx].url}
            alt={images[currentIdx].caption || ""}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
        </AnimatePresence>
      </div>
      {showCaptions && images[currentIdx].caption && (
        <p className="text-sm opacity-70 mt-2 text-center italic">{images[currentIdx].caption}</p>
      )}
      {images.length > 1 && (
        <>
          <button onClick={() => setCurrentIdx((currentIdx - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition backdrop-blur-sm">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrentIdx((currentIdx + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition backdrop-blur-sm">
            <ChevronRight className="h-4 w-4" />
          </button>
          {/* Enhanced dots with counter */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {images.length <= 8 ? images.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)}
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

// Entourage carousel
function EntourageCarousel({ people }: { people: { name: string; role?: string; imageUrl?: string; message?: string }[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  if (!people.length) return null;
  const p = people[currentIdx];

  return (
    <div className="relative max-w-sm mx-auto">
      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
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
          <button onClick={() => setCurrentIdx((currentIdx - 1 + people.length) % people.length)}
            className="w-8 h-8 rounded-full bg-current/10 flex items-center justify-center hover:bg-current/20 transition">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm opacity-50 flex items-center">{currentIdx + 1}/{people.length}</span>
          <button onClick={() => setCurrentIdx((currentIdx + 1) % people.length)}
            className="w-8 h-8 rounded-full bg-current/10 flex items-center justify-center hover:bg-current/20 transition">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
