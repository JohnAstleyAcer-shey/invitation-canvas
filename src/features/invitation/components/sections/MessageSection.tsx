import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function MessageSection({ invitation, variant = "classic" }: { invitation: Invitation; variant?: Variant }) {
  if (!invitation.invitation_message) return <SectionWrapper><p style={{ color: "var(--inv-text-secondary)" }}>No message yet.</p></SectionWrapper>;

  const styles: Record<Variant, string> = {
    classic: "text-base sm:text-lg leading-relaxed italic",
    modern: "text-lg sm:text-xl leading-relaxed font-light",
    elegant: "text-base sm:text-lg leading-loose tracking-wide",
    bold: "text-xl sm:text-2xl font-bold leading-snug",
  };

  return (
    <SectionWrapper>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 0.15, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <Quote className="w-12 h-12 mx-auto mb-2" style={{ color: "var(--inv-accent)" }} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "modern" ? "Our Story" : variant === "bold" ? "THE MESSAGE" : "A Special Message"}
      </h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className={`${styles[variant]} whitespace-pre-wrap max-w-lg mx-auto`}
        style={{ color: "var(--inv-text-secondary)" }}
      >
        {invitation.invitation_message}
      </motion.p>
    </SectionWrapper>
  );
}
