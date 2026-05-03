import type { CatalogBlock, TemplateDef, TemplateCategory } from "./types";

/**
 * Builder helpers that produce CatalogBlock arrays with a consistent
 * design language. Keeps individual template files tiny.
 */

interface Palette {
  bg: string;
  accent: string;
  text: string;
}

const baseStyle = (p: Palette, extra: Partial<CatalogBlock["style"]> = {}): CatalogBlock["style"] => ({
  backgroundColor: p.bg,
  textColor: p.text,
  textAlign: "center",
  padding: "3rem 1.5rem",
  fontFamily: "serif",
  animation: "fade-up",
  ...extra,
});

export const b = {
  cover(p: Palette, title: string, subtitle: string, image?: string): CatalogBlock {
    return {
      block_type: "cover_hero",
      content: { overlayText: title, overlaySubtext: subtitle, overlay: true, imageUrl: image },
      style: baseStyle(p, { fullHeight: true, padding: "0", backgroundImage: image }),
    };
  },
  heroVideo(p: Palette, title: string, subtitle: string): CatalogBlock {
    return {
      block_type: "hero_video",
      content: { heroOverlayText: title, heroOverlaySubtext: subtitle, heroOverlay: true },
      style: baseStyle(p, { fullHeight: true, padding: "0" }),
    };
  },
  message(p: Palette, body: string): CatalogBlock {
    return {
      block_type: "message_card",
      content: { body },
      style: baseStyle(p, { glassmorphism: true, padding: "4rem 2rem" }),
    };
  },
  text(p: Palette, body: string): CatalogBlock {
    return { block_type: "text", content: { body }, style: baseStyle(p) };
  },
  countdown(p: Palette, style: "simple" | "flip" | "circle" | "minimal" = "simple"): CatalogBlock {
    return {
      block_type: style === "flip" ? "countdown_flip" : "countdown",
      content: { showDays: true, showHours: true, showMinutes: true, showSeconds: true, countdownStyle: style, flipStyle: "glass" },
      style: baseStyle(p, { padding: "3rem 1rem" }),
    };
  },
  location(p: Palette, venue = "Venue Name", address = ""): CatalogBlock {
    return {
      block_type: "location",
      content: { venueName: venue, venueAddress: address, showDirections: true },
      style: baseStyle(p, { padding: "2.5rem 1rem" }),
    };
  },
  timeline(p: Palette, events: { time: string; title: string; description?: string }[]): CatalogBlock {
    return {
      block_type: "timeline",
      content: { events, timelineLayout: "alternating" },
      style: baseStyle(p, { padding: "2rem 1rem" }),
    };
  },
  entourage(p: Palette, type: "roses" | "candles" | "treasures" | "blue_bills" | "custom", title: string): CatalogBlock {
    return {
      block_type: "entourage",
      content: { entourageType: type, entourageTitle: title, people: [], entourageLayout: "grid" },
      style: baseStyle(p, { padding: "2rem 1rem" }),
    };
  },
  gallery(p: Palette, columns: 2 | 3 | 4 = 3): CatalogBlock {
    return {
      block_type: "gallery",
      content: { images: [], columns, galleryLayout: "masonry", enableLightbox: true },
      style: baseStyle(p, { padding: "2rem 1rem" }),
    };
  },
  dressCode(p: Palette, colors: { hex: string; name?: string }[], note?: string): CatalogBlock {
    return {
      block_type: "dress_code",
      content: { colors, dressCodeNote: note },
      style: baseStyle(p, { padding: "2.5rem 1rem" }),
    };
  },
  giftRegistry(p: Palette): CatalogBlock {
    return { block_type: "gift_registry", content: { items: [] }, style: baseStyle(p) };
  },
  faq(p: Palette): CatalogBlock {
    return { block_type: "faq", content: { faqs: [] }, style: baseStyle(p) };
  },
  rsvp(p: Palette): CatalogBlock {
    return {
      block_type: "rsvp",
      content: { showDietaryNotes: true, showCompanions: true, showMessage: true, maxCompanions: 3 },
      style: baseStyle(p, { padding: "3rem 1rem" }),
    };
  },
  music(p: Palette, title?: string): CatalogBlock {
    return {
      block_type: "music_player",
      content: { musicTitle: title ?? "Theme Song", musicArtist: "—", musicAutoplay: false },
      style: baseStyle(p, { padding: "2rem 1rem" }),
    };
  },
  socials(p: Palette): CatalogBlock {
    return {
      block_type: "social_links",
      content: { socialTitle: "Follow our journey", socialStyle: "pills", links: [] },
      style: baseStyle(p, { padding: "2rem 1rem" }),
    };
  },
  qr(p: Palette, label = "Scan to share"): CatalogBlock {
    return {
      block_type: "qr_code",
      content: { qrLabel: label, qrSize: 180 },
      style: baseStyle(p, { padding: "2rem 1rem" }),
    };
  },
  separator(p: Palette, style: "dots" | "stars" | "hearts" | "floral" | "wave" | "diamond" = "floral"): CatalogBlock {
    return {
      block_type: "separator_fancy",
      content: { separatorStyle: style },
      style: baseStyle(p, { padding: "1rem" }),
    };
  },
  quote(p: Palette, body: string, author?: string): CatalogBlock {
    return {
      block_type: "quote",
      content: { body, author },
      style: baseStyle(p, { padding: "3rem 2rem" }),
    };
  },
  marquee(p: Palette, text: string): CatalogBlock {
    return {
      block_type: "marquee_text",
      content: { marqueeText: text, marqueeSpeed: 25, marqueeDirection: "left" },
      style: baseStyle(p, { padding: "1.25rem 0" }),
    };
  },
};

export function defineTemplate(t: TemplateDef): TemplateDef {
  return t;
}

export const PALETTES = {
  monoBlack: { bg: "#0a0a0a", accent: "#ffffff", text: "#fafafa" },
  monoWhite: { bg: "#ffffff", accent: "#0a0a0a", text: "#0a0a0a" },
  ivory: { bg: "#f6f1ea", accent: "#1a1a1a", text: "#1a1a1a" },
  charcoal: { bg: "#1f1f1f", accent: "#e8e8e8", text: "#e8e8e8" },
  blush: { bg: "#f5e6e0", accent: "#2a1f1d", text: "#2a1f1d" },
  midnight: { bg: "#0d1424", accent: "#f0f0f0", text: "#f0f0f0" },
  sage: { bg: "#e8ece4", accent: "#1f2a20", text: "#1f2a20" },
  pearl: { bg: "#fafaf7", accent: "#2c2c2c", text: "#2c2c2c" },
} satisfies Record<string, Palette>;

export type CategoryHelper = typeof b;
