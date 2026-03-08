import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type TimelineEvent = Tables<"timeline_events">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function TimelineSection({ events, variant = "classic" }: { events: TimelineEvent[]; variant?: Variant }) {
  if (!events.length) return null;

  return (
    <SectionWrapper className="!overflow-y-auto">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
      >
        <Clock className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl sm:text-3xl mb-8 sm:mb-10"
        style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
      >
        {variant === "bold" ? "SCHEDULE" : "Event Timeline"}
      </motion.h2>
      <div className="space-y-0 relative max-w-md mx-auto">
        {/* Center line with animated reveal */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px origin-top"
          style={{ background: "var(--inv-accent)", opacity: 0.3 }}
        />
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="sm:hidden absolute left-4 top-0 bottom-0 w-px origin-top"
          style={{ background: "var(--inv-accent)", opacity: 0.3 }}
        />

        {events.map((ev, i) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative py-4"
          >
            {/* Mobile layout */}
            <div className="sm:hidden flex items-start gap-4 pl-8 text-left">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                className="absolute left-[13px] top-[22px] w-2.5 h-2.5 rounded-full z-10"
                style={{ background: "var(--inv-primary)" }}
              />
              <div>
                {ev.event_time && <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--inv-accent)" }}>{ev.event_time}</p>}
                <p className="font-semibold text-sm" style={{ color: "var(--inv-text)" }}>{ev.title}</p>
                {ev.description && <p className="text-xs mt-0.5" style={{ color: "var(--inv-text-secondary)" }}>{ev.description}</p>}
              </div>
            </div>

            {/* Desktop alternating layout */}
            <div className={`hidden sm:flex items-center gap-4 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
              <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                {ev.event_time && <p className="text-sm font-semibold mb-1" style={{ color: "var(--inv-accent)" }}>{ev.event_time}</p>}
                <p className="font-semibold" style={{ color: "var(--inv-text)" }}>{ev.title}</p>
                {ev.description && <p className="text-sm mt-1" style={{ color: "var(--inv-text-secondary)" }}>{ev.description}</p>}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                className="w-3 h-3 rounded-full shrink-0 z-10 shadow-[0_0_0_4px_var(--inv-secondary)]"
                style={{ background: "var(--inv-primary)" }}
              />
              <div className="flex-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
