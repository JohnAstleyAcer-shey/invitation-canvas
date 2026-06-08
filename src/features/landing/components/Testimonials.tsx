import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  { name: "Maria Santos", event: "Debut", quote: "LynxInvitation made my daughter's 18th birthday truly magical. The 18 Roses section was breathtaking!", rating: 5, avatar: "MS" },
  { name: "James & Ana Cruz", event: "Wedding", quote: "Our wedding invitation was so elegant. Guests loved the countdown timer, gallery, and RSVP. Worth every peso!", rating: 5, avatar: "JA" },
  { name: "Carlo Reyes", event: "Corporate", quote: "Professional and sleek — perfect for our annual gala. Analytics helped us track attendance in real-time.", rating: 5, avatar: "CR" },
  { name: "Sofia Mendoza", event: "Birthday", quote: "The story-style navigation made my birthday feel like a beautiful journey. My friends couldn't stop talking!", rating: 5, avatar: "SM" },
  { name: "Angela & Mark Tan", event: "Christening", quote: "Such a gentle and beautiful invitation for our baby's christening. The timeline was perfect.", rating: 5, avatar: "AT" },
  { name: "Patricia Luna", event: "Debut", quote: "The customer portal let me manage my own guest list. So convenient! Password protection kept everything private.", rating: 5, avatar: "PL" },
  { name: "David & Celine Lim", event: "Wedding", quote: "The block editor gave us complete creative control. Looked like it was designed by a professional agency.", rating: 5, avatar: "DL" },
  { name: "Rico Fernandez", event: "Corporate", quote: "Managing 500+ guests for our conference was seamless. Bulk import saved us hours of manual work.", rating: 5, avatar: "RF" },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="relative w-[340px] sm:w-[400px] shrink-0 bg-background border border-border p-7 flex flex-col">
      <Quote className="absolute top-5 right-5 h-5 w-5 text-foreground/15" strokeWidth={1.5} />
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: t.rating }).map((_, j) => (
          <Star key={j} className="h-3 w-3 fill-foreground text-foreground" />
        ))}
      </div>
      <p className="font-display text-base italic leading-relaxed flex-1 mb-6 text-foreground/90">
        "{t.quote}"
      </p>
      <div className="pt-4 border-t border-border flex items-center gap-3">
        <div className="w-9 h-9 border border-border flex items-center justify-center text-[10px] font-bold tracking-wider">
          {t.avatar}
        </div>
        <div>
          <p className="font-display font-bold text-sm">{t.name}</p>
          <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground mt-0.5">
            {t.event} · Client
          </p>
        </div>
      </div>
    </div>
  );
}

function TickerRow({ items, reverse = false, speed = 60 }: { items: typeof testimonials; reverse?: boolean; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden mask-fade-x py-2">
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((t, i) => <TestimonialCard key={i} t={t} />)}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const half = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, half);
  const row2 = testimonials.slice(half);

  return (
    <section className="py-24 sm:py-32 bg-background border-b border-border">
      <div ref={ref}>
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Loved by Clients
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
              Kind <span className="italic font-normal">Words</span>
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70">
                4.9 / 5 — From {testimonials.length}+ Reviews
              </span>
            </div>
            <div className="w-10 h-px bg-foreground mx-auto mt-5" />
          </motion.div>
        </div>

        <div className="space-y-4">
          <TickerRow items={row1} speed={55} />
          <TickerRow items={row2} reverse speed={65} />
        </div>

        <div className="section-container">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="border-y border-border py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-14 max-w-4xl mx-auto"
          >
            {["10,000+ Happy Clients", "300+ Celebrations", "4.9 Star Rating", "Lifetime Hosting"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70">{t}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        .mask-fade-x {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
                  mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
        }
      `}</style>
    </section>
  );
}
