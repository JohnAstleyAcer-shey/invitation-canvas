import { motion } from "framer-motion";
import { MapPin, Clock, Gift, HelpCircle, ExternalLink, Play, Quote as QuoteIcon, Users, Shirt, Mail } from "lucide-react";
import type { InvitationBlock } from "../types";

export function BlockPreview({ block }: { block: InvitationBlock }) {
  const { content, style, block_type } = block;
  const c = content as any;
  const s = style as any;

  const wrapStyle: React.CSSProperties = {
    backgroundColor: s.backgroundColor || undefined,
    color: s.textColor || undefined,
    textAlign: s.textAlign || "center",
    padding: s.padding || "1rem",
    fontFamily: s.fontFamily || undefined,
    backgroundImage: s.backgroundImage ? `url(${s.backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: s.fullHeight ? "400px" : undefined,
    position: "relative",
  };

  const glassClass = s.glassmorphism ? "backdrop-blur-md bg-white/10 rounded-xl border border-white/20" : "";

  switch (block_type) {
    case "heading":
      const Tag = `h${c.level || 2}` as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = { 1: "text-4xl", 2: "text-3xl", 3: "text-2xl", 4: "text-xl" };
      return (
        <div style={wrapStyle}>
          <Tag className={`font-display font-bold ${sizes[c.level || 2]}`}>{c.text || "Heading"}</Tag>
        </div>
      );

    case "text":
      return (
        <div style={wrapStyle}>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{c.body || "Text block"}</p>
        </div>
      );

    case "image":
      return (
        <div style={wrapStyle}>
          {c.imageUrl ? (
            <img src={c.imageUrl} alt={c.alt || ""} className="w-full rounded-lg object-cover max-h-64" />
          ) : (
            <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              No image selected
            </div>
          )}
          {c.caption && <p className="text-xs text-muted-foreground mt-2">{c.caption}</p>}
        </div>
      );

    case "spacer":
      return <div style={{ height: c.height || 48 }} className="bg-muted/20 border border-dashed border-border" />;

    case "divider":
      return (
        <div style={wrapStyle}>
          <hr className="border-t border-current opacity-20" />
        </div>
      );

    case "button":
      return (
        <div style={wrapStyle}>
          <span className={`inline-block px-6 py-2.5 rounded-full text-sm font-medium ${
            c.variant === "outline" ? "border border-current" :
            c.variant === "ghost" ? "hover:bg-black/5" :
            "bg-primary text-primary-foreground"
          }`}>
            {c.label || "Button"}
          </span>
        </div>
      );

    case "cover_hero":
      return (
        <div style={{ ...wrapStyle, minHeight: "300px" }} className="flex items-center justify-center relative overflow-hidden">
          {c.imageUrl && <img src={c.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          {c.overlay && <div className="absolute inset-0 bg-black/40" />}
          <div className="relative z-10 text-white text-center">
            <h1 className="font-display text-4xl font-bold mb-2">{c.overlayText || "You're Invited"}</h1>
            {c.overlaySubtext && <p className="text-lg opacity-80">{c.overlaySubtext}</p>}
          </div>
        </div>
      );

    case "message_card":
      return (
        <div style={wrapStyle}>
          <div className={`max-w-md mx-auto p-6 rounded-xl ${glassClass || "bg-accent/30"}`}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed italic">{c.body || "Your message here..."}</p>
          </div>
        </div>
      );

    case "countdown":
      return (
        <div style={wrapStyle}>
          <p className="text-xs text-muted-foreground mb-3">Countdown to event</p>
          <div className="flex justify-center gap-4">
            {["Days", "Hours", "Mins", "Secs"].map(u => (
              <div key={u} className="text-center">
                <div className="text-2xl font-bold font-display">00</div>
                <div className="text-[10px] text-muted-foreground">{u}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "location":
      return (
        <div style={wrapStyle}>
          <MapPin className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">{c.venueName || "Venue Name"}</h3>
          <p className="text-xs text-muted-foreground mt-1">{c.venueAddress || "Address"}</p>
          {c.mapUrl && <span className="text-xs text-primary mt-2 inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" /> View Map</span>}
        </div>
      );

    case "timeline":
      return (
        <div style={wrapStyle}>
          <Clock className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold mb-3">Timeline</h3>
          {(c.events?.length || 0) > 0 ? (
            <div className="space-y-2 text-left max-w-xs mx-auto">
              {c.events.slice(0, 4).map((ev: any, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="font-semibold shrink-0 w-16">{ev.time}</span>
                  <span>{ev.title}</span>
                </div>
              ))}
              {c.events.length > 4 && <p className="text-[10px] text-muted-foreground">+{c.events.length - 4} more</p>}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No events added yet</p>
          )}
        </div>
      );

    case "entourage":
      return (
        <div style={wrapStyle}>
          <Users className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold mb-1">{c.entourageTitle || "Special People"}</h3>
          <p className="text-xs text-muted-foreground">
            {(c.people?.length || 0) > 0 ? `${c.people.length} people` : "No people added yet"}
          </p>
        </div>
      );

    case "gallery":
      return (
        <div style={wrapStyle}>
          <h3 className="font-display font-semibold mb-3">Gallery</h3>
          {(c.images?.length || 0) > 0 ? (
            <div className={`grid grid-cols-${c.columns || 3} gap-1`}>
              {c.images.slice(0, 6).map((img: any, i: number) => (
                <img key={i} src={img.url} alt="" className="w-full h-20 object-cover rounded" />
              ))}
            </div>
          ) : (
            <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">No images</div>
          )}
        </div>
      );

    case "video":
      return (
        <div style={wrapStyle}>
          <div className="w-full h-40 bg-black/80 rounded-lg flex items-center justify-center">
            <Play className="h-10 w-10 text-white/80" />
          </div>
          {c.videoUrl && <p className="text-[10px] text-muted-foreground mt-1 truncate">{c.videoUrl}</p>}
        </div>
      );

    case "dress_code":
      return (
        <div style={wrapStyle}>
          <Shirt className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold mb-2">Dress Code</h3>
          {(c.colors?.length || 0) > 0 ? (
            <div className="flex justify-center gap-2">
              {c.colors.map((col: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="w-8 h-8 rounded-full mx-auto border" style={{ backgroundColor: col.hex }} />
                  {col.name && <span className="text-[9px] mt-1 block">{col.name}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No colors set</p>
          )}
        </div>
      );

    case "gift_registry":
      return (
        <div style={wrapStyle}>
          <Gift className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">Gift Registry</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {(c.items?.length || 0) > 0 ? `${c.items.length} items` : "No items added"}
          </p>
        </div>
      );

    case "faq":
      return (
        <div style={wrapStyle}>
          <HelpCircle className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">FAQ</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {(c.faqs?.length || 0) > 0 ? `${c.faqs.length} questions` : "No FAQs added"}
          </p>
        </div>
      );

    case "rsvp":
      return (
        <div style={wrapStyle}>
          <Mail className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">RSVP</h3>
          <p className="text-xs text-muted-foreground mt-1">Guest response form</p>
        </div>
      );

    case "embed":
      return (
        <div style={wrapStyle}>
          <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">
            {c.embedUrl ? `Embed: ${c.embedType || "custom"}` : "No embed URL set"}
          </div>
        </div>
      );

    case "social_links":
      return (
        <div style={wrapStyle}>
          <h3 className="font-display font-semibold text-sm mb-2">Social Links</h3>
          <p className="text-xs text-muted-foreground">
            {(c.links?.length || 0) > 0 ? `${c.links.length} links` : "No links added"}
          </p>
        </div>
      );

    case "guestbook":
      return (
        <div style={wrapStyle}>
          <h3 className="font-display font-semibold">{c.guestbookTitle || "Guestbook"}</h3>
          <p className="text-xs text-muted-foreground mt-1">Visitors can leave messages</p>
        </div>
      );

    case "photo_collage":
      return (
        <div style={wrapStyle}>
          <h3 className="font-display font-semibold mb-2">Photo Collage</h3>
          <p className="text-xs text-muted-foreground">
            {(c.collageImages?.length || 0) > 0 ? `${c.collageImages.length} photos` : "No photos added"}
          </p>
        </div>
      );

    case "quote":
      return (
        <div style={wrapStyle}>
          <QuoteIcon className="h-6 w-6 mx-auto mb-2 opacity-40" />
          <p className="italic text-sm max-w-sm mx-auto">"{c.body || "Your quote here"}"</p>
          {c.author && <p className="text-xs text-muted-foreground mt-2">— {c.author}</p>}
        </div>
      );

    default:
      return (
        <div style={wrapStyle}>
          <p className="text-xs text-muted-foreground">Unknown block: {block_type}</p>
        </div>
      );
  }
}
