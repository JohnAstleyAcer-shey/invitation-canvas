import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const floatingCards = [
  { label: "🎂 Birthday", delay: 0, x: -120, y: -80 },
  { label: "💒 Wedding", delay: 0.2, x: 140, y: -60 },
  { label: "🎉 Debut", delay: 0.4, x: -160, y: 60 },
  { label: "👶 Christening", delay: 0.6, x: 180, y: 80 },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/30 blur-3xl" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <motion.div style={{ opacity }} className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-5 py-2 text-xs font-medium text-muted-foreground tracking-widest uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Digital Invitations
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
          <span className="text-gradient">— Reimagined</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground mb-10 font-body px-4"
        >
          Create stunning, interactive event invitations for Debuts, Weddings, Birthdays,
          Christenings, and Corporate events — in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow">
            <Link to="/auth">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-base font-semibold group"
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
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + card.delay, repeat: Infinity, ease: "easeInOut" }}
                className="px-4 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg text-sm font-medium"
              >
                {card.label}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 sm:mt-20 flex flex-wrap justify-center gap-6 sm:gap-12 text-center px-4"
        >
          {[
            { value: "10K+", label: "Invitations Created" },
            { value: "50K+", label: "Guests Managed" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-xl sm:text-2xl font-black">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
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
          <div className="w-1.5 h-2.5 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
