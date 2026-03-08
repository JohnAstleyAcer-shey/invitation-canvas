import { SectionWrapper } from "./SectionWrapper";
import { Gift, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type GiftItem = Tables<"gift_items">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function GiftGuideSection({ items, variant = "classic" }: { items: GiftItem[]; variant?: Variant }) {
  if (!items.length) return null;

  return (
    <SectionWrapper className="!overflow-y-auto">
      <Gift className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      <h2 className="text-3xl mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "GIFT GUIDE" : "Gift Guide"}
      </h2>
      <div className="space-y-4 text-left">
        {items.map(item => (
          <div key={item.id} className="p-4 rounded-xl border" style={{ borderColor: "var(--inv-accent)", opacity: 0.5 }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold" style={{ color: "var(--inv-text)" }}>{item.item_name}</p>
                {item.description && <p className="text-sm mt-1" style={{ color: "var(--inv-text-secondary)" }}>{item.description}</p>}
                {item.category && <span className="inline-block text-xs mt-2 px-2 py-0.5 rounded-full" style={{ background: "var(--inv-accent)", color: "var(--inv-secondary)" }}>{item.category}</span>}
              </div>
              {item.link_url && (
                <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-2 rounded-lg hover:opacity-70" style={{ color: "var(--inv-primary)" }}>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
