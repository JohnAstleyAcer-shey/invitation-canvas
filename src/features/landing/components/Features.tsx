import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Flower2, Navigation, ClipboardCheck, Paintbrush, Users, CalendarDays,
  Music, Shield, Smartphone, BarChart3, Globe, Zap, Layers, Lock,
  MessageSquare, Camera, Palette, Timer, Gift, MapPin, Sparkles,
  CheckCircle2, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "design", label: "Design", icon: Paintbrush },
  { id: "management", label: "Management", icon: Users },
  { id: "engagement", label: "Engagement", icon: MessageSquare },
  { id: "security", label: "Security", icon: Shield },
];

const features = [
  { icon: Flower2, title: "18 Roses & Candles", description: "Beautiful presentation sections for Debut traditions with elegant layouts and person photos", category: "design", isNew: false, color: "from-pink-500/20 to-rose-500/20" },
  { icon: Navigation, title: "Story Navigation", description: "Full-screen swipeable story experience with smooth transitions and progress indicators", category: "engagement", isNew: false, color: "from-blue-500/20 to-cyan-500/20" },
  { icon: ClipboardCheck, title: "RSVP Management", description: "Secure guest verification, attendance tracking, dietary notes, and companion management", category: "management", isNew: false, color: "from-green-500/20 to-emerald-500/20" },
  { icon: Paintbrush, title: "Custom Themes", description: "Colors, fonts, particles, glassmorphism, page transitions, and multiple style variants", category: "design", isNew: false, color: "from-purple-500/20 to-violet-500/20" },
  { icon: Users, title: "Guest Portal", description: "Customer admin dashboards with real-time analytics, message walls, and guest exports", category: "management", isNew: true, color: "from-amber-500/20 to-orange-500/20" },
  { icon: CalendarDays, title: "Multi-Event Support", description: "Debut, Wedding, Birthday, Christening, and Corporate — each with tailored sections", category: "management", isNew: false, color: "from-red-500/20 to-pink-500/20" },
  { icon: Music, title: "Background Music", description: "Add ambient music with autoplay, loop, and volume controls for immersive experiences", category: "engagement", isNew: false, color: "from-indigo-500/20 to-purple-500/20" },
  { icon: Shield, title: "Password Protection", description: "Secure your invitations with password gates for private events", category: "security", isNew: false, color: "from-slate-500/20 to-gray-500/20" },
  { icon: Smartphone, title: "Mobile-First Design", description: "Pixel-perfect responsive layouts that look stunning on every screen size", category: "design", isNew: false, color: "from-teal-500/20 to-cyan-500/20" },
  { icon: BarChart3, title: "Real-Time Analytics", description: "Track views, RSVPs, device types, and conversion rates with live dashboards", category: "management", isNew: true, color: "from-blue-500/20 to-indigo-500/20" },
  { icon: Globe, title: "Shareable Links", description: "Custom slugs, social sharing, QR codes, and clipboard copy — easy distribution", category: "engagement", isNew: false, color: "from-green-500/20 to-teal-500/20" },
  { icon: Zap, title: "Block Editor", description: "Drag-and-drop block-based editor with 30+ block types and live preview", category: "design", isNew: true, color: "from-yellow-500/20 to-amber-500/20" },
  { icon: Layers, title: "Template Library", description: "Pre-built templates for every event type — get started in seconds", category: "design", isNew: true, color: "from-violet-500/20 to-purple-500/20" },
  { icon: Lock, title: "Secure Data", description: "Enterprise-grade encryption and row-level security for all your invitation data", category: "security", isNew: false, color: "from-gray-500/20 to-slate-500/20" },
  { icon: MessageSquare, title: "Guest Messages", description: "Collect heartfelt messages from guests with approval moderation workflow", category: "engagement", isNew: false, color: "from-pink-500/20 to-fuchsia-500/20" },
  { icon: Camera, title: "Photo Gallery", description: "Beautiful masonry and lightbox gallery with caption support and lazy loading", category: "design", isNew: false, color: "from-cyan-500/20 to-blue-500/20" },
  { icon: Palette, title: "Style Variants", description: "Four distinct design themes per section: Classic, Modern, Elegant, and Bold", category: "design", isNew: false, color: "from-fuchsia-500/20 to-pink-500/20" },
  { icon: Timer, title: "Live Countdown", description: "Animated countdown timers with flip-clock and spring effects for your event date", category: "engagement", isNew: false, color: "from-orange-500/20 to-red-500/20" },
  { icon: Gift, title: "Gift Guide", description: "Curated gift registry with links, categories, and descriptions for your guests", category: "engagement", isNew: false, color: "from-emerald-500/20 to-green-500/20" },
  { icon: MapPin, title: "Venue Maps", description: "Embedded venue maps with directions, address, and one-click navigation links", category: "engagement", isNew: false, color: "from-rose-500/20 to-red-500/20" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 }
  }
};

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      variants={itemVariants}
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card p-5 sm:p-6 hover:shadow-lg transition-all duration-500 group relative overflow-hidden"
    >
      {/* Background gradient on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      
      {/* New badge */}
      {feature.isNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: index * 0.05 }}
        >
          <Badge className="absolute top-3 right-3 text-[9px] animate-pulse">New</Badge>
        </motion.div>
      )}
      
      {/* Icon */}
      <motion.div 
        className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300"
        animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <feature.icon className="h-5 w-5 text-foreground transition-transform group-hover:scale-110" />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      
      {/* Content */}
      <div className="relative">
        <h3 className="font-display text-base sm:text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Hover arrow */}
      <motion.div
        className="absolute bottom-4 right-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight className="h-4 w-4 text-primary" />
      </motion.div>
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
    <section id="features" className="py-20 sm:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/2 -right-1/2 w-full h-full border border-border/10 rounded-full"
      />
      
      <div className="section-container relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Powerful Features
          </motion.span>
          <motion.h2 
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Everything You Need
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Powerful features to create unforgettable digital invitations — no code required
          </motion.p>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
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
              <cat.icon className="h-3.5 w-3.5 relative z-10" />
              <span className="relative z-10">{cat.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Feature count with animation */}
        <motion.p 
          className="text-xs text-muted-foreground text-center mb-6"
          key={filtered.length}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
        >
          {filtered.length} feature{filtered.length !== 1 ? "s" : ""}
        </motion.p>

        {/* Feature grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-display font-semibold">Ready to get started?</p>
                <p className="text-sm text-muted-foreground">Tell us about your event — we'll handle the rest</p>
              </div>
            </div>
            <Button asChild className="rounded-full shadow-md">
              <a href="mailto:support@lynxinvitation.com?subject=I'd like to order an invitation">
                Inquire Now <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
