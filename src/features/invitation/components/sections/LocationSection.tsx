import { SectionWrapper } from "./SectionWrapper";
import { MapPin, Navigation } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function LocationSection({ invitation, variant = "classic" }: { invitation: Invitation; variant?: Variant }) {
  const mapUrl = invitation.venue_map_url || (invitation.venue_lat && invitation.venue_lng
    ? `https://www.google.com/maps?q=${invitation.venue_lat},${invitation.venue_lng}`
    : invitation.venue_address ? `https://www.google.com/maps/search/${encodeURIComponent(invitation.venue_address)}` : null);

  return (
    <SectionWrapper>
      <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      <h2 className="text-3xl mb-6" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "THE VENUE" : "Venue"}
      </h2>
      {invitation.venue_name && (
        <p className="text-xl font-semibold mb-2" style={{ color: "var(--inv-text)" }}>{invitation.venue_name}</p>
      )}
      {invitation.venue_address && (
        <p className="mb-6" style={{ color: "var(--inv-text-secondary)" }}>{invitation.venue_address}</p>
      )}
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--inv-primary)", color: "var(--inv-secondary)" }}
        >
          <Navigation className="w-4 h-4" /> Get Directions
        </a>
      )}
    </SectionWrapper>
  );
}
