import { motion } from "framer-motion";
import { Flower2, Navigation, ClipboardCheck, Paintbrush, Users, CalendarDays } from "lucide-react";

const features = [
  { icon: Flower2, title: "18 Roses & Candles", description: "Beautiful presentation sections for Debut traditions with elegant layouts" },
  { icon: Navigation, title: "Story Navigation", description: "Full-screen swipeable story experience with smooth transitions" },
  { icon: ClipboardCheck, title: "RSVP Management", description: "Secure guest verification, attendance tracking, and dietary notes" },
  { icon: Paintbrush, title: "Custom Themes", description: "Colors, fonts, particles, glassmorphism, and page transitions" },
  { icon: Users, title: "Guest Portal", description: "Customer admin dashboards with real-time analytics and exports" },
  { icon: CalendarDays, title: "Multi-Event", description: "Support for Debut, Wedding, Birthday, Christening, and Corporate" },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Powerful features to create unforgettable digital invitations</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
