// Block type definitions for the block-based invitation editor

export const BLOCK_TYPES = [
  // Layout blocks
  "heading", "text", "image", "spacer", "divider", "button",
  // Event blocks
  "countdown", "rsvp", "location", "gallery", "video", "timeline",
  // Entourage blocks (debut)
  "entourage",
  // Info blocks
  "dress_code", "gift_registry", "faq",
  // Social blocks
  "embed", "social_links", "guestbook",
  // Special
  "cover_hero", "message_card", "photo_collage", "quote",
] as const;

export type BlockType = typeof BLOCK_TYPES[number];

export interface BlockContent {
  // heading
  text?: string;
  level?: 1 | 2 | 3 | 4;
  // text / message_card / quote
  body?: string;
  author?: string;
  // image / cover_hero
  imageUrl?: string;
  alt?: string;
  caption?: string;
  overlay?: boolean;
  overlayText?: string;
  overlaySubtext?: string;
  // spacer
  height?: number;
  // button
  label?: string;
  url?: string;
  variant?: "primary" | "outline" | "ghost";
  // countdown
  targetDate?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  // rsvp
  showDietaryNotes?: boolean;
  showCompanions?: boolean;
  showMessage?: boolean;
  maxCompanions?: number;
  // location
  venueName?: string;
  venueAddress?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
  // gallery
  images?: { url: string; caption?: string }[];
  columns?: 2 | 3 | 4;
  // video
  videoUrl?: string;
  autoplay?: boolean;
  // timeline
  events?: { time: string; title: string; description?: string; icon?: string }[];
  // entourage
  entourageType?: "roses" | "candles" | "treasures" | "blue_bills" | "custom";
  entourageTitle?: string;
  people?: { name: string; role?: string; message?: string; imageUrl?: string }[];
  // dress_code
  colors?: { hex: string; name?: string; description?: string }[];
  dressCodeNote?: string;
  // gift_registry
  items?: { name: string; description?: string; url?: string; linkLabel?: string; category?: string }[];
  // faq
  faqs?: { question: string; answer: string; category?: string }[];
  // embed
  embedUrl?: string;
  embedType?: "youtube" | "spotify" | "custom";
  // social_links
  links?: { platform: string; url: string; label?: string }[];
  // guestbook
  guestbookTitle?: string;
  showTimestamp?: boolean;
  // photo_collage
  collageImages?: { url: string; caption?: string }[];
  layout?: "grid" | "masonry" | "carousel";
}

export interface BlockStyle {
  backgroundColor?: string;
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  padding?: string;
  borderRadius?: string;
  fontFamily?: string;
  fontSize?: string;
  animation?: "none" | "fade-up" | "fade-in" | "slide-left" | "slide-right" | "zoom";
  fullHeight?: boolean;
  maxWidth?: string;
  backgroundImage?: string;
  backgroundOverlay?: string;
  glassmorphism?: boolean;
}

export interface InvitationBlock {
  id: string;
  invitation_id: string;
  block_type: BlockType;
  content: BlockContent;
  style: BlockStyle;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: string;
  category: "layout" | "event" | "content" | "social" | "special";
  description: string;
  defaultContent: BlockContent;
  defaultStyle: BlockStyle;
}

export interface BlockTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  event_type: string | null;
  blocks: { block_type: BlockType; content: BlockContent; style: BlockStyle }[];
  thumbnail_url: string | null;
  is_premium: boolean;
  sort_order: number;
}
