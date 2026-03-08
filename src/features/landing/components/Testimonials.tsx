import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    event: "Debut",
    quote: "LynxInvitation made my daughter's 18th birthday truly magical. The 18 Roses section was breathtaking and all our guests loved the interactive RSVP!",
    rating: 5,
    avatar: "MS",
  },
  {
    name: "James & Ana Cruz",
    event: "Wedding",
    quote: "Our wedding invitation was so elegant. Guests loved the countdown timer, gallery, and the seamless RSVP system. Worth every peso!",
    rating: 5,
    avatar: "JA",
  },
  {
    name: "Carlo Reyes",
    event: "Corporate",
    quote: "Professional and sleek — perfect for our company's annual gala. The analytics dashboard helped us track attendance in real-time.",
    rating: 5,
    avatar: "CR",
  },
  {
    name: "Sofia Mendoza",
    event: "Birthday",
    quote: "The story-style navigation made my birthday invitation feel like a beautiful journey. My friends couldn't stop talking about it!",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "Angela & Mark Tan",
    event: "Christening",
    quote: "Such a gentle and beautiful invitation for our baby's christening. The timeline feature was perfect for our ceremony schedule.",
    rating: 5,
    avatar: "AT",
  },
  {
    name: "Patricia Luna",
    event: "Debut",
    quote: "The customer portal let me manage my own guest list. So convenient! The password protection kept everything private until the big reveal.",
    rating: 5,
    avatar: "PL",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Loved by Clients</h2>
          <p className="text-muted-foreground max-w-md mx-auto">See what our customers have to say about their experience</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card p-5 sm:p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-foreground text-foreground" />
                ))}
              </div>
              <Quote className="h-5 w-5 text-muted-foreground/30 mb-3" />
              <p className="text-sm mb-6 leading-relaxed flex-1">{t.quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.event} Event</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
