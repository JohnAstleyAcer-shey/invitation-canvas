import { SectionWrapper } from "./SectionWrapper";
import { Shirt } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DressCodeColor = Tables<"dress_code_colors">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function DressCodeSection({ colors, variant = "classic" }: { colors: DressCodeColor[]; variant?: Variant }) {
  if (!colors.length) return null;

  return (
    <SectionWrapper>
      <Shirt className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      <h2 className="text-3xl mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "DRESS CODE" : "Dress Code"}
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {colors.map(c => (
          <div key={c.id} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 shadow-md" style={{ background: c.color_hex, borderColor: "var(--inv-accent)" }} />
            {c.color_name && <p className="text-sm font-medium" style={{ color: "var(--inv-text)" }}>{c.color_name}</p>}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
