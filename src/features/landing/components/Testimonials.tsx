import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    event: "Debut",
    quote: "LynxInvitation made my daughter's 18th birthday truly magical. The 18 Roses section was breathtaking!",
  },
  {
    name: "James & Ana Cruz",
    event: "Wedding",
    quote: "Our wedding invitation was so elegant. Guests loved the RSVP system and countdown timer.",
  },
  {
    name: "Carlo Reyes",
    event: "Corporate",
    quote: "Professional and sleek. Perfect for our company's annual gala. The analytics were invaluable.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Loved by Clients</h2>
          <p className="text-muted-foreground max-w-md mx-auto">See what our customers have to say</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <Quote className="h-6 w-6 text-muted-foreground/40 mb-4" />
              <p className="text-sm mb-6 leading-relaxed">{t.quote}</p>
              <div>
                <p className="font-display font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.event} Event</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
