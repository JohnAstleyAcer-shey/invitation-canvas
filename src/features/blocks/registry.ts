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
    defaultContent: { label: "Click Me", url: "#", variant: "primary", buttonSize: "md" },
    defaultStyle: { textAlign: "center", padding: "1rem" },
  },
  two_column: {
    type: "two_column", label: "Two Columns", icon: "Columns", category: "layout",
    description: "Two-column content layout",
    defaultContent: { columnContent: ["Left column content", "Right column content"], columnRatio: "1:1" },
    defaultStyle: { padding: "2rem 1rem" },
  },
  three_column: {
    type: "three_column", label: "Three Columns", icon: "LayoutGrid", category: "layout",
    description: "Three-column content layout",
    defaultContent: { columnContent: ["Column 1", "Column 2", "Column 3"] },
    defaultStyle: { padding: "2rem 1rem" },
  },
  // Event
  countdown: {
    type: "countdown", label: "Countdown", icon: "Timer", category: "event",
    description: "Countdown timer to event date",
    defaultContent: { targetDate: "", showDays: true, showHours: true, showMinutes: true, showSeconds: true, countdownStyle: "simple" },
    defaultStyle: { textAlign: "center", padding: "3rem 1rem", fullHeight: false },
  },
  countdown_flip: {
    type: "countdown_flip", label: "Flip Countdown", icon: "Timer", category: "event",
    description: "Flip-style animated countdown",
    defaultContent: { targetDate: "", showDays: true, showHours: true, showMinutes: true, showSeconds: true, flipStyle: "dark" },
    defaultStyle: { textAlign: "center", padding: "3rem 1rem" },
  },
  rsvp: {
    type: "rsvp", label: "RSVP Form", icon: "Mail", category: "event",
    description: "Guest RSVP submission form",
    defaultContent: { showDietaryNotes: true, showCompanions: true, showMessage: true, maxCompanions: 3, rsvpTitle: "RSVP", rsvpSubtitle: "We hope you can join us" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  location: {
    type: "location", label: "Location", icon: "MapPin", category: "event",
    description: "Venue details with map link",
    defaultContent: { venueName: "", venueAddress: "", mapUrl: "", showDirections: true },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  map_embed: {
    type: "map_embed", label: "Map Embed", icon: "Map", category: "event",
    description: "Embedded Google Maps view",
    defaultContent: { mapEmbedUrl: "", mapHeight: 300, mapZoom: 15 },
    defaultStyle: { padding: "1rem", borderRadius: "0.75rem" },
  },
  gallery: {
    type: "gallery", label: "Gallery", icon: "Grid3x3", category: "event",
    description: "Photo gallery grid",
    defaultContent: { images: [], columns: 3, galleryLayout: "grid", showCaptions: false, enableLightbox: true },
    defaultStyle: { padding: "2rem 1rem" },
  },
  video: {
    type: "video", label: "Video", icon: "Play", category: "event",
    description: "Embedded video player",
    defaultContent: { videoUrl: "", autoplay: false, muted: false, loop: false },
    defaultStyle: { padding: "1rem", borderRadius: "0.75rem" },
  },
  hero_video: {
    type: "hero_video", label: "Hero Video", icon: "Play", category: "event",
    description: "Full-screen video background hero",
    defaultContent: { heroVideoUrl: "", heroOverlayText: "You're Invited", heroOverlaySubtext: "", heroOverlay: true },
    defaultStyle: { fullHeight: true, textAlign: "center" },
  },
  timeline: {
    type: "timeline", label: "Timeline", icon: "Clock", category: "event",
    description: "Event schedule timeline",
    defaultContent: { events: [], timelineLayout: "vertical" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  entourage: {
    type: "entourage", label: "Entourage", icon: "Users", category: "event",
    description: "People section (roses, candles, etc.)",
    defaultContent: { entourageType: "custom", entourageTitle: "Special People", people: [], entourageLayout: "grid" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  weather_widget: {
    type: "weather_widget", label: "Weather", icon: "Cloud", category: "event",
    description: "Weather info for event day",
    defaultContent: { weatherLocation: "", weatherDate: "" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  seating_chart: {
    type: "seating_chart", label: "Seating Chart", icon: "LayoutGrid", category: "event",
    description: "Table seating arrangement",
    defaultContent: { tables: [], seatingTitle: "Seating Arrangement" },
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
    defaultContent: { items: [], registryTitle: "Gift Registry" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  faq: {
    type: "faq", label: "FAQ", icon: "HelpCircle", category: "content",
    description: "Frequently asked questions accordion",
    defaultContent: { faqs: [], faqTitle: "FAQ" },
    defaultStyle: { padding: "2rem 1rem" },
  },
  accordion: {
    type: "accordion", label: "Accordion", icon: "ChevronDown", category: "content",
    description: "Collapsible content sections",
    defaultContent: { accordionItems: [], accordionStyle: "bordered" },
    defaultStyle: { padding: "2rem 1rem" },
  },
  icon_text: {
    type: "icon_text", label: "Icon + Text", icon: "Star", category: "content",
    description: "Icon with title and description",
    defaultContent: { iconName: "Heart", iconSize: "md", title: "Feature Title", description: "Description text goes here" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  testimonial: {
    type: "testimonial", label: "Testimonials", icon: "MessageCircle", category: "content",
    description: "Customer/guest testimonials",
    defaultContent: { testimonials: [] },
    defaultStyle: { padding: "2rem 1rem" },
  },
  pricing_table: {
    type: "pricing_table", label: "Pricing Table", icon: "DollarSign", category: "content",
    description: "Pricing cards for events/packages",
    defaultContent: { pricingItems: [], pricingTitle: "Packages" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  contact_card: {
    type: "contact_card", label: "Contact Card", icon: "Phone", category: "content",
    description: "Contact information card",
    defaultContent: { contactName: "", contactPhone: "", contactEmail: "", contactRole: "" },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  // Social
  embed: {
    type: "embed", label: "Embed", icon: "Code", category: "social",
    description: "Embed YouTube, Spotify, TikTok, or other content",
    defaultContent: { embedUrl: "", embedType: "youtube", embedHeight: 315 },
    defaultStyle: { padding: "1rem", borderRadius: "0.75rem" },
  },
  social_links: {
    type: "social_links", label: "Social Links", icon: "Share2", category: "social",
    description: "Social media link buttons",
    defaultContent: { links: [], socialStyle: "icons" },
    defaultStyle: { textAlign: "center", padding: "1rem" },
  },
  guestbook: {
    type: "guestbook", label: "Guestbook", icon: "BookOpen", category: "social",
    description: "Public message wall from guests",
    defaultContent: { guestbookTitle: "Leave a Message", showTimestamp: true, showAvatar: true, maxMessages: 50 },
    defaultStyle: { padding: "2rem 1rem" },
  },
  photo_upload_wall: {
    type: "photo_upload_wall", label: "Photo Wall", icon: "Camera", category: "social",
    description: "Guests can upload photos",
    defaultContent: { wallTitle: "Share Your Photos", wallMaxPhotos: 100, wallColumns: 3 },
    defaultStyle: { padding: "2rem 1rem" },
  },
  qr_code: {
    type: "qr_code", label: "QR Code", icon: "QrCode", category: "social",
    description: "QR code for links or info",
    defaultContent: { qrData: "", qrLabel: "Scan Me", qrSize: 200 },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
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
  separator_fancy: {
    type: "separator_fancy", label: "Fancy Divider", icon: "Sparkles", category: "special",
    description: "Decorative separator with patterns",
    defaultContent: { separatorStyle: "floral" },
    defaultStyle: { textAlign: "center", padding: "1rem 2rem" },
  },
  marquee_text: {
    type: "marquee_text", label: "Marquee", icon: "MoveHorizontal", category: "special",
    description: "Scrolling text banner",
    defaultContent: { marqueeText: "Welcome to our special day!", marqueeSpeed: 20, marqueeDirection: "left" },
    defaultStyle: { padding: "1rem 0" },
  },
  // Advanced
  audio_player: {
    type: "audio_player", label: "Audio Player", icon: "Music", category: "advanced",
    description: "Audio file player with controls",
    defaultContent: { audioUrl: "", audioTitle: "Audio", audioArtist: "", audioAutoplay: false },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
  music_player: {
    type: "music_player", label: "Music Player", icon: "Disc3", category: "advanced",
    description: "Styled music player with cover art",
    defaultContent: { musicUrl: "", musicTitle: "Song Title", musicArtist: "Artist", musicCoverUrl: "", musicAutoplay: false },
    defaultStyle: { textAlign: "center", padding: "2rem 1rem" },
  },
};

export const BLOCK_CATEGORIES = [
  { key: "layout", label: "Layout", description: "Basic building blocks" },
  { key: "event", label: "Event", description: "Event-specific sections" },
  { key: "content", label: "Content", description: "Information sections" },
  { key: "social", label: "Social", description: "Interactive & social" },
  { key: "special", label: "Special", description: "Pre-designed sections" },
  { key: "advanced", label: "Advanced", description: "Advanced components" },
] as const;

export function getBlocksByCategory(category: string) {
  return Object.values(BLOCK_REGISTRY).filter(b => b.category === category);
}
