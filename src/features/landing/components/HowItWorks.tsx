import { motion } from "framer-motion";
import { PenLine, Palette, Share2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    title: "Create",
    description: "Choose your event type and fill in the details — name, date, venue, message.",
    color: "bg-primary/10",
  },
  {
    icon: Palette,
    title: "Customize",
    description: "Pick themes, colors, fonts, particles, music, and arrange your pages perfectly.",
    color: "bg-accent",
  },
  {
    icon: Share2,
    title: "Share",
    description: "Publish and share your invitation link — track RSVPs and views in real-time.",
    color: "bg-secondary",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Simple Process</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Three simple steps to create your perfect invitation</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative group"
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-full ${step.color} border border-border mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300`}>
                <step.icon className="h-7 w-7 sm:h-9 sm:w-9 text-foreground" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-xs font-bold text-muted-foreground bg-background px-3 py-0.5 rounded-full border border-border z-20">
                0{i + 1}
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm max-w-[260px] mx-auto">{step.description}</p>
              {i < 2 && (
                <ArrowRight className="hidden md:block absolute top-16 -right-4 h-5 w-5 text-muted-foreground/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
