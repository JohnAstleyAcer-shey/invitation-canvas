import { motion } from "framer-motion";
import { PenLine, Palette, Share2, ArrowRight, Check, Sparkles } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    title: "Tell Us About Your Event",
    description: "Share your event details — name, date, venue, photos, and message — through a quick chat with our team.",
    color: "bg-primary/10",
    highlights: ["Weddings, Debuts, Birthdays & more", "Personal consultation", "Bring your vision"],
  },
  {
    icon: Palette,
    title: "We Design It For You",
    description: "Our designers craft a one-of-a-kind interactive invitation tailored to your theme — fully managed, no DIY required.",
    color: "bg-accent",
    highlights: ["Premium design", "Custom themes & music", "Pixel-perfect on every device"],
  },
  {
    icon: Share2,
    title: "Share With Your Guests",
    description: "Receive your unique invitation link and a private Customer Admin portal to track RSVPs and guest reactions in real time.",
    color: "bg-secondary",
    highlights: ["One-click sharing", "Real-time RSVP tracking", "Customer Admin portal"],
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
          <p className="text-muted-foreground max-w-md mx-auto">Three simple steps to create your perfect invitation — no design skills needed</p>
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
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`inline-flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-full ${step.color} border border-border mb-6 relative z-10 transition-shadow duration-300 group-hover:shadow-xl`}
              >
                <step.icon className="h-7 w-7 sm:h-9 sm:w-9 text-foreground" />
              </motion.div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-xs font-bold text-muted-foreground bg-background px-3 py-0.5 rounded-full border border-border z-20">
                0{i + 1}
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm max-w-[260px] mx-auto mb-4">{step.description}</p>
              
              {/* Highlights */}
              <div className="flex flex-col items-center gap-1.5">
                {step.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-foreground" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {i < 2 && (
                <ArrowRight className="hidden md:block absolute top-16 -right-4 h-5 w-5 text-muted-foreground/30" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-border text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Average setup time: <strong className="text-foreground">under 5 minutes</strong></span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
