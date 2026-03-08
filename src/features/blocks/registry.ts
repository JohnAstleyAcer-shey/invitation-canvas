import type { BlockDefinition, BlockType } from "./types";

export const BLOCK_REGISTRY: Record<BlockType, BlockDefinition> = {
  // Layout
  heading: {
    type: "heading", label: "Heading", icon: "Type", category: "layout",
    description: "Large title text for sections",
    defaultContent: { text: "Your Heading", level: 2 },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  text: {
    type: "text", label: "Text", icon: "AlignLeft", category: "layout",
    description: "Paragraph text block",
    defaultContent: { body: "Write your message here..." },
    defaultStyle: { textAlign: "center", padding: "1rem" },
  },
  image: {
    type: "image", label: "Image", icon: "ImageIcon", category: "layout",
    description: "Single image with optional caption",
    defaultContent: { imageUrl: "", alt: "Image", caption: "" },
    defaultStyle: { padding: "1rem", borderRadius: "0.75rem" },
  },
  spacer: {
    type: "spacer", label: "Spacer", icon: "Space", category: "layout",
    description: "Empty space between blocks",
    defaultContent: { height: 48 },
    defaultStyle: {},
  },
  divider: {
    type: "divider", label: "Divider", icon: "Minus", category: "layout",
    description: "Horizontal line separator",
    defaultContent: {},
    defaultStyle: { padding: "1rem 2rem" },
  },
  button: {
    type: "button", label: "Button", icon: "MousePointer", category: "layout",
    description: "Clickable button with link",
    defaultContent: { label: "Click Me", url: "#", variant: "primary" },
    defaultStyle: { textAlign: "center", padding: "1rem" },
  },
  // Event
  countdown: {
    type: "countdown", label: "Countdown", icon: "Timer", category: "event",
    description: "Countdown timer to event date",
    defaultContent: { targetDate: "", showDays: true, showHours: true, showMinutes: true, showSeconds: true },
    defaultStyle: { textAlign: "center", padding: "3rem 1rem", fullHeight: false },
  },
  rsvp: {
    type: "rsvp", label: "RSVP Form", icon: "Mail", category: "event",
    description: "Guest RSVP submission form",
    defaultContent: { showDietaryNotes: true, showCompanions: true, showMessage: true, maxCompanions: 3 },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  location: {
    type: "location", label: "Location", icon: "MapPin", category: "event",
    description: "Venue details with map link",
    defaultContent: { venueName: "", venueAddress: "", mapUrl: "" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  gallery: {
    type: "gallery", label: "Gallery", icon: "Grid3x3", category: "event",
    description: "Photo gallery grid",
    defaultContent: { images: [], columns: 3 },
    defaultStyle: { padding: "2rem 1rem" },
  },
  video: {
    type: "video", label: "Video", icon: "Play", category: "event",
    description: "Embedded video player",
    defaultContent: { videoUrl: "", autoplay: false },
    defaultStyle: { padding: "1rem", borderRadius: "0.75rem" },
  },
  timeline: {
    type: "timeline", label: "Timeline", icon: "Clock", category: "event",
    description: "Event schedule timeline",
    defaultContent: { events: [] },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  entourage: {
    type: "entourage", label: "Entourage", icon: "Users", category: "event",
    description: "People section (roses, candles, treasures, etc.)",
    defaultContent: { entourageType: "custom", entourageTitle: "Special People", people: [] },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  // Content
  dress_code: {
    type: "dress_code", label: "Dress Code", icon: "Shirt", category: "content",
    description: "Dress code color palette",
    defaultContent: { colors: [], dressCodeNote: "" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  gift_registry: {
    type: "gift_registry", label: "Gift Registry", icon: "Gift", category: "content",
    description: "Gift suggestions and registry links",
    defaultContent: { items: [] },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  faq: {
    type: "faq", label: "FAQ", icon: "HelpCircle", category: "content",
    description: "Frequently asked questions accordion",
    defaultContent: { faqs: [] },
    defaultStyle: { padding: "2rem 1rem" },
  },
  // Social
  embed: {
    type: "embed", label: "Embed", icon: "Code", category: "social",
    description: "Embed YouTube, Spotify, or other content",
    defaultContent: { embedUrl: "", embedType: "youtube" },
    defaultStyle: { padding: "1rem", borderRadius: "0.75rem" },
  },
  social_links: {
    type: "social_links", label: "Social Links", icon: "Share2", category: "social",
    description: "Social media link buttons",
    defaultContent: { links: [] },
    defaultStyle: { textAlign: "center", padding: "1rem" },
  },
  guestbook: {
    type: "guestbook", label: "Guestbook", icon: "BookOpen", category: "social",
    description: "Public message wall from guests",
    defaultContent: { guestbookTitle: "Leave a Message", showTimestamp: true },
    defaultStyle: { padding: "2rem 1rem" },
  },
  // Special
  cover_hero: {
    type: "cover_hero", label: "Cover Hero", icon: "Maximize", category: "special",
    description: "Full-screen cover with image overlay",
    defaultContent: { imageUrl: "", overlayText: "You're Invited", overlaySubtext: "", overlay: true },
    defaultStyle: { fullHeight: true, textAlign: "center" },
  },
  message_card: {
    type: "message_card", label: "Message Card", icon: "MessageSquare", category: "special",
    description: "Styled message/letter card",
    defaultContent: { body: "Dear Guest,\n\nYou are cordially invited..." },
    defaultStyle: { textAlign: "center", padding: "3rem 2rem", glassmorphism: true },
  },
  photo_collage: {
    type: "photo_collage", label: "Photo Collage", icon: "LayoutGrid", category: "special",
    description: "Creative photo layout",
    defaultContent: { collageImages: [], layout: "grid" },
    defaultStyle: { padding: "1rem" },
  },
  quote: {
    type: "quote", label: "Quote", icon: "Quote", category: "special",
    description: "Inspirational quote with attribution",
    defaultContent: { body: "Love is patient, love is kind.", author: "" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem", fontFamily: "serif" },
  },
};

export const BLOCK_CATEGORIES = [
  { key: "layout", label: "Layout", description: "Basic building blocks" },
  { key: "event", label: "Event", description: "Event-specific sections" },
  { key: "content", label: "Content", description: "Information sections" },
  { key: "social", label: "Social", description: "Interactive & social" },
  { key: "special", label: "Special", description: "Pre-designed sections" },
] as const;

export function getBlocksByCategory(category: string) {
  return Object.values(BLOCK_REGISTRY).filter(b => b.category === category);
}
