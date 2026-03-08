import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type TimelineEvent = Tables<"timeline_events">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function TimelineSection({ events, variant = "classic" }: { events: TimelineEvent[]; variant?: Variant }) {
  if (!events.length) return null;

  return (
    <SectionWrapper>
      <Clock className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      <h2 className="text-3xl mb-10" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "SCHEDULE" : "Event Timeline"}
      </h2>
      <div className="space-y-0 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "var(--inv-accent)", opacity: 0.3 }} />
        {events.map((ev, i) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative flex items-center gap-4 py-4 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"} text-${i % 2 === 0 ? "right" : "left"}`}
          >
            <div className="flex-1">
              {ev.event_time && <p className="text-sm font-medium mb-1" style={{ color: "var(--inv-accent)" }}>{ev.event_time}</p>}
              <p className="font-semibold" style={{ color: "var(--inv-text)" }}>{ev.title}</p>
              {ev.description && <p className="text-sm mt-1" style={{ color: "var(--inv-text-secondary)" }}>{ev.description}</p>}
            </div>
            <div className="w-3 h-3 rounded-full shrink-0 z-10" style={{ background: "var(--inv-primary)" }} />
            <div className="flex-1" />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
