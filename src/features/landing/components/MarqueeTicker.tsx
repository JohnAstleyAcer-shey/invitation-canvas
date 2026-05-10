import { motion } from "framer-motion";
import { Sparkles, Heart, Calendar, Crown, Cake, Building2, Gem, Baby, Star } from "lucide-react";

const ITEMS = [
  { icon: Sparkles,  text: "10,000+ invitations crafted" },
  { icon: Heart,     text: "Loved by 50,000+ guests" },
  { icon: Crown,     text: "Premium Debut collections" },
  { icon: Calendar,  text: "Delivered in 1–3 days" },
  { icon: Cake,      text: "Birthdays · Weddings · Christenings" },
  { icon: Building2, text: "Trusted by corporate galas" },
  { icon: Gem,       text: "Anniversaries that shine" },
  { icon: Baby,      text: "Baby showers, full of joy" },
  { icon: Star,      text: "4.9 average rating" },
];

function Row({ reverse = false, speed = 40 }: { reverse?: boolean; speed?: number }) {
  const items = [...ITEMS, ...ITEMS]; // duplicate for seamless loop
  return (
    <div className="overflow-hidden mask-fade-x py-3">
      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {items.map((it, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card/60 backdrop-blur-sm text-sm font-medium shrink-0"
          >
            <it.icon className="h-3.5 w-3.5 text-primary" />
            <span>{it.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function MarqueeTicker() {
  return (
    <section className="relative py-12 sm:py-16 border-y border-border/50 bg-secondary/20 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      <div className="relative">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live · Trusted across every celebration
          </span>
        </div>
        <Row speed={45} />
        <Row reverse speed={55} />
      </div>

      <style>{`
        .mask-fade-x {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
                  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }
      `}</style>
    </section>
  );
}
