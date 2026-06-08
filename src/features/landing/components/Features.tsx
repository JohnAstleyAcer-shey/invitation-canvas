import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Flower2, Navigation, ClipboardCheck, Paintbrush, Users, CalendarDays,
  Music, Shield, BarChart3, Globe, Zap, Layers, Lock,
  MessageSquare, Camera, Palette, Timer, Gift, MapPin, Sparkles,
  ArrowRight,
} from "lucide-react";

const categories = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "management", label: "Management" },
  { id: "engagement", label: "Engagement" },
  { id: "security", label: "Security" },
];

const features = [
  { icon: Flower2, title: "18 Roses & Candles", description: "Beautiful presentation sections for Debut traditions with elegant layouts and person photos.", category: "design", isNew: false },
  { icon: Navigation, title: "Story Navigation", description: "Full-screen swipeable story experience with smooth transitions and progress indicators.", category: "engagement", isNew: false },
  { icon: ClipboardCheck, title: "RSVP Management", description: "Secure guest verification, attendance tracking, dietary notes, and companion management.", category: "management", isNew: false },
  { icon: Paintbrush, title: "Custom Themes", description: "Colors, fonts, particles, glassmorphism, page transitions, and multiple style variants.", category: "design", isNew: false },
  { icon: Users, title: "Guest Portal", description: "Customer admin dashboards with real-time analytics, message walls, and guest exports.", category: "management", isNew: true },
  { icon: CalendarDays, title: "Multi-Event Support", description: "Debut, Wedding, Birthday, Christening, and Corporate — each with tailored sections.", category: "management", isNew: false },
  { icon: Music, title: "Background Music", description: "Add ambient music with autoplay, loop, and volume controls for immersive experiences.", category: "engagement", isNew: false },
  { icon: Shield, title: "Password Protection", description: "Secure your invitations with password gates for private events.", category: "security", isNew: false },
  { icon: BarChart3, title: "Real-Time Analytics", description: "Track views, RSVPs, device types, and conversion rates with live dashboards.", category: "management", isNew: true },
  { icon: Globe, title: "Shareable Links", description: "Custom slugs, social sharing, QR codes, and clipboard copy — easy distribution.", category: "engagement", isNew: false },
  { icon: Zap, title: "Block Editor", description: "Drag-and-drop block-based editor with 30+ block types and live preview.", category: "design", isNew: true },
  { icon: Layers, title: "Template Library", description: "Pre-built templates for every event type — get started in seconds.", category: "design", isNew: true },
  { icon: Lock, title: "Secure Data", description: "Enterprise-grade encryption and row-level security for all your invitation data.", category: "security", isNew: false },
  { icon: MessageSquare, title: "Guest Messages", description: "Collect heartfelt messages from guests with approval moderation workflow.", category: "engagement", isNew: false },
  { icon: Camera, title: "Photo Gallery", description: "Beautiful masonry and lightbox gallery with caption support and lazy loading.", category: "design", isNew: false },
  { icon: Palette, title: "Style Variants", description: "Four distinct design themes per section: Classic, Modern, Elegant, and Bold.", category: "design", isNew: false },
  { icon: Timer, title: "Live Countdown", description: "Animated countdown timers with flip-clock and spring effects for your event date.", category: "engagement", isNew: false },
  { icon: Gift, title: "Gift Guide", description: "Curated gift registry with links, categories, and descriptions for your guests.", category: "engagement", isNew: false },
  { icon: MapPin, title: "Venue Maps", description: "Embedded venue maps with directions, address, and one-click navigation links.", category: "engagement", isNew: false },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-background border border-border p-7 hover:border-foreground transition-colors duration-300 group flex flex-col"
    >
      {feature.isNew && (
        <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-[0.2em] text-foreground border border-foreground px-2 py-0.5">
          New
        </span>
      )}

      <div className="w-11 h-11 border border-border flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-background transition-colors">
        <feature.icon className="h-4 w-4" strokeWidth={1.5} />
      </div>

      <h3 className="font-display text-xl font-bold italic mb-2">
        {feature.title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
        {feature.description}
      </p>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {feature.category}
        </span>
        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
      </div>
    </motion.div>
  );
}

export function Features() {
  const [activeCategory, setActiveCategory] = useState("all");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filtered = activeCategory === "all"
    ? features
    : features.filter(f => f.category === activeCategory);

  return (
    <section id="features" className="py-24 sm:py-32 bg-background border-b border-border">
      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Powerful Features
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Everything You <span className="italic font-normal">Need</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Powerful features to create unforgettable digital invitations — no code required.
          </p>
        </motion.div>

        {/* Category filter — editorial pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center border-y border-border mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-4 text-[10px] font-bold uppercase tracking-[0.25em] border-r border-border last:border-r-0 transition-colors ${
                activeCategory === cat.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Ready to begin? Tell us about your event — we'll handle the rest.
          </p>
          <a
            href="mailto:support@lynxinvitation.com?subject=I'd like to order an invitation"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" /> Inquire Now <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
