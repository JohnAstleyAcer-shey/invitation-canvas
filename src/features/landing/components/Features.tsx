import { motion } from "framer-motion";
import { Flower2, Navigation, ClipboardCheck, Paintbrush, Users, CalendarDays, Music, Shield, Smartphone, BarChart3, Globe, Zap } from "lucide-react";

const features = [
  { icon: Flower2, title: "18 Roses & Candles", description: "Beautiful presentation sections for Debut traditions with elegant layouts and person photos" },
  { icon: Navigation, title: "Story Navigation", description: "Full-screen swipeable story experience with smooth transitions and progress indicators" },
  { icon: ClipboardCheck, title: "RSVP Management", description: "Secure guest verification, attendance tracking, dietary notes, and companion management" },
  { icon: Paintbrush, title: "Custom Themes", description: "Colors, fonts, particles, glassmorphism, page transitions, and multiple style variants" },
  { icon: Users, title: "Guest Portal", description: "Customer admin dashboards with real-time analytics, message walls, and guest exports" },
  { icon: CalendarDays, title: "Multi-Event Support", description: "Debut, Wedding, Birthday, Christening, and Corporate — each with tailored sections" },
  { icon: Music, title: "Background Music", description: "Add ambient music with autoplay, loop, and volume controls for immersive experiences" },
  { icon: Shield, title: "Password Protection", description: "Secure your invitations with password gates for private events" },
  { icon: Smartphone, title: "Mobile-First Design", description: "Pixel-perfect responsive layouts that look stunning on every screen size" },
  { icon: BarChart3, title: "Real-Time Analytics", description: "Track views, RSVPs, device types, and conversion rates with live dashboards" },
  { icon: Globe, title: "Shareable Links", description: "Custom slugs, social sharing, QR codes, and clipboard copy — easy distribution" },
  { icon: Zap, title: "Block Editor", description: "Drag-and-drop block-based editor with 30+ block types and live preview" },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Powerful Features</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Powerful features to create unforgettable digital invitations — no code required</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-display text-base sm:text-lg font-semibold mb-1.5">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
