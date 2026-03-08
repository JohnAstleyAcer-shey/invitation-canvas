import { SectionWrapper } from "./SectionWrapper";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function MessageSection({ invitation, variant = "classic" }: { invitation: Invitation; variant?: Variant }) {
  if (!invitation.invitation_message) return <SectionWrapper><p style={{ color: "var(--inv-text-secondary)" }}>No message yet.</p></SectionWrapper>;

  const styles: Record<Variant, string> = {
    classic: "text-lg leading-relaxed italic",
    modern: "text-xl leading-relaxed font-light",
    elegant: "text-lg leading-loose tracking-wide",
    bold: "text-2xl font-bold leading-snug",
  };

  return (
    <SectionWrapper>
      <h2 className="text-3xl mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "modern" ? "Our Story" : variant === "bold" ? "THE MESSAGE" : "A Special Message"}
      </h2>
      <p className={styles[variant]} style={{ color: "var(--inv-text-secondary)" }}>
        {invitation.invitation_message}
      </p>
    </SectionWrapper>
  );
}
