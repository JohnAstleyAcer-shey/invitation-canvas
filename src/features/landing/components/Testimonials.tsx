import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Star, MessageCircle, Sparkles, Heart } from "lucide-react";

const testimonials = [
  { name: "Maria Santos", event: "Debut", quote: "LynxInvitation made my daughter's 18th birthday truly magical. The 18 Roses section was breathtaking!", rating: 5, avatar: "MS", color: "from-pink-500/20 to-rose-500/20" },
  { name: "James & Ana Cruz", event: "Wedding", quote: "Our wedding invitation was so elegant. Guests loved the countdown timer, gallery, and RSVP. Worth every peso!", rating: 5, avatar: "JA", color: "from-purple-500/20 to-violet-500/20" },
  { name: "Carlo Reyes", event: "Corporate", quote: "Professional and sleek — perfect for our annual gala. Analytics helped us track attendance in real-time.", rating: 5, avatar: "CR", color: "from-blue-500/20 to-indigo-500/20" },
  { name: "Sofia Mendoza", event: "Birthday", quote: "The story-style navigation made my birthday feel like a beautiful journey. My friends couldn't stop talking!", rating: 5, avatar: "SM", color: "from-amber-500/20 to-orange-500/20" },
  { name: "Angela & Mark Tan", event: "Christening", quote: "Such a gentle and beautiful invitation for our baby's christening. The timeline was perfect.", rating: 5, avatar: "AT", color: "from-teal-500/20 to-cyan-500/20" },
  { name: "Patricia Luna", event: "Debut", quote: "The customer portal let me manage my own guest list. So convenient! Password protection kept everything private.", rating: 5, avatar: "PL", color: "from-fuchsia-500/20 to-pink-500/20" },
  { name: "David & Celine Lim", event: "Wedding", quote: "The block editor gave us complete creative control. Looked like it was designed by a professional agency.", rating: 5, avatar: "DL", color: "from-green-500/20 to-emerald-500/20" },
  { name: "Rico Fernandez", event: "Corporate", quote: "Managing 500+ guests for our conference was seamless. Bulk import saved us hours of manual work.", rating: 5, avatar: "RF", color: "from-red-500/20 to-rose-500/20" },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="relative w-[340px] sm:w-[400px] shrink-0 glass-card p-5 sm:p-6 flex flex-col overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-30`} />
      <div className="relative flex gap-0.5 mb-3">
        {Array.from({ length: t.rating }).map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-foreground text-foreground" />
        ))}
      </div>
      <Quote className="relative h-5 w-5 text-muted-foreground/30 mb-2" />
      <p className="relative text-sm mb-5 leading-relaxed flex-1 line-clamp-4">"{t.quote}"</p>
      <div className="relative flex items-center gap-3 pt-3 border-t border-border">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold`}>
          {t.avatar}
        </div>
        <div>
          <p className="font-display font-semibold text-sm">{t.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Heart className="h-3 w-3" /> {t.event} Event
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
        className="flex gap-5 w-max"
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
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative" ref={ref}>
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-4 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <MessageCircle className="h-3 w-3" /> Live · Testimonials
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Loved by Clients
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />)}
              </div>
              <span className="text-sm font-bold">4.9/5</span>
              <span className="text-xs text-muted-foreground">from {testimonials.length}+ reviews</span>
            </div>
          </motion.div>
        </div>

        {/* Marquee rows — full bleed */}
        <div className="space-y-4">
          <TickerRow items={row1} speed={55} />
          <TickerRow items={row2} reverse speed={65} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-accent/50 border border-border/50">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">
              <span className="font-semibold">10,000+</span> happy customers and counting
            </span>
          </div>
        </motion.div>
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
