import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Tables } from "@/integrations/supabase/types";

type Faq = Tables<"faqs">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function FaqSection({ faqs, variant = "classic" }: { faqs: Faq[]; variant?: Variant }) {
  if (!faqs.length) return null;

  return (
    <SectionWrapper className="!overflow-y-auto">
      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
        <HelpCircle className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "FAQ" : "Frequently Asked Questions"}
      </h2>
      <Accordion type="single" collapsible className="text-left max-w-lg mx-auto">
        {faqs.map((faq, i) => (
          <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <AccordionItem value={faq.id} className="border-b" style={{ borderColor: "var(--inv-accent)" }}>
              <AccordionTrigger className="text-xs sm:text-sm font-medium py-4" style={{ color: "var(--inv-text)" }}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm pb-4" style={{ color: "var(--inv-text-secondary)" }}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </SectionWrapper>
  );
}
