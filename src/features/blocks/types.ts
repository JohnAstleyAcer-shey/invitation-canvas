// Block type definitions for the block-based invitation editor

export const BLOCK_TYPES = [
  // Layout blocks
  "heading", "text", "image", "spacer", "divider", "button",
  // Columns
  "two_column", "three_column",
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
  // New blocks
  "map_embed", "audio_player", "accordion", "icon_text",
  "hero_video", "marquee_text", "separator_fancy", "testimonial",
  "photo_upload_wall", "music_player", "seating_chart",
  "countdown_flip", "pricing_table", "weather_widget",
  "qr_code", "contact_card",
  // Envelope as a block type (always pinned first)
  "envelope_cover",
  // Hybrid expansion: 25+ new high-value block types
  "wax_seal", "ribbon_divider", "polaroid_strip", "vow_cards",
  "ninang_ninong", "baptism_certificate", "champagne_toast",
  "save_the_date", "prayer_card", "scripture_card", "name_reveal",
  "monogram", "our_story", "hashtag_card", "livestream",
  "parking_info", "transport_info", "hotel_card", "kids_section",
  "calendar_add", "attire_inspo", "count_us_in", "when_where",
  "ceremony_reception", "dance_floor",
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
  variant?: "primary" | "outline" | "ghost" | "gradient";
  buttonSize?: "sm" | "md" | "lg";
  buttonIcon?: string;
  // countdown
  targetDate?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  countdownStyle?: "simple" | "flip" | "circle" | "minimal";
  // rsvp
  showDietaryNotes?: boolean;
  showCompanions?: boolean;
  showMessage?: boolean;
  maxCompanions?: number;
  rsvpTitle?: string;
  rsvpSubtitle?: string;
  // location
  venueName?: string;
  venueAddress?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
  showDirections?: boolean;
  venuePhone?: string;
  // gallery
  images?: { url: string; caption?: string }[];
  columns?: 2 | 3 | 4;
  galleryLayout?: "grid" | "masonry" | "carousel" | "justified";
  showCaptions?: boolean;
  enableLightbox?: boolean;
  // video
  videoUrl?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  posterUrl?: string;
  // timeline
  events?: { time: string; title: string; description?: string; icon?: string }[];
  timelineLayout?: "vertical" | "horizontal" | "alternating";
  // entourage
  entourageType?: "roses" | "candles" | "treasures" | "blue_bills" | "custom";
  entourageTitle?: string;
  people?: { name: string; role?: string; message?: string; imageUrl?: string }[];
  entourageLayout?: "grid" | "list" | "carousel";
  // dress_code
  colors?: { hex: string; name?: string; description?: string }[];
  dressCodeNote?: string;
  dressCodeImage?: string;
  // gift_registry
  items?: { name: string; description?: string; url?: string; linkLabel?: string; category?: string; imageUrl?: string; price?: string }[];
  registryTitle?: string;
  // faq
  faqs?: { question: string; answer: string; category?: string }[];
  faqTitle?: string;
  // embed
  embedUrl?: string;
  embedType?: "youtube" | "spotify" | "custom" | "tiktok" | "vimeo";
  embedHeight?: number;
  // social_links
  links?: { platform: string; url: string; label?: string }[];
  socialTitle?: string;
  socialStyle?: "icons" | "buttons" | "pills";
  // guestbook
  guestbookTitle?: string;
  showTimestamp?: boolean;
  showAvatar?: boolean;
  maxMessages?: number;
  // photo_collage
  collageImages?: { url: string; caption?: string }[];
  layout?: "grid" | "masonry" | "carousel" | "mosaic";
  // NEW — two_column / three_column
  columnContent?: string[];
  columnRatio?: string; // e.g. "1:1", "2:1", "1:2"
  // NEW — icon_text
  iconName?: string;
  iconSize?: "sm" | "md" | "lg";
  title?: string;
  description?: string;
  // NEW — marquee_text
  marqueeText?: string;
  marqueeSpeed?: number; // seconds
  marqueeDirection?: "left" | "right";
  // NEW — separator_fancy
  separatorStyle?: "dots" | "stars" | "hearts" | "floral" | "wave" | "diamond";
  // NEW — testimonial
  testimonials?: { quote: string; author: string; role?: string; imageUrl?: string }[];
  // NEW — audio_player
  audioUrl?: string;
  audioTitle?: string;
  audioArtist?: string;
  audioAutoplay?: boolean;
  // NEW — map_embed
  mapEmbedUrl?: string;
  mapZoom?: number;
  mapHeight?: number;
  // NEW — hero_video
  heroVideoUrl?: string;
  heroOverlayText?: string;
  heroOverlaySubtext?: string;
  heroOverlay?: boolean;
  // NEW — accordion
  accordionItems?: { title: string; content: string; icon?: string }[];
  accordionStyle?: "simple" | "bordered" | "filled";
  // NEW — music_player
  musicUrl?: string;
  musicTitle?: string;
  musicArtist?: string;
  musicCoverUrl?: string;
  musicAutoplay?: boolean;
  // NEW — photo_upload_wall
  wallTitle?: string;
  wallMaxPhotos?: number;
  wallColumns?: 2 | 3 | 4;
  // NEW — seating_chart
  tables?: { name: string; seats: string[] }[];
  seatingTitle?: string;
  // NEW — countdown_flip
  flipStyle?: "dark" | "light" | "glass";
  // NEW — pricing_table
  pricingItems?: { name: string; price: string; description?: string; features?: string[]; highlighted?: boolean }[];
  pricingTitle?: string;
  // NEW — weather_widget
  weatherLocation?: string;
  weatherDate?: string;
  // NEW — qr_code
  qrData?: string;
  qrLabel?: string;
  qrSize?: number;
  // NEW — contact_card
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactRole?: string;
  contactImageUrl?: string;
}

export interface BlockStyle {
  backgroundColor?: string;
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  padding?: string;
  borderRadius?: string;
  fontFamily?: string;
  fontSize?: string;
  animation?: "none" | "fade-up" | "fade-in" | "slide-left" | "slide-right" | "zoom" | "bounce" | "rotate" | "flip";
  fullHeight?: boolean;
  maxWidth?: string;
  backgroundImage?: string;
  backgroundOverlay?: string;
  glassmorphism?: boolean;
  // NEW style options
  gradient?: string; // e.g. "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner";
  border?: string; // e.g. "1px solid #ccc"
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted" | "double";
  opacity?: number; // 0-100
  letterSpacing?: string;
  lineHeight?: string;
  backdropBlur?: string;
  margin?: string;
  overflow?: "visible" | "hidden" | "auto";
  position?: "relative" | "sticky";
  mixBlendMode?: string;
  filter?: string;
  transform?: string;
  transition?: string;
  customCSS?: string;
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
  category: "layout" | "event" | "content" | "social" | "special" | "advanced";
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
