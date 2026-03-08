import { MapPin, Clock, Gift, HelpCircle, ExternalLink, Play, Quote as QuoteIcon, Users, Shirt, Mail, Music, Disc3, Phone, Camera, Star, ChevronDown, MoveHorizontal, DollarSign, QrCode, Cloud } from "lucide-react";
import type { InvitationBlock } from "../types";

export function BlockPreview({ block }: { block: InvitationBlock }) {
  const { content, style, block_type } = block;
  const c = content as any;
  const s = style as any;

  const shadowMap: Record<string, string> = {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
    "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
    inner: "inset 0 2px 4px rgba(0,0,0,0.06)",
  };

  const wrapStyle: React.CSSProperties = {
    backgroundColor: s.backgroundColor || undefined,
    color: s.textColor || undefined,
    textAlign: s.textAlign || "center",
    padding: s.padding || "1rem",
    fontFamily: s.fontFamily || undefined,
    backgroundImage: s.gradient || (s.backgroundImage ? `url(${s.backgroundImage})` : undefined),
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: s.fullHeight ? "400px" : undefined,
    position: "relative",
    borderRadius: s.borderRadius || undefined,
    boxShadow: s.shadow && s.shadow !== "none" ? shadowMap[s.shadow] : undefined,
    border: s.border || (s.borderWidth ? `${s.borderWidth} ${s.borderStyle || "solid"} ${s.borderColor || "#e5e7eb"}` : undefined),
    opacity: s.opacity !== undefined ? s.opacity / 100 : undefined,
    letterSpacing: s.letterSpacing || undefined,
    lineHeight: s.lineHeight || undefined,
    maxWidth: s.maxWidth || undefined,
    margin: s.margin || undefined,
    overflow: s.overflow || undefined,
  };

  const glassClass = s.glassmorphism ? "backdrop-blur-md bg-white/10 rounded-xl border border-white/20" : "";

  switch (block_type) {
    case "heading": {
      const Tag = `h${c.level || 2}` as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = { 1: "text-4xl", 2: "text-3xl", 3: "text-2xl", 4: "text-xl" };
      return <div style={wrapStyle}><Tag className={`font-display font-bold ${sizes[c.level || 2]}`}>{c.text || "Heading"}</Tag></div>;
    }
    case "text":
      return <div style={wrapStyle}><p className="whitespace-pre-wrap text-sm leading-relaxed">{c.body || "Text block"}</p></div>;

    case "image":
      return (
        <div style={wrapStyle}>
          {c.imageUrl ? <img src={c.imageUrl} alt={c.alt || ""} className="w-full rounded-lg object-cover max-h-64" /> : <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">No image selected</div>}
          {c.caption && <p className="text-xs text-muted-foreground mt-2">{c.caption}</p>}
        </div>
      );

    case "spacer":
      return <div style={{ height: c.height || 48 }} className="bg-muted/20 border border-dashed border-border" />;

    case "divider":
      return <div style={wrapStyle}><hr className="border-t border-current opacity-20" /></div>;

    case "button":
      return (
        <div style={wrapStyle}>
          <span className={`inline-block rounded-full text-sm font-medium ${
            c.buttonSize === "lg" ? "px-8 py-3" : c.buttonSize === "sm" ? "px-4 py-1.5 text-xs" : "px-6 py-2.5"
          } ${
            c.variant === "outline" ? "border border-current" :
            c.variant === "ghost" ? "hover:bg-black/5" :
            c.variant === "gradient" ? "bg-gradient-to-r from-primary to-primary/60 text-primary-foreground" :
            "bg-primary text-primary-foreground"
          }`}>
            {c.label || "Button"}
          </span>
        </div>
      );

    case "two_column":
      return (
        <div style={wrapStyle}>
          <div className="grid grid-cols-2 gap-4 text-left">
            {(c.columnContent || []).map((col: string, i: number) => (
              <div key={i} className="p-3 bg-muted/30 rounded-lg text-xs">{col || `Column ${i + 1}`}</div>
            ))}
          </div>
        </div>
      );

    case "three_column":
      return (
        <div style={wrapStyle}>
          <div className="grid grid-cols-3 gap-3 text-left">
            {(c.columnContent || []).map((col: string, i: number) => (
              <div key={i} className="p-2 bg-muted/30 rounded-lg text-[10px]">{col || `Col ${i + 1}`}</div>
            ))}
          </div>
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

    case "hero_video":
      return (
        <div style={{ ...wrapStyle, minHeight: "300px" }} className="flex items-center justify-center relative overflow-hidden bg-black/80">
          <Play className="h-12 w-12 text-white/60 absolute" />
          {c.heroOverlay && <div className="absolute inset-0 bg-black/40" />}
          <div className="relative z-10 text-white text-center">
            <h1 className="font-display text-3xl font-bold mb-2">{c.heroOverlayText || "Video Hero"}</h1>
            {c.heroOverlaySubtext && <p className="opacity-80">{c.heroOverlaySubtext}</p>}
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
    case "countdown_flip":
      return (
        <div style={wrapStyle}>
          <p className="text-xs text-muted-foreground mb-3">Countdown to event</p>
          <div className="flex justify-center gap-4">
            {["Days", "Hours", "Mins", "Secs"].map(u => (
              <div key={u} className={`text-center ${block_type === "countdown_flip" ? "bg-muted px-2 py-1 rounded-lg" : ""}`}>
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
          {c.venuePhone && <p className="text-xs text-muted-foreground">{c.venuePhone}</p>}
          {c.mapUrl && <span className="text-xs text-primary mt-2 inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" /> View Map</span>}
        </div>
      );

    case "map_embed":
      return (
        <div style={wrapStyle}>
          <div className="w-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs" style={{ height: c.mapHeight || 200 }}>
            <MapPin className="h-6 w-6 mr-2 opacity-40" /> {c.mapEmbedUrl ? "Map preview" : "No map URL set"}
          </div>
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
          ) : <p className="text-xs text-muted-foreground">No events added yet</p>}
        </div>
      );

    case "entourage":
      return (
        <div style={wrapStyle}>
          <Users className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold mb-1">{c.entourageTitle || "Special People"}</h3>
          <p className="text-xs text-muted-foreground">{(c.people?.length || 0) > 0 ? `${c.people.length} people` : "No people added yet"}</p>
        </div>
      );

    case "gallery":
      return (
        <div style={wrapStyle}>
          <h3 className="font-display font-semibold mb-3">Gallery</h3>
          {(c.images?.length || 0) > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {c.images.slice(0, 6).map((img: any, i: number) => (
                <img key={i} src={img.url} alt="" className="w-full h-20 object-cover rounded" />
              ))}
            </div>
          ) : <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">No images</div>}
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
          ) : <p className="text-xs text-muted-foreground">No colors set</p>}
        </div>
      );

    case "gift_registry":
      return (
        <div style={wrapStyle}>
          <Gift className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">{c.registryTitle || "Gift Registry"}</h3>
          <p className="text-xs text-muted-foreground mt-1">{(c.items?.length || 0) > 0 ? `${c.items.length} items` : "No items added"}</p>
        </div>
      );

    case "faq":
      return (
        <div style={wrapStyle}>
          <HelpCircle className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">{c.faqTitle || "FAQ"}</h3>
          <p className="text-xs text-muted-foreground mt-1">{(c.faqs?.length || 0) > 0 ? `${c.faqs.length} questions` : "No FAQs added"}</p>
        </div>
      );

    case "accordion":
      return (
        <div style={wrapStyle}>
          <ChevronDown className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">Accordion</h3>
          <p className="text-xs text-muted-foreground mt-1">{(c.accordionItems?.length || 0) > 0 ? `${c.accordionItems.length} items` : "No items added"}</p>
        </div>
      );

    case "icon_text":
      return (
        <div style={wrapStyle}>
          <Star className="h-8 w-8 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold text-sm">{c.title || "Feature Title"}</h3>
          <p className="text-xs text-muted-foreground mt-1">{c.description || "Description"}</p>
        </div>
      );

    case "testimonial":
      return (
        <div style={wrapStyle}>
          <QuoteIcon className="h-6 w-6 mx-auto mb-2 opacity-40" />
          <h3 className="font-display font-semibold">Testimonials</h3>
          <p className="text-xs text-muted-foreground mt-1">{(c.testimonials?.length || 0) > 0 ? `${c.testimonials.length} testimonials` : "No testimonials added"}</p>
        </div>
      );

    case "rsvp":
      return (
        <div style={wrapStyle}>
          <Mail className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">{c.rsvpTitle || "RSVP"}</h3>
          <p className="text-xs text-muted-foreground mt-1">{c.rsvpSubtitle || "Guest response form"}</p>
        </div>
      );

    case "embed":
      return (
        <div style={wrapStyle}>
          <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">
            {c.embedUrl ? `${c.embedType || "custom"} embed` : "No embed URL set"}
          </div>
        </div>
      );

    case "social_links":
      return (
        <div style={wrapStyle}>
          <h3 className="font-display font-semibold text-sm mb-2">{c.socialTitle || "Social Links"}</h3>
          <p className="text-xs text-muted-foreground">{(c.links?.length || 0) > 0 ? `${c.links.length} links` : "No links added"}</p>
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
          <p className="text-xs text-muted-foreground">{(c.collageImages?.length || 0) > 0 ? `${c.collageImages.length} photos` : "No photos added"}</p>
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

    case "separator_fancy": {
      const separators: Record<string, string> = {
        dots: "• • •", stars: "✦ ✦ ✦", hearts: "♥ ♥ ♥",
        floral: "❀ ❀ ❀", wave: "〰〰〰", diamond: "◆ ◆ ◆",
      };
      return (
        <div style={wrapStyle}>
          <span className="text-lg opacity-40 tracking-[0.5em]">{separators[c.separatorStyle || "floral"]}</span>
        </div>
      );
    }

    case "marquee_text":
      return (
        <div style={wrapStyle} className="overflow-hidden">
          <div className="font-display text-lg font-bold opacity-60 whitespace-nowrap">
            <MoveHorizontal className="h-4 w-4 inline mr-2 opacity-40" />
            {c.marqueeText || "Scrolling text..."}
          </div>
        </div>
      );

    case "audio_player":
      return (
        <div style={wrapStyle}>
          <Music className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold text-sm">{c.audioTitle || "Audio"}</h3>
          {c.audioArtist && <p className="text-xs text-muted-foreground">{c.audioArtist}</p>}
        </div>
      );

    case "music_player":
      return (
        <div style={wrapStyle}>
          <div className="flex items-center gap-3 max-w-xs mx-auto p-3 bg-muted/30 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              {c.musicCoverUrl ? <img src={c.musicCoverUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : <Disc3 className="h-6 w-6 opacity-40" />}
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-semibold truncate">{c.musicTitle || "Song"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{c.musicArtist || "Artist"}</p>
            </div>
          </div>
        </div>
      );

    case "photo_upload_wall":
      return (
        <div style={wrapStyle}>
          <Camera className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">{c.wallTitle || "Photo Wall"}</h3>
          <p className="text-xs text-muted-foreground mt-1">Guests can upload photos</p>
        </div>
      );

    case "seating_chart":
      return (
        <div style={wrapStyle}>
          <h3 className="font-display font-semibold mb-2">{c.seatingTitle || "Seating Chart"}</h3>
          <p className="text-xs text-muted-foreground">{(c.tables?.length || 0) > 0 ? `${c.tables.length} tables` : "No tables added"}</p>
        </div>
      );

    case "pricing_table":
      return (
        <div style={wrapStyle}>
          <DollarSign className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold">{c.pricingTitle || "Packages"}</h3>
          <p className="text-xs text-muted-foreground mt-1">{(c.pricingItems?.length || 0) > 0 ? `${c.pricingItems.length} packages` : "No packages added"}</p>
        </div>
      );

    case "weather_widget":
      return (
        <div style={wrapStyle}>
          <Cloud className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold text-sm">Weather</h3>
          <p className="text-xs text-muted-foreground mt-1">{c.weatherLocation || "No location set"}</p>
        </div>
      );

    case "qr_code":
      return (
        <div style={wrapStyle}>
          <QrCode className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-xs text-muted-foreground">{c.qrLabel || "QR Code"}</p>
        </div>
      );

    case "contact_card":
      return (
        <div style={wrapStyle}>
          <Phone className="h-6 w-6 mx-auto mb-2 opacity-60" />
          <h3 className="font-display font-semibold text-sm">{c.contactName || "Contact"}</h3>
          {c.contactRole && <p className="text-xs text-muted-foreground">{c.contactRole}</p>}
        </div>
      );

    default:
      return <div style={wrapStyle}><p className="text-xs text-muted-foreground">Unknown block: {block_type}</p></div>;
  }
}
