import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Play, Star, Shield, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

const floatingCards = [
  { label: "🎂 Birthday", delay: 0, x: -140, y: -90 },
  { label: "💒 Wedding", delay: 0.2, x: 160, y: -70 },
  { label: "🎉 Debut", delay: 0.4, x: -180, y: 70 },
  { label: "👶 Christening", delay: 0.6, x: 200, y: 90 },
  { label: "🏢 Corporate", delay: 0.8, x: 0, y: 120 },
];

const trustBadges = [
  { icon: Shield, label: "SSL Secured" },
  { icon: Zap, label: "Instant Setup" },
  { icon: Clock, label: "24/7 Support" },
];

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const numericPart = parseInt(target.replace(/[^0-9]/g, ""));
  const prefix = target.replace(/[0-9.]+.*/, "");
  const textSuffix = target.replace(/^[0-9.]+/, "");

  useEffect(() => {
    let start = 0;
    const end = numericPart;
    const duration = 2000;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);
      setDisplay(`${prefix}${current.toLocaleString()}${textSuffix}`);
      if (progress >= 1) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [numericPart, prefix, textSuffix]);

  return <span>{display}{suffix}</span>;
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.02);
    mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.02);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated background with parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          style={{ x: useTransform(springX, v => -v * 1.5), y: useTransform(springY, v => -v * 1.5) }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/30 blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[100px]" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <motion.div style={{ opacity, scale }} className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-5 py-2 text-xs font-medium text-muted-foreground tracking-widest uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Digital Invitations
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] mb-6"
        >
          Digital Invitations
          <br />
          <span className="text-gradient bg-clip-text">— Reimagined</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground mb-8 font-body px-4"
        >
          Create stunning, interactive event invitations for Debuts, Weddings, Birthdays,
          Christenings, and Corporate events — in minutes, not hours.
        </motion.p>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center justify-center gap-4 sm:gap-6 mb-8 flex-wrap px-4"
        >
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-1.5 text-muted-foreground">
              <badge.icon className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Link to="/auth">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-base font-semibold group hover:bg-accent/50"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            See How It Works
          </Button>
        </motion.div>

        {/* Floating event cards - hidden on mobile */}
        <div className="hidden lg:block">
          {floatingCards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + card.delay }}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{ x: card.x, y: card.y }}
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4 + card.delay, repeat: Infinity, ease: "easeInOut" }}
                className="px-4 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg text-sm font-medium"
              >
                {card.label}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar with animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 sm:mt-20 flex flex-wrap justify-center gap-6 sm:gap-12 text-center px-4"
        >
          {[
            { value: "10000", display: "10K+", label: "Invitations Created" },
            { value: "50000", display: "50K+", label: "Guests Managed" },
            { value: "99.9", display: "99.9%", label: "Uptime" },
            { value: "4.9", display: "4.9★", label: "Rating" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="group cursor-default"
            >
              <p className="font-display text-xl sm:text-2xl font-black group-hover:scale-110 transition-transform">{stat.display}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          <div className="flex -space-x-2">
            {["MS", "JC", "CR", "SM", "AT"].map((initials, i) => (
              <motion.div
                key={initials}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.08 }}
                className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[9px] font-bold"
              >
                {initials}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-foreground text-foreground" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Loved by 10,000+ users</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-2.5 rounded-full bg-muted-foreground/50"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
