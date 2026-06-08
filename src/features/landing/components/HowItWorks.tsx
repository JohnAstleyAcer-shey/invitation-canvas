import { motion } from "framer-motion";
import { PenLine, Palette, Share2 } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    title: "Tell Us About Your Event",
    description: "Share your event details — name, date, venue, photos, and message — through a quick chat with our team.",
    highlights: ["Weddings, Debuts, Birthdays & more", "Personal consultation", "Bring your vision"],
  },
  {
    icon: Palette,
    title: "We Design It For You",
    description: "Our designers craft a one-of-a-kind interactive invitation tailored to your theme — fully managed, no DIY required.",
    highlights: ["Premium design", "Custom themes & music", "Pixel-perfect on every device"],
  },
  {
    icon: Share2,
    title: "Share With Your Guests",
    description: "Receive your unique invitation link and a private Customer Admin portal to track RSVPs and guest reactions in real time.",
    highlights: ["One-click sharing", "Real-time RSVP tracking", "Customer Admin portal"],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-background border-b border-border">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Simple Process
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            How It <span className="italic font-normal">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            A fully managed service — three considered steps from your idea to a live, shareable invitation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-border border border-border max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background p-10 group"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-display text-5xl font-bold italic text-foreground/15">
                  0{i + 1}
                </span>
                <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  <step.icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="font-display text-2xl font-bold italic mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {step.description}
              </p>
              <div className="pt-6 border-t border-border space-y-2">
                {step.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2 text-xs text-foreground/70">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-y border-border py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-16 max-w-3xl mx-auto"
        >
          <span className="w-1 h-1 rounded-full bg-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70">
            Average Setup Time — Under 5 Minutes
          </span>
          <span className="w-1 h-1 rounded-full bg-foreground" />
        </motion.div>
      </div>
    </section>
  );
}
