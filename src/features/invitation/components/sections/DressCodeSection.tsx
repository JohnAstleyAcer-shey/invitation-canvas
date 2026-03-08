import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DressCodeColor = Tables<"dress_code_colors">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function DressCodeSection({ colors, variant = "classic" }: { colors: DressCodeColor[]; variant?: Variant }) {
  if (!colors.length) return null;

  return (
    <SectionWrapper>
      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
        <Shirt className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "DRESS CODE" : "Dress Code"}
      </h2>
      <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
        {colors.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", damping: 12 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 shadow-lg transition-transform hover:scale-110"
              style={{ background: c.color_hex, borderColor: "var(--inv-accent)" }}
            />
            {c.color_name && <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--inv-text)" }}>{c.color_name}</p>}
            {c.description && <p className="text-[10px]" style={{ color: "var(--inv-text-secondary)" }}>{c.description}</p>}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
