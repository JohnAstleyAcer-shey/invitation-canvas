import { motion } from "framer-motion";
import { PenLine, Palette, Share2 } from "lucide-react";

const steps = [
  { icon: PenLine, title: "Create", description: "Choose your event type and fill in the details" },
  { icon: Palette, title: "Customize", description: "Pick themes, colors, fonts, and add content" },
  { icon: Share2, title: "Share", description: "Publish and share your invitation with guests" },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Three simple steps to create your perfect invitation</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary border border-border mb-6 relative z-10">
                <step.icon className="h-8 w-8 text-foreground" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-xs font-bold text-muted-foreground bg-background px-2">
                0{i + 1}
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
