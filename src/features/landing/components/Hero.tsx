import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Play, Star, Shield, Zap, Clock, CheckCircle2, Users, Calendar, TrendingUp, Award } from "lucide-react";
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

const stats = [
  { value: 10000, suffix: "+", label: "Invitations Created", icon: Calendar },
  { value: 50000, suffix: "+", label: "Guests Managed", icon: Users },
  { value: 99.9, suffix: "%", label: "Uptime", icon: TrendingUp },
  { value: 4.9, suffix: "★", label: "Rating", icon: Award },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target * 10) / 10);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  const displayValue = Number.isInteger(target) 
    ? Math.floor(count).toLocaleString() 
    : count.toFixed(1);

  return <span ref={ref}>{displayValue}{suffix}</span>;
}

function FloatingParticle({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/10"
      style={{ width: size, height: size, left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0.5],
        y: [0, -100, -200]
      }}
      transition={{ 
        delay,
        duration: 4,
        repeat: Infinity,
        ease: "easeOut"
      }}
    />
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

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

  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Reimagined", "Simplified", "Perfected", "Elevated"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated background with parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        {/* Animated gradient orbs */}
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/30 blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-border/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-border/10"
        />
        
        {/* Floating particles */}
        <FloatingParticle delay={0} size={8} x="20%" y="30%" />
        <FloatingParticle delay={0.5} size={6} x="80%" y="40%" />
        <FloatingParticle delay={1} size={10} x="60%" y="70%" />
        <FloatingParticle delay={1.5} size={5} x="30%" y="60%" />
        <FloatingParticle delay={2} size={7} x="70%" y="20%" />
      </motion.div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <motion.div style={{ opacity, scale }} className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
        {/* Badge with animated border */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <motion.span 
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-5 py-2 text-xs font-medium text-muted-foreground tracking-widest uppercase relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <Sparkles className="h-3.5 w-3.5" />
            <span className="relative">Premium Digital Invitations</span>
            <motion.span 
              className="w-1.5 h-1.5 rounded-full bg-green-500"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.span>
        </motion.div>

        {/* Main heading with word animation */}
        <motion.div style={{ y: textY }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] mb-6"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Digital Invitations
            </motion.span>
            <br />
            <span className="relative inline-block">
              <span className="text-gradient">— </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.5 }}
                  className="text-gradient inline-block"
                >
                  {words[currentWord]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>
        </motion.div>

        {/* Description with character animation */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground mb-8 font-body px-4"
        >
          Create stunning, interactive event invitations for Debuts, Weddings, Birthdays,
          Christenings, and Corporate events — in minutes, not hours.
        </motion.p>

        {/* Trust badges with stagger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center justify-center gap-4 sm:gap-6 mb-8 flex-wrap px-4"
        >
          {trustBadges.map((badge, i) => (
            <motion.div 
              key={badge.label} 
              className="flex items-center gap-1.5 text-muted-foreground group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <badge.icon className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
              </motion.div>
              <span className="text-xs font-medium">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons - showcase focused */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
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
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              className="rounded-full px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Packages
              <motion.span
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating event cards - hidden on mobile */}
        <div className="hidden lg:block">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + card.delay }}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{ x: card.x, y: card.y }}
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0], 
                  rotate: [0, 2, -2, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 4 + card.delay, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg text-sm font-medium cursor-pointer pointer-events-auto"
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
          className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto px-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group cursor-default text-center"
            >
              <motion.div
                className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
              <p className="font-display text-xl sm:text-2xl font-black group-hover:text-primary transition-colors">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof with avatar stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <div className="flex -space-x-2">
            {["MS", "JC", "CR", "SM", "AT"].map((initials, i) => (
              <motion.div
                key={initials}
                initial={{ opacity: 0, scale: 0, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.3 + i * 0.08, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {initials}
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + i * 0.05, type: "spring" }}
                >
                  <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                </motion.div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              Loved by <span className="font-semibold text-foreground">10,000+</span> users
            </span>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3 px-4"
        >
          {["Fully Managed Service", "Premium Quality", "Setup in 2 Minutes"].map((text, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + i * 0.1 }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-2.5 rounded-full bg-muted-foreground/50"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
