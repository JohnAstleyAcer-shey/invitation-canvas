import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";
import { Gift, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type GiftItem = Tables<"gift_items">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function GiftGuideSection({ items, variant = "classic" }: { items: GiftItem[]; variant?: Variant }) {
  if (!items.length) return null;

  return (
    <SectionWrapper className="!overflow-y-auto">
      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
        <Gift className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "GIFT GUIDE" : "Gift Guide"}
      </h2>
      <div className="space-y-3 text-left max-w-md mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border transition-all hover:shadow-md"
            style={{ borderColor: "var(--inv-accent)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm sm:text-base" style={{ color: "var(--inv-text)" }}>{item.item_name}</p>
                {item.description && <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--inv-text-secondary)" }}>{item.description}</p>}
                {item.category && (
                  <span className="inline-block text-[10px] mt-2 px-2.5 py-0.5 rounded-full" style={{ background: "var(--inv-accent)", color: "var(--inv-secondary)" }}>
                    {item.category}
                  </span>
                )}
              </div>
              {item.link_url && (
                <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-2 rounded-lg hover:opacity-70 transition-opacity" style={{ color: "var(--inv-primary)" }}>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
