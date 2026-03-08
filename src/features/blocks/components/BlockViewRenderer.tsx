import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, Play, ChevronDown, Clock, Users, Gift, HelpCircle, Shirt, Mail, Quote as QuoteIcon, Instagram, Facebook, Twitter, Globe } from "lucide-react";
import type { InvitationBlock } from "../types";

const animationVariants: Record<string, any> = {
  "fade-up": { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
  "fade-in": { initial: { opacity: 0 }, animate: { opacity: 1 } },
  "slide-left": { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
  "slide-right": { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
  "zoom": { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
};

export function BlockViewRenderer({ blocks }: { blocks: InvitationBlock[] }) {
  return (
    <div className="w-full">
      {blocks.map(block => (
        <BlockView key={block.id} block={block} />
      ))}
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
    minHeight: s.fullHeight ? "100vh" : undefined,
    display: s.fullHeight ? "flex" : undefined,
    alignItems: s.fullHeight ? "center" : undefined,
    justifyContent: s.fullHeight ? "center" : undefined,
    position: "relative" as const,
    overflow: "hidden" as const,
  };

  const glassClass = s.glassmorphism ? "backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8" : "";

  const Wrap = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      {...anim}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={wrapStyle}
    >
      {s.backgroundImage && <img src={s.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      {s.backgroundOverlay && <div className="absolute inset-0" style={{ backgroundColor: s.backgroundOverlay }} />}
      <div className={`relative z-10 w-full max-w-2xl mx-auto ${glassClass}`}>
        {children}
      </div>
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
            className={`inline-block px-8 py-3 rounded-full font-medium transition-all ${
              c.variant === "outline" ? "border-2 border-current hover:bg-current/10" :
              c.variant === "ghost" ? "hover:bg-current/10" :
              "bg-current text-white"
            }`}
          >
            {c.label || "Button"}
          </a>
        </Wrap>
      );

    case "cover_hero":
      return (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          style={{ ...wrapStyle, backgroundImage: c.imageUrl ? `url(${c.imageUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          {c.overlay && <div className="absolute inset-0 bg-black/40" />}
          <div className="relative z-10 text-white text-center px-6">
            <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl font-bold mb-4">
              {c.overlayText || "You're Invited"}
            </motion.h1>
            {c.overlaySubtext && (
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl md:text-2xl opacity-80">
                {c.overlaySubtext}
              </motion.p>
            )}
          </div>
        </motion.div>
      );

    case "message_card":
      return (
        <Wrap>
          <p className="whitespace-pre-wrap leading-relaxed italic text-lg">{c.body}</p>
        </Wrap>
      );

    case "countdown":
      return (
        <Wrap>
          <CountdownTimer targetDate={c.targetDate} show={{ days: c.showDays, hours: c.showHours, minutes: c.showMinutes, seconds: c.showSeconds }} />
        </Wrap>
      );

    case "location":
      return (
        <Wrap>
          <MapPin className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-1">{c.venueName || "Venue"}</h3>
          {c.venueAddress && <p className="opacity-70 mb-3">{c.venueAddress}</p>}
          {c.mapUrl && (
            <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium underline">
              <ExternalLink className="h-4 w-4" /> Open in Maps
            </a>
          )}
        </Wrap>
      );

    case "timeline":
      return (
        <Wrap>
          <Clock className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-6">Schedule</h3>
          <div className="space-y-4 max-w-md mx-auto">
            {(c.events || []).map((ev: any, i: number) => (
              <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 text-left">
                <div className="w-20 shrink-0 text-right font-semibold text-sm">{ev.time}</div>
                <div className="w-px h-full bg-current opacity-20 shrink-0" />
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(c.people || []).map((p: any, i: number) => (
              <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="text-center">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 bg-current/10 flex items-center justify-center text-lg font-bold">
                    {p.name?.charAt(0)}
                  </div>
                )}
                <p className="font-semibold text-sm">{p.name}</p>
                {p.role && <p className="text-xs opacity-60">{p.role}</p>}
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
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <img src={img.url} alt={img.caption || ""} className="w-full aspect-square object-cover rounded-lg" />
              </motion.div>
            ))}
          </div>
        </Wrap>
      );

    case "video":
      if (c.videoUrl?.includes("youtube")) {
        const id = c.videoUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
        return (
          <Wrap>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe src={`https://www.youtube.com/embed/${id}${c.autoplay ? "?autoplay=1" : ""}`} className="w-full h-full" allowFullScreen allow="autoplay" />
            </div>
          </Wrap>
        );
      }
      return <Wrap><video src={c.videoUrl} controls autoPlay={c.autoplay} className="w-full rounded-xl" /></Wrap>;

    case "dress_code":
      return (
        <Wrap>
          <Shirt className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-4">Dress Code</h3>
          {c.dressCodeNote && <p className="text-sm opacity-70 mb-4">{c.dressCodeNote}</p>}
          <div className="flex justify-center gap-4 flex-wrap">
            {(c.colors || []).map((col: any, i: number) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto border-2 border-white/20" style={{ backgroundColor: col.hex }} />
                {col.name && <p className="text-xs mt-1">{col.name}</p>}
              </div>
            ))}
          </div>
        </Wrap>
      );

    case "gift_registry":
      return (
        <Wrap>
          <Gift className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-4">Gift Registry</h3>
          <div className="space-y-3 max-w-md mx-auto">
            {(c.items || []).map((item: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-current/5 text-left">
                <p className="font-semibold text-sm">{item.name}</p>
                {item.description && <p className="text-xs opacity-70 mt-1">{item.description}</p>}
                {item.url && <a href={item.url} target="_blank" rel="noopener" className="text-xs underline mt-1 inline-block">{item.linkLabel || "View"}</a>}
              </div>
            ))}
          </div>
        </Wrap>
      );

    case "faq":
      return (
        <Wrap>
          <HelpCircle className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-4">FAQ</h3>
          <div className="space-y-2 max-w-lg mx-auto text-left">
            {(c.faqs || []).map((faq: any, i: number) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Wrap>
      );

    case "rsvp":
      return (
        <Wrap>
          <Mail className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-2xl font-bold mb-4">RSVP</h3>
          <p className="text-sm opacity-70">RSVP form will be shown to guests with invitation codes.</p>
        </Wrap>
      );

    case "embed": {
      if (c.embedType === "youtube" && c.embedUrl) {
        const id = c.embedUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
        return <Wrap><div className="aspect-video rounded-xl overflow-hidden"><iframe src={`https://www.youtube.com/embed/${id}`} className="w-full h-full" allowFullScreen /></div></Wrap>;
      }
      if (c.embedType === "spotify" && c.embedUrl) {
        return <Wrap><iframe src={c.embedUrl.replace("open.spotify.com", "open.spotify.com/embed")} className="w-full h-20 rounded-xl" allow="encrypted-media" /></Wrap>;
      }
      return <Wrap><p className="text-sm opacity-50">Embed: {c.embedUrl || "No URL set"}</p></Wrap>;
    }

    case "social_links": {
      const iconMap: Record<string, any> = { instagram: Instagram, facebook: Facebook, twitter: Twitter, tiktok: Globe, website: Globe };
      return (
        <Wrap>
          <div className="flex justify-center gap-4">
            {(c.links || []).map((link: any, i: number) => {
              const Icon = iconMap[link.platform] || Globe;
              return (
                <a key={i} href={link.url} target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-current/10 flex items-center justify-center hover:bg-current/20 transition">
                  <Icon className="h-5 w-5" />
                </a>
              );
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
          <div className={`grid ${c.layout === "masonry" ? "columns-2 gap-2" : `grid-cols-${c.columns || 3} gap-2`}`}>
            {(c.collageImages || []).map((img: any, i: number) => (
              <img key={i} src={img.url} alt="" className="w-full rounded-lg object-cover" />
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

    default:
      return null;
  }
}

function CountdownTimer({ targetDate, show }: { targetDate?: string; show: Record<string, boolean> }) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const update = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
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

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-current/10 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left">
        <span className="font-semibold text-sm">{question}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 text-sm opacity-70">{answer}</div>}
    </div>
  );
}
