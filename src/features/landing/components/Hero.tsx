import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";

const trustBadges = ["SSL Secured", "Fully Managed", "1–3 Day Delivery"];

export function Hero() {
  return (
    <section className="relative min-h-[92dvh] flex items-center justify-center overflow-hidden pt-24 pb-20 border-b border-border">
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />

      <div className="w-full max-w-4xl mx-auto px-5 sm:px-6 relative z-10 text-center">
        {/* Editorial tag */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-block border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Premium Digital Invitations
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          Invitations,{" "}
          <span className="italic font-normal">beautifully crafted</span>.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground mb-10 leading-relaxed"
        >
          A fully managed studio for digital invitations — Weddings, Debuts, Birthdays,
          Christenings, and Corporate events. Designed, hosted, and delivered by our team.
        </motion.p>

        {/* CTAs — square, monochrome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
        >
          <button
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors"
          >
            View Packages <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center justify-center gap-2 border border-foreground text-foreground px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
          >
            <Play className="h-3.5 w-3.5" /> See How It Works
          </button>
        </motion.div>

        {/* Divider */}
        <div className="w-10 h-px bg-foreground/40 mx-auto mb-8" />

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center justify-center gap-x-8 gap-y-3 flex-wrap mb-8"
        >
          {trustBadges.map((label) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
            ))}
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Loved by <span className="font-bold text-foreground">300+</span> celebrations
          </span>
        </motion.div>
      </div>
    </section>
  );
}
