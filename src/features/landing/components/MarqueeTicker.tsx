import { motion } from "framer-motion";

const ITEMS = [
  "327 Invitations Crafted",
  "Loved by 18,000+ Guests",
  "Premium Debut Collections",
  "Delivered in 1–3 Days",
  "Weddings · Christenings · Birthdays",
  "Trusted by Corporate Galas",
  "Anniversaries · Vow Renewals",
  "Baby Showers · Christenings",
  "4.9 ★ Average Rating",
];

function Row({ reverse = false, speed = 50 }: { reverse?: boolean; speed?: number }) {
  const items = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden py-1">
      <motion.div
        className="flex items-center gap-12 whitespace-nowrap"
        animate={{ x: reverse ? ["-33.333%", "0%"] : ["0%", "-33.333%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-12 shrink-0">
            <span className="font-display text-2xl sm:text-3xl italic font-normal whitespace-nowrap">{it}</span>
            <span className="text-foreground/30">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function MarqueeTicker() {
  return (
    <section className="relative py-10 sm:py-12 border-b border-border bg-background overflow-hidden">
      <Row speed={60} />
    </section>
  );
}
