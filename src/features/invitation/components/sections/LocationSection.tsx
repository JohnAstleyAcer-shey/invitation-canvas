import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function LocationSection({ invitation, variant = "classic" }: { invitation: Invitation; variant?: Variant }) {
  const mapUrl = invitation.venue_map_url || (invitation.venue_lat && invitation.venue_lng
    ? `https://www.google.com/maps?q=${invitation.venue_lat},${invitation.venue_lng}`
    : invitation.venue_address ? `https://www.google.com/maps/search/${encodeURIComponent(invitation.venue_address)}` : null);

  const directionsUrl = invitation.venue_address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(invitation.venue_address)}`
    : null;

  return (
    <SectionWrapper>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
      >
        <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl sm:text-3xl mb-6"
        style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
      >
        {variant === "bold" ? "THE VENUE" : "Venue"}
      </motion.h2>
      {invitation.venue_name && (
        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg sm:text-xl font-semibold mb-2"
          style={{ color: "var(--inv-text)" }}
        >
          {invitation.venue_name}
        </motion.p>
      )}
      {invitation.venue_address && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm sm:text-base mb-6 max-w-sm mx-auto"
          style={{ color: "var(--inv-text-secondary)" }}
        >
          {invitation.venue_address}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        {mapUrl && (
          <motion.a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm"
            style={{ background: "var(--inv-primary)", color: "var(--inv-secondary)" }}
          >
            <ExternalLink className="w-4 h-4" /> View Map
          </motion.a>
        )}
        {directionsUrl && (
          <motion.a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border-2 transition-all"
            style={{ borderColor: "var(--inv-primary)", color: "var(--inv-text)" }}
          >
            <Navigation className="w-4 h-4" /> Get Directions
          </motion.a>
        )}
      </motion.div>
    </SectionWrapper>
  );
}
