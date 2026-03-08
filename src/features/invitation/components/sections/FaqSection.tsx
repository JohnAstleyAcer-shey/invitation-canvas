import { SectionWrapper } from "./SectionWrapper";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Tables } from "@/integrations/supabase/types";

type Faq = Tables<"faqs">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function FaqSection({ faqs, variant = "classic" }: { faqs: Faq[]; variant?: Variant }) {
  if (!faqs.length) return null;

  return (
    <SectionWrapper className="!overflow-y-auto">
      <HelpCircle className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      <h2 className="text-3xl mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "FAQ" : "Frequently Asked Questions"}
      </h2>
      <Accordion type="single" collapsible className="text-left">
        {faqs.map(faq => (
          <AccordionItem key={faq.id} value={faq.id} className="border-b" style={{ borderColor: "var(--inv-accent)" }}>
            <AccordionTrigger className="text-sm font-medium" style={{ color: "var(--inv-text)" }}>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm" style={{ color: "var(--inv-text-secondary)" }}>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionWrapper>
  );
}
