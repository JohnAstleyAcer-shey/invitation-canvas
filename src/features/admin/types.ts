import { Tables, TablesInsert, TablesUpdate, Enums } from "@/integrations/supabase/types";

// Re-export database types for convenience
export type Invitation = Tables<"invitations">;
export type InvitationInsert = TablesInsert<"invitations">;
export type InvitationUpdate = TablesUpdate<"invitations">;
export type InvitationTheme = Tables<"invitation_themes">;
export type InvitationPage = Tables<"invitation_pages">;
export type Guest = Tables<"guests">;
export type Rsvp = Tables<"rsvps">;
export type TimelineEvent = Tables<"timeline_events">;
export type Rose = Tables<"roses">;
export type Candle = Tables<"candles">;
export type Treasure = Tables<"treasures">;
export type BlueBill = Tables<"blue_bills">;
export type GalleryImage = Tables<"gallery_images">;
export type DressCodeColor = Tables<"dress_code_colors">;
export type GiftItem = Tables<"gift_items">;
export type Faq = Tables<"faqs">;
export type CustomerAdmin = Tables<"customer_admins">;
export type Profile = Tables<"profiles">;
export type UserRole = Tables<"user_roles">;

export type EventType = Enums<"event_type">;
export type RsvpStatus = Enums<"rsvp_status">;
export type PageType = Enums<"page_type">;
export type StyleVariant = Enums<"style_variant">;
export type AppRole = Enums<"app_role">;

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  debut: "Debut",
  wedding: "Wedding",
  birthday: "Birthday",
  christening: "Christening",
  corporate: "Corporate",
};

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  pending: "Pending",
  attending: "Attending",
  not_attending: "Not Attending",
  maybe: "Maybe",
};

export const PAGE_TYPE_LABELS: Record<PageType, string> = {
  cover: "Cover",
  message: "Message",
  countdown: "Countdown",
  location: "Location",
  timeline: "Timeline",
  roses: "18 Roses",
  candles: "18 Candles",
  treasures: "18 Treasures",
  blue_bills: "18 Blue Bills",
  dress_code: "Dress Code",
  gallery: "Gallery",
  gift_guide: "Gift Guide",
  faq: "FAQ",
  rsvp: "RSVP",
};

export const STYLE_VARIANT_LABELS: Record<StyleVariant, string> = {
  classic: "Classic",
  modern: "Modern",
  elegant: "Elegant",
  bold: "Bold",
};

export const DEFAULT_PAGES_BY_EVENT: Record<EventType, PageType[]> = {
  debut: ["cover", "message", "countdown", "location", "timeline", "roses", "candles", "treasures", "blue_bills", "dress_code", "gallery", "gift_guide", "faq", "rsvp"],
  wedding: ["cover", "message", "countdown", "location", "timeline", "dress_code", "gallery", "gift_guide", "faq", "rsvp"],
  birthday: ["cover", "message", "countdown", "location", "timeline", "dress_code", "gallery", "gift_guide", "faq", "rsvp"],
  christening: ["cover", "message", "countdown", "location", "timeline", "dress_code", "gallery", "gift_guide", "faq", "rsvp"],
  corporate: ["cover", "message", "countdown", "location", "timeline", "dress_code", "gallery", "faq", "rsvp"],
};
