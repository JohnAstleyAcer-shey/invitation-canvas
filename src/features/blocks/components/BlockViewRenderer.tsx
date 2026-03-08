import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ExternalLink, Play, ChevronDown, Clock, Users, Gift, HelpCircle, Shirt, Mail, Quote as QuoteIcon, Instagram, Facebook, Twitter, Globe, Music, Disc3, Phone, Camera, Star, Heart, Calendar, Sparkles, DollarSign, QrCode, Cloud, Navigation } from "lucide-react";
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
      {blocks.map(block => <BlockView key={block.id} block={block} />)}
    </div>
  );
}

function BlockView({ block }: { block: InvitationBlock }) {
  const c = block.content as any;
  const s = block.style as any;
  const anim = animationVariants[s.animation] || {};

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
    <motion.div {...anim} transition={{ duration: 0.6, ease: "easeOut" }} viewport={{ once: true }} whileInView={anim.animate} style={wrapStyle} className={className}>
      {s.backgroundImage && !s.gradient && <img src={s.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      {s.backgroundOverlay && <div className="absolute inset-0" style={{ backgroundColor: s.backgroundOverlay }} />}
      <div className={`relative z-10 w-full max-w-2xl mx-auto ${glassClass}`}>{children}</div>
    </motion.div>
  );

  switch (block.block_type) {
    case "heading": {
      const Tag = `h${c.level || 2}` as any;
      const sizes: Record<number, string> = { 1: "text-5xl md:text-6xl", 2: "text-4xl md:text-5xl", 3: "text-3xl", 4: "text-2xl" };
      return <Wrap><Tag className={`font-display font-bold ${sizes[c.level || 2]}`}>{c.text}</Tag></Wrap>;
    }

    case "text":
      return <Wrap><p className="whitespace-pre-wrap leading-relaxed">{c.body}</p></Wrap>;

    case "image":
      return (
        <Wrap>
          {c.imageUrl && <img src={c.imageUrl} alt={c.alt || ""} className="w-full rounded-xl object-cover" style={{ borderRadius: s.borderRadius }} />}
          {c.caption && <p className="text-sm opacity-70 mt-2">{c.caption}</p>}
        </Wrap>
      );

    case "spacer":
      return <div style={{ height: c.height || 48 }} />;

    case "divider":
      return <Wrap><hr className="border-t opacity-20" /></Wrap>;

    case "button":
      return (
        <Wrap>
          <a href={c.url || "#"} target="_blank" rel="noopener noreferrer"
            className={`inline-block rounded-full font-medium transition-all hover:scale-105 ${
              c.buttonSize === "lg" ? "px-10 py-4 text-lg" : c.buttonSize === "sm" ? "px-5 py-2 text-sm" : "px-8 py-3"
            } ${
              c.variant === "outline" ? "border-2 border-current hover:bg-current/10" :
              c.variant === "ghost" ? "hover:bg-current/10" :
              c.variant === "gradient" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg" :
              "bg-current text-white"
            }`}
          >
            {c.label || "Button"}
          </a>
        </Wrap>
      );

    case "two_column":
      return (
        <Wrap>
          <div className={`grid gap-6 ${
            c.columnRatio === "2:1" ? "grid-cols-[2fr_1fr]" : c.columnRatio === "1:2" ? "grid-cols-[1fr_2fr]" : "grid-cols-2"
          }`}>
            {(c.columnContent || []).map((col: string, i: number) => (
              <div key={i} className="whitespace-pre-wrap text-left">{col}</div>
            ))}
          </div>
        </Wrap>
      );

    case "three_column":
      return (
        <Wrap>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(c.columnContent || []).map((col: string, i: number) => (
              <div key={i} className="whitespace-pre-wrap text-left">{col}</div>
            ))}
          </div>
        </Wrap>
      );

    case "cover_hero":
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          style={{ ...wrapStyle, backgroundImage: c.imageUrl ? `url(${c.imageUrl})` : s.gradient || undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
          {c.overlay && <div className="absolute inset-0 bg-black/40" />}
          <div className="relative z-10 text-white text-center px-6">
            <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl font-bold mb-4">{c.overlayText || "You're Invited"}</motion.h1>
            {c.overlaySubtext && (
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl opacity-80">{c.overlaySubtext}</motion.p>
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
          {c.heroOverlay && <div className="absolute inset-0 bg-black/40 z-[1]" />}
          <div className="relative z-10 text-white text-center px-6">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">{c.heroOverlayText || "Video Hero"}</h1>
            {c.heroOverlaySubtext && <p className="text-xl opacity-80">{c.heroOverlaySubtext}</p>}
          </div>
        </div>
      );
    }

    case "message_card":
      return <Wrap><p className="whitespace-pre-wrap leading-relaxed italic text-lg">{c.body}</p></Wrap>;

    case "countdown":
    case "countdown_flip":
      return <Wrap><CountdownTimer targetDate={c.targetDate} show={{ days: c.showDays, hours: c.showHours, minutes: c.showMinutes, seconds: c.showSeconds }} style={c.countdownStyle || (block.block_type === "countdown_flip" ? "flip" : "simple")} flipTheme={c.flipStyle} /></Wrap>;

    case "location":
      return (
        <Wrap>
          <MapPin className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-1">{c.venueName || "Venue"}</h3>
          {c.venueAddress && <p className="opacity-70 mb-2">{c.venueAddress}</p>}
          {c.venuePhone && <p className="text-sm opacity-60 mb-2"><Phone className="h-3 w-3 inline mr-1" />{c.venuePhone}</p>}
          <div className="flex justify-center gap-3 mt-3">
            {c.mapUrl && <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium underline"><ExternalLink className="h-4 w-4" /> View Map</a>}
            {c.showDirections && c.venueAddress && <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(c.venueAddress)}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-medium underline"><Navigation className="h-4 w-4" /> Directions</a>}
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
          <Clock className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-6">Schedule</h3>
          <div className={`space-y-4 max-w-md mx-auto ${c.timelineLayout === "alternating" ? "relative" : ""}`}>
            {(c.events || []).map((ev: any, i: number) => (
              <motion.div key={i} initial={{ x: c.timelineLayout === "alternating" && i % 2 ? 20 : -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 ${c.timelineLayout === "alternating" && i % 2 ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="w-20 shrink-0 font-semibold text-sm">{ev.time}</div>
                <div className="w-3 h-3 rounded-full bg-current opacity-30 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">{ev.title}</p>
                  {ev.description && <p className="text-sm opacity-70">{ev.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "entourage":
      return (
        <Wrap>
          <Users className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-6">{c.entourageTitle || "Special People"}</h3>
          <div className={c.entourageLayout === "list" ? "space-y-3 max-w-md mx-auto" : "grid grid-cols-2 sm:grid-cols-3 gap-4"}>
            {(c.people || []).map((p: any, i: number) => (
              <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={c.entourageLayout === "list" ? "flex items-center gap-3 text-left" : "text-center"}>
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className={`${c.entourageLayout === "list" ? "w-10 h-10" : "w-16 h-16 mx-auto mb-2"} rounded-full object-cover`} /> :
                  <div className={`${c.entourageLayout === "list" ? "w-10 h-10" : "w-16 h-16 mx-auto mb-2"} rounded-full bg-current/10 flex items-center justify-center text-lg font-bold`}>{p.name?.charAt(0)}</div>}
                <div>
                  <p className="font-semibold text-sm">{p.name}</p>
                  {p.role && <p className="text-xs opacity-60">{p.role}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "gallery":
      return (
        <Wrap>
          <div className={`grid grid-cols-${c.columns || 3} gap-2`}>
            {(c.images || []).map((img: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <img src={img.url} alt={img.caption || ""} className="w-full aspect-square object-cover rounded-lg" />
                {c.showCaptions && img.caption && <p className="text-xs opacity-60 mt-1 text-center">{img.caption}</p>}
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "video": {
      if (c.videoUrl?.includes("youtube")) {
        const id = c.videoUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
        return <Wrap><div className="aspect-video rounded-xl overflow-hidden"><iframe src={`https://www.youtube.com/embed/${id}${c.autoplay ? "?autoplay=1" : ""}`} className="w-full h-full" allowFullScreen allow="autoplay" /></div></Wrap>;
      }
      return <Wrap><video src={c.videoUrl} controls autoPlay={c.autoplay} muted={c.muted} loop={c.loop} poster={c.posterUrl} className="w-full rounded-xl" /></Wrap>;
    }

    case "dress_code":
      return (
        <Wrap>
          <Shirt className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-4">Dress Code</h3>
          {c.dressCodeNote && <p className="text-sm opacity-70 mb-4">{c.dressCodeNote}</p>}
          <div className="flex justify-center gap-4 flex-wrap">
            {(c.colors || []).map((col: any, i: number) => (
              <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring" }} className="text-center">
                <div className="w-14 h-14 rounded-full mx-auto border-2 border-white/20 shadow-md" style={{ backgroundColor: col.hex }} />
                {col.name && <p className="text-xs mt-2">{col.name}</p>}
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "gift_registry":
      return (
        <Wrap>
          <Gift className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-4">{c.registryTitle || "Gift Registry"}</h3>
          <div className="space-y-3 max-w-md mx-auto">
            {(c.items || []).map((item: any, i: number) => (
              <motion.div key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-current/5 text-left">
                <div className="flex justify-between items-start">
                  <p className="font-semibold">{item.name}</p>
                  {item.price && <span className="text-sm font-bold opacity-70">{item.price}</span>}
                </div>
                {item.description && <p className="text-sm opacity-70 mt-1">{item.description}</p>}
                {item.url && <a href={item.url} target="_blank" rel="noopener" className="text-xs underline mt-2 inline-block">{item.linkLabel || "View"}</a>}
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "faq":
      return (
        <Wrap>
          <HelpCircle className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-4">{c.faqTitle || "FAQ"}</h3>
          <div className="space-y-2 max-w-lg mx-auto text-left">
            {(c.faqs || []).map((faq: any, i: number) => <FaqItem key={i} question={faq.question} answer={faq.answer} />)}
          </div>
        </Wrap>
      );

    case "accordion":
      return (
        <Wrap>
          <div className="space-y-2 max-w-lg mx-auto text-left">
            {(c.accordionItems || []).map((item: any, i: number) => (
              <FaqItem key={i} question={item.title} answer={item.content} style={c.accordionStyle} />
            ))}
          </div>
        </Wrap>
      );

    case "icon_text": {
      const iconMap: Record<string, any> = { Heart, Star, Gift, Music, Camera, MapPin, Clock, Users, Mail, Phone, Calendar, Sparkles };
      const Icon = iconMap[c.iconName] || Star;
      const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-14 w-14" };
      return (
        <Wrap>
          <Icon className={`${sizes[c.iconSize as keyof typeof sizes] || sizes.md} mx-auto mb-3 opacity-70`} />
          <h3 className="font-display text-xl font-bold mb-2">{c.title}</h3>
          <p className="text-sm opacity-70 max-w-md mx-auto">{c.description}</p>
        </Wrap>
      );
    }

    case "testimonial":
      return (
        <Wrap>
          <div className="space-y-6 max-w-lg mx-auto">
            {(c.testimonials || []).map((t: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <QuoteIcon className="h-6 w-6 mx-auto mb-2 opacity-30" />
                <p className="italic text-lg leading-relaxed mb-3">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.author}</p>
                  {t.role && <p className="text-xs opacity-60">{t.role}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "rsvp":
      return (
        <Wrap>
          <Mail className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-2">{c.rsvpTitle || "RSVP"}</h3>
          {c.rsvpSubtitle && <p className="text-sm opacity-70 mb-4">{c.rsvpSubtitle}</p>}
          <p className="text-sm opacity-50">RSVP form appears with invitation codes.</p>
        </Wrap>
      );

    case "embed": {
      if (c.embedType === "youtube" && c.embedUrl) {
        const id = c.embedUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
        return <Wrap><div className="rounded-xl overflow-hidden" style={{ height: c.embedHeight || 315 }}><iframe src={`https://www.youtube.com/embed/${id}`} className="w-full h-full" allowFullScreen /></div></Wrap>;
      }
      if (c.embedType === "spotify" && c.embedUrl) {
        return <Wrap><iframe src={c.embedUrl.replace("open.spotify.com", "open.spotify.com/embed")} className="w-full rounded-xl" style={{ height: c.embedHeight || 80 }} allow="encrypted-media" /></Wrap>;
      }
      if (c.embedType === "vimeo" && c.embedUrl) {
        const vimeoId = c.embedUrl.match(/vimeo\.com\/(\d+)/)?.[1];
        return <Wrap><div className="rounded-xl overflow-hidden" style={{ height: c.embedHeight || 315 }}><iframe src={`https://player.vimeo.com/video/${vimeoId}`} className="w-full h-full" allowFullScreen /></div></Wrap>;
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
                return <a key={i} href={link.url} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-current/10 text-sm font-medium hover:bg-current/20 transition inline-flex items-center gap-2"><Icon className="h-4 w-4" /> {link.label || link.platform}</a>;
              }
              if (c.socialStyle === "pills") {
                return <a key={i} href={link.url} target="_blank" rel="noopener" className="px-3 py-1.5 rounded-full border border-current/20 text-xs font-medium hover:bg-current/10 transition inline-flex items-center gap-1.5"><Icon className="h-3 w-3" /> {link.label || link.platform}</a>;
              }
              return <a key={i} href={link.url} target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-current/10 flex items-center justify-center hover:bg-current/20 transition"><Icon className="h-5 w-5" /></a>;
            })}
          </div>
        </Wrap>
      );
    }

    case "guestbook":
      return (
        <Wrap>
          <h3 className="font-display text-2xl font-bold mb-4">{c.guestbookTitle || "Guestbook"}</h3>
          <p className="text-sm opacity-70">Messages from guests will appear here.</p>
        </Wrap>
      );

    case "photo_collage":
      return (
        <Wrap>
          <div className={`grid ${c.layout === "mosaic" ? "grid-cols-3 auto-rows-[200px]" : `grid-cols-${c.columns || 3}`} gap-2`}>
            {(c.collageImages || []).map((img: any, i: number) => (
              <motion.img key={i} src={img.url} alt="" className={`w-full rounded-lg object-cover ${c.layout === "mosaic" && i % 3 === 0 ? "row-span-2" : ""}`}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} />
            ))}
          </div>
        </Wrap>
      );

    case "quote":
      return (
        <Wrap>
          <QuoteIcon className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="italic text-xl md:text-2xl max-w-lg mx-auto leading-relaxed">"{c.body}"</p>
          {c.author && <p className="text-sm opacity-60 mt-3">— {c.author}</p>}
        </Wrap>
      );

    case "separator_fancy": {
      const separators: Record<string, string> = {
        dots: "• • •", stars: "✦ ✦ ✦", hearts: "♥ ♥ ♥",
        floral: "❀ ❀ ❀", wave: "〰〰〰", diamond: "◆ ◆ ◆",
      };
      return <Wrap><div className="text-2xl opacity-30 tracking-[1em]">{separators[c.separatorStyle || "floral"]}</div></Wrap>;
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
          <Music className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-lg font-bold">{c.audioTitle || "Audio"}</h3>
          {c.audioArtist && <p className="text-sm opacity-60 mb-3">{c.audioArtist}</p>}
          {c.audioUrl && <audio src={c.audioUrl} controls autoPlay={c.audioAutoplay} className="w-full max-w-sm mx-auto" />}
        </Wrap>
      );

    case "music_player":
      return (
        <Wrap>
          <div className="flex items-center gap-4 max-w-sm mx-auto p-4 rounded-2xl bg-current/5">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-current/10 flex items-center justify-center">
              {c.musicCoverUrl ? <img src={c.musicCoverUrl} alt="" className="w-full h-full object-cover" /> : <Disc3 className="h-8 w-8 opacity-40 animate-spin" style={{ animationDuration: "3s" }} />}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-semibold truncate">{c.musicTitle || "Song"}</p>
              <p className="text-sm opacity-60 truncate">{c.musicArtist || "Artist"}</p>
              {c.musicUrl && <audio src={c.musicUrl} controls autoPlay={c.musicAutoplay} className="w-full mt-2" style={{ height: 32 }} />}
            </div>
          </div>
        </Wrap>
      );

    case "photo_upload_wall":
      return (
        <Wrap>
          <Camera className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-4">{c.wallTitle || "Photo Wall"}</h3>
          <p className="text-sm opacity-70">Guests can upload and share photos here.</p>
        </Wrap>
      );

    case "seating_chart":
      return (
        <Wrap>
          <h3 className="font-display text-2xl font-bold mb-6">{c.seatingTitle || "Seating Chart"}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            {(c.tables || []).map((table: any, i: number) => (
              <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                className="p-3 rounded-xl bg-current/5 text-center">
                <div className="w-12 h-12 rounded-full bg-current/10 mx-auto mb-2 flex items-center justify-center font-bold">{i + 1}</div>
                <p className="font-semibold text-sm mb-1">{table.name}</p>
                <div className="text-xs opacity-60 space-y-0.5">{(table.seats || []).map((s: string, j: number) => <p key={j}>{s}</p>)}</div>
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "pricing_table":
      return (
        <Wrap>
          <h3 className="font-display text-2xl font-bold mb-6">{c.pricingTitle || "Packages"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {(c.pricingItems || []).map((item: any, i: number) => (
              <motion.div key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                className={`p-5 rounded-2xl text-center ${item.highlighted ? "bg-current/10 ring-2 ring-current/30 scale-105" : "bg-current/5"}`}>
                <p className="font-bold text-lg">{item.name}</p>
                <p className="text-3xl font-display font-bold my-3">{item.price}</p>
                {item.description && <p className="text-sm opacity-70">{item.description}</p>}
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "weather_widget":
      return (
        <Wrap>
          <Cloud className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-lg font-bold">Weather Forecast</h3>
          <p className="text-sm opacity-70 mt-1">{c.weatherLocation || "Location not set"}</p>
          {c.weatherDate && <p className="text-xs opacity-50 mt-1">{c.weatherDate}</p>}
        </Wrap>
      );

    case "qr_code":
      return (
        <Wrap>
          <div className="mx-auto rounded-xl bg-white p-4 inline-block">
            <QrCode className="opacity-30" style={{ width: c.qrSize || 200, height: c.qrSize || 200 }} />
          </div>
          {c.qrLabel && <p className="text-sm mt-3 opacity-70">{c.qrLabel}</p>}
        </Wrap>
      );

    case "contact_card":
      return (
        <Wrap>
          <div className="max-w-sm mx-auto p-6 rounded-2xl bg-current/5 text-center">
            {c.contactImageUrl ? <img src={c.contactImageUrl} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" /> :
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-current/10 flex items-center justify-center text-2xl font-bold">{c.contactName?.charAt(0) || "?"}</div>}
            <h3 className="font-display text-xl font-bold">{c.contactName || "Contact"}</h3>
            {c.contactRole && <p className="text-sm opacity-60 mb-2">{c.contactRole}</p>}
            <div className="space-y-1 mt-3">
              {c.contactPhone && <p className="text-sm"><Phone className="h-3 w-3 inline mr-1" />{c.contactPhone}</p>}
              {c.contactEmail && <p className="text-sm"><Mail className="h-3 w-3 inline mr-1" />{c.contactEmail}</p>}
            </div>
          </div>
        </Wrap>
      );

    default:
      return null;
  }
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
    const themeClass = flipTheme === "light" ? "bg-white text-black shadow-md" : flipTheme === "glass" ? "bg-white/10 backdrop-blur-md text-white" : "bg-black text-white";
    return (
      <div className="flex justify-center gap-4">
        {units.map(u => (
          <div key={u.label} className="text-center">
            <motion.div key={u.value} initial={{ rotateX: 90 }} animate={{ rotateX: 0 }} transition={{ duration: 0.3 }}
              className={`${style === "circle" ? "w-20 h-20 rounded-full" : "w-16 h-20 rounded-xl"} ${themeClass} flex items-center justify-center text-3xl font-display font-bold`}>
              {String(u.value).padStart(2, "0")}
            </motion.div>
            <div className="text-xs opacity-60 mt-2">{u.label}</div>
          </div>
        ))}
      </div>
    );
  }

  if (style === "minimal") {
    return (
      <div className="flex justify-center gap-2 text-lg font-mono">
        {units.map((u, i) => (
          <span key={u.label}>
            {i > 0 && <span className="opacity-30 mx-1">:</span>}
            <span className="font-bold">{String(u.value).padStart(2, "0")}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-6">
      {units.map(u => (
        <div key={u.label} className="text-center">
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-4xl md:text-5xl font-display font-bold">
            {String(u.value).padStart(2, "0")}
          </motion.div>
          <div className="text-xs opacity-60 mt-1">{u.label}</div>
        </div>
      ))}
    </div>
  );
}

function FaqItem({ question, answer, style }: { question: string; answer: string; style?: string }) {
  const [open, setOpen] = useState(false);
  const cls = style === "filled" ? "bg-current/5 rounded-xl" : style === "simple" ? "" : "border border-current/10 rounded-xl";
  return (
    <div className={`overflow-hidden ${cls}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left">
        <span className="font-semibold text-sm">{question}</span>
        <ChevronDown className={`h-4 w-4 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div className="px-4 pb-4 text-sm opacity-70">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
