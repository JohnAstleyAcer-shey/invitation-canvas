import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flower2, Navigation, ClipboardCheck, Paintbrush, Users, CalendarDays,
  Music, Shield, Smartphone, BarChart3, Globe, Zap, Layers, Lock,
  MessageSquare, Camera, Palette, Timer, Gift, MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "management", label: "Management" },
  { id: "engagement", label: "Engagement" },
  { id: "security", label: "Security" },
];

const features = [
  { icon: Flower2, title: "18 Roses & Candles", description: "Beautiful presentation sections for Debut traditions with elegant layouts and person photos", category: "design", isNew: false },
  { icon: Navigation, title: "Story Navigation", description: "Full-screen swipeable story experience with smooth transitions and progress indicators", category: "engagement", isNew: false },
  { icon: ClipboardCheck, title: "RSVP Management", description: "Secure guest verification, attendance tracking, dietary notes, and companion management", category: "management", isNew: false },
  { icon: Paintbrush, title: "Custom Themes", description: "Colors, fonts, particles, glassmorphism, page transitions, and multiple style variants", category: "design", isNew: false },
  { icon: Users, title: "Guest Portal", description: "Customer admin dashboards with real-time analytics, message walls, and guest exports", category: "management", isNew: true },
  { icon: CalendarDays, title: "Multi-Event Support", description: "Debut, Wedding, Birthday, Christening, and Corporate — each with tailored sections", category: "management", isNew: false },
  { icon: Music, title: "Background Music", description: "Add ambient music with autoplay, loop, and volume controls for immersive experiences", category: "engagement", isNew: false },
  { icon: Shield, title: "Password Protection", description: "Secure your invitations with password gates for private events", category: "security", isNew: false },
  { icon: Smartphone, title: "Mobile-First Design", description: "Pixel-perfect responsive layouts that look stunning on every screen size", category: "design", isNew: false },
  { icon: BarChart3, title: "Real-Time Analytics", description: "Track views, RSVPs, device types, and conversion rates with live dashboards", category: "management", isNew: true },
  { icon: Globe, title: "Shareable Links", description: "Custom slugs, social sharing, QR codes, and clipboard copy — easy distribution", category: "engagement", isNew: false },
  { icon: Zap, title: "Block Editor", description: "Drag-and-drop block-based editor with 30+ block types and live preview", category: "design", isNew: true },
  { icon: Layers, title: "Template Library", description: "Pre-built templates for every event type — get started in seconds", category: "design", isNew: true },
  { icon: Lock, title: "Secure Data", description: "Enterprise-grade encryption and row-level security for all your invitation data", category: "security", isNew: false },
  { icon: MessageSquare, title: "Guest Messages", description: "Collect heartfelt messages from guests with approval moderation workflow", category: "engagement", isNew: false },
  { icon: Camera, title: "Photo Gallery", description: "Beautiful masonry and lightbox gallery with caption support and lazy loading", category: "design", isNew: false },
  { icon: Palette, title: "Style Variants", description: "Four distinct design themes per section: Classic, Modern, Elegant, and Bold", category: "design", isNew: false },
  { icon: Timer, title: "Live Countdown", description: "Animated countdown timers with flip-clock and spring effects for your event date", category: "engagement", isNew: false },
  { icon: Gift, title: "Gift Guide", description: "Curated gift registry with links, categories, and descriptions for your guests", category: "engagement", isNew: false },
  { icon: MapPin, title: "Venue Maps", description: "Embedded venue maps with directions, address, and one-click navigation links", category: "engagement", isNew: false },
];

export function Features() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? features
    : features.filter(f => f.category === activeCategory);

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

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="feature-tab"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Feature count */}
        <p className="text-xs text-muted-foreground text-center mb-6">{filtered.length} features</p>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((feature, i) => (
              <motion.div
                key={feature.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="glass-card p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative"
              >
                {feature.isNew && (
                  <Badge className="absolute top-3 right-3 text-[9px]">New</Badge>
                )}
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <feature.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
