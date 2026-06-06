import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Star, Shield, Zap, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustBadges = [
  { icon: Shield, label: "SSL Secured" },
  { icon: Zap, label: "Fully Managed" },
  { icon: Clock, label: "1–3 Day Delivery" },
];

export function Hero() {
  return (
    <section className="relative min-h-[92dvh] flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-grid opacity-[0.06]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-4 py-1.5 text-[11px] font-semibold text-muted-foreground tracking-[0.2em] uppercase">
            <Sparkles className="h-3 w-3" />
            Premium Digital Invitations
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6"
        >
          Invitations,{" "}
          <span className="text-gradient italic">beautifully crafted</span>.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground mb-9 leading-relaxed"
        >
          A fully managed studio for digital invitations — Weddings, Debuts, Birthdays,
          Christenings, and Corporate events. Designed, hosted, and delivered by our team.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
        >
          <Button
            size="lg"
            className="rounded-full px-8 text-base font-semibold shadow-lg hover:shadow-xl"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Packages
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-base font-semibold"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Play className="mr-2 h-4 w-4" /> See How It Works
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center justify-center gap-5 sm:gap-7 flex-wrap mb-8"
        >
          {trustBadges.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <b.icon className="h-3.5 w-3.5" />
              <span className="font-medium">{b.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <div className="flex -space-x-2">
            {["MS", "JC", "CR", "SM", "AT"].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] font-bold"
              >
                {i}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              Loved by <span className="font-semibold text-foreground">300+</span> celebrations
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
