import { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search, MessageCircle, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Tables } from "@/integrations/supabase/types";

type Faq = Tables<"faqs">;
type Variant = "classic" | "modern" | "elegant" | "bold";

function FaqItem({ faq, index }: { faq: Faq; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: -20 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, type: "spring", damping: 20 }}
    >
      <AccordionItem 
        value={faq.id} 
        className="border-b overflow-hidden"
        style={{ borderColor: "var(--inv-accent)" }}
      >
        <AccordionTrigger 
          className="text-xs sm:text-sm font-medium py-4 hover:no-underline group"
          style={{ color: "var(--inv-text)" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-start gap-3 text-left flex-1">
            <motion.div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "var(--inv-accent)" }}
              animate={isOpen ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
            >
              <span className="text-xs font-bold" style={{ color: "var(--inv-secondary)" }}>
                {index + 1}
              </span>
            </motion.div>
            <span className="flex-1 group-hover:text-opacity-80 transition-colors">
              {faq.question}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-xs sm:text-sm pb-4" style={{ color: "var(--inv-text-secondary)" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-9"
          >
            <div className="p-3 rounded-lg" style={{ background: "var(--inv-accent)" }}>
              {faq.answer}
            </div>
          </motion.div>
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
}

export function FaqSection({ faqs, variant = "classic" }: { faqs: Faq[]; variant?: Variant }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  if (!faqs.length) return null;

  // Group FAQs by category
  const categories = faqs.reduce((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, Faq[]>);

  // Filter FAQs based on search
  const filteredFaqs = searchTerm
    ? faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqs;

  const hasCategories = Object.keys(categories).length > 1;

  return (
    <SectionWrapper className="!overflow-y-auto">
      {/* Animated icon */}
      <motion.div 
        initial={{ scale: 0, rotate: -180 }} 
        whileInView={{ scale: 1, rotate: 0 }} 
        viewport={{ once: true }} 
        transition={{ type: "spring", damping: 15 }}
      >
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative"
        >
          <HelpCircle className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "var(--inv-primary)" }} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl mb-2" 
        style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
      >
        {variant === "bold" ? "FAQ" : "Frequently Asked Questions"}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-xs sm:text-sm mb-6 flex items-center justify-center gap-2"
        style={{ color: "var(--inv-text-secondary)" }}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        {faqs.length} question{faqs.length !== 1 ? "s" : ""} answered
      </motion.p>

      {/* Search box for many FAQs */}
      {faqs.length > 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative max-w-md mx-auto mb-6"
        >
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
            style={{ color: "var(--inv-text-secondary)" }} 
          />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
            style={{ 
              borderColor: "var(--inv-accent)", 
              color: "var(--inv-text)",
              background: "transparent"
            }}
          />
          {searchTerm && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "var(--inv-accent)", color: "var(--inv-text)" }}
            >
              ×
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Search results count */}
      {searchTerm && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs mb-4"
          style={{ color: "var(--inv-text-secondary)" }}
        >
          Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""}
        </motion.p>
      )}

      {/* FAQ list */}
      <div className="text-left max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible>
              {filteredFaqs.map((faq, i) => (
                <FaqItem key={faq.id} faq={faq} index={i} />
              ))}
            </Accordion>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: "var(--inv-text)" }} />
              <p className="text-sm" style={{ color: "var(--inv-text-secondary)" }}>
                No questions match your search.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-xs underline"
                style={{ color: "var(--inv-primary)" }}
              >
                Clear search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-xs" style={{ color: "var(--inv-text-secondary)" }}>
          Still have questions? Reach out to the host directly.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
