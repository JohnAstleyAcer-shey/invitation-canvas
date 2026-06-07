import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, LayoutGroup } from "framer-motion";
import { Check, Star, Zap, HelpCircle, X, Sparkles, ArrowRight, Shield, Clock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Pkg = {
  name: string;
  type: string;
  price: string;
  originalPrice: string;
  popular: boolean;
  description: string;
  tagline: string;
  accent: string;
  icon: typeof Sparkles;
  features: string[];
  videoFeatures?: string[];
};

const packages: Pkg[] = [
  {
    name: "Serenity",
    type: "Wedding Mini + Video",
    price: "₱1,499",
    originalPrice: "₱2,500",
    popular: false,
    description: "Mini Website + Animated Video Invitation",
    tagline: "A sleek mini-website paired with a personalized animated video. Delivered in a premium online envelope.",
    accent: "from-slate-400 to-slate-600",
    icon: Sparkles,
    features: [
      "Mini website",
      "RSVP tracking",
      "Email notifications",
      "Guest messages",
      "Online envelope linked to video invite",
      "Customized Google Form header",
      "Venue info",
      "1-year website access",
      "Monogram",
    ],
    videoFeatures: ["Landing Page", "Save the Date", "Location", "Dress Code", "Gift Guide & Reminders", "RSVP Page"],
  },
  {
    name: "Infinity",
    type: "Full Wedding Website",
    price: "₱1,899",
    originalPrice: "₱1,999",
    popular: true,
    description: "Full Wedding Website",
    tagline: "Perfect for couples who want everything in one place—story, timeline, entourage, venue, gallery, and more.",
    accent: "from-foreground to-foreground",
    icon: Crown,
    features: [
      "Customized full website",
      "RSVP tracking via Google Forms + Sheets",
      "Email notifications for each RSVP",
      "Guest message section",
      "Online envelope",
      "Customized Google Form header",
      "Gallery (up to 16 photos + Save-the-Date video)",
      "Venue info (Waze + Google Maps)",
      "Wedding timeline",
      "Love story section",
      "Entourage list",
      "Dress code",
      "Gift guide",
      "FAQs",
      "Music integration",
      "Countdown timer",
      "QR codes",
      "1-year access after the event",
    ],
  },
  {
    name: "Legality",
    type: "Full Debut Website",
    price: "₱1,799",
    originalPrice: "₱2,300",
    popular: false,
    description: "Full Debut Website",
    tagline: "A complete digital debut experience. Showcase your 18 Roses, 18 Candles, 18 Treasures, and more.",
    accent: "from-blue-400 to-cyan-600",
    icon: Star,
    features: [
      "Customized full debut website",
      "RSVP tracking",
      "Online envelope",
      "Guest messages",
      "Customized Google Form header",
      "Venue info",
      "Gallery (up to 16 photos + save-the-date video)",
      "18 Roses",
      "18 Candles",
      "18 Treasures",
      "18 Blue Bills",
      "Event timeline",
      "Dress code",
      "Gift guide",
      "FAQs",
      "Music",
      "Countdown",
      "QR codes",
      "1-year access",
    ],
  },
  {
    name: "Felicity",
    type: "Full Birthday Website",
    price: "₱1,799",
    originalPrice: "₱2,300",
    popular: false,
    description: "Full Birthday Website",
    tagline: "Perfect for all ages—1st, 18th, 21st, 30th, or 60th! Highlight memories, messages, galleries, and more.",
    accent: "from-purple-400 to-pink-600",
    icon: Zap,
    features: [
      "Customized full birthday website",
      "RSVP tracking",
      "Online envelope",
      "Guest messages",
      "Customized Google Form header",
      "Venue/Party details",
      "Photo gallery (up to 16 photos + video)",
      "Guest birthday wishes board",
      "Event timeline",
      "Age milestone display",
      "Dress code",
      "Gift guide",
      "FAQs",
      "Music & video integration",
      "Countdown timer",
      "QR codes",
      "1-year access",
    ],
  },
];

const faqs = [
  { q: "How do I get an invitation made?", a: "Just contact us with your event details. Our team handles the entire design, setup, and publishing for you — start to finish." },
  { q: "Can I edit my invitation after it's published?", a: "All edits are handled by our team to keep the design pixel-perfect. Just message us with your changes and we'll update it within 24 hours." },
  { q: "What payment methods do you accept?", a: "We accept GCash, Maya, bank transfers, and major credit / debit cards." },
  { q: "How long does setup take?", a: "Most invitations are designed and delivered within 1–3 business days after we receive your event details and photos." },
];

const guarantees = [
  { icon: Shield, text: "Fully managed service" },
  { icon: Check, text: "Transparent pricing" },
  { icon: Zap, text: "Delivered in 1–3 days" },
  { icon: Clock, text: "Free updates after launch" },
];

function PlanDetails({ plan, onClose }: { plan: Pkg | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {plan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 sm:p-8 relative">
              <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-accent flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">{plan.type}</p>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight">{plan.name}</h2>
                {plan.popular && <Badge className="bg-foreground text-background"><Star className="h-3 w-3 mr-1 fill-current" /> Most Popular</Badge>}
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <div className="flex items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.06] border border-border mb-6">
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground line-through">{plan.originalPrice}</span>
                    <span className="font-display text-3xl sm:text-4xl font-black tracking-tight">{plan.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">one-time payment</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <Zap className="h-4 w-4" /> Limited Time
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{plan.tagline}</p>
              <h3 className="font-display font-bold text-lg mb-3">What's Included</h3>
              <div className="grid sm:grid-cols-2 gap-2 mb-6">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              {plan.videoFeatures && plan.videoFeatures.length > 0 && (
                <>
                  <h3 className="font-display font-bold text-lg mb-3">Animated Video Invitation Includes</h3>
                  <div className="grid sm:grid-cols-2 gap-2 mb-6">
                    {plan.videoFeatures.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  className="flex-1 rounded-full"
                  size="lg"
                  onClick={() => (window.location.href = `mailto:support@lynxinvitation.com?subject=Interested in ${plan.name} Package`)}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full" onClick={onClose}>Close</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Pricing() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Pkg | null>(null);
  const [activeIdx, setActiveIdx] = useState(() => Math.max(0, packages.findIndex(p => p.popular)));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const active = packages[activeIdx];

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.06]" />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-3xl"
      />

      <div className="section-container relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-5 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Zap className="h-3 w-3" /> Fully Managed Service
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5">
            Choose Your Perfect <span className="text-gradient italic">Package</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Tap any package to explore the full inclusions and see it come to life.
          </p>
        </motion.div>

        {/* Package selector pills */}
        <LayoutGroup>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {packages.map((p, i) => {
              const Icon = p.icon;
              const isActive = i === activeIdx;
              return (
                <button
                  key={p.name}
                  onClick={() => setActiveIdx(i)}
                  className="relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="pricing-pill"
                      className="absolute inset-0 rounded-full bg-foreground shadow-lg"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className={`relative flex items-center gap-2 ${isActive ? "text-background" : "text-muted-foreground hover:text-foreground"}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {p.name}
                    {p.popular && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Showcase card */}
          <div className="relative max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-[2rem] border border-border/60 bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl"
              >
                {/* Animated accent gradient */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br ${active.accent} opacity-20 blur-3xl pointer-events-none`}
                />
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
                  className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent pointer-events-none"
                />

                <div className="grid lg:grid-cols-[1.1fr_1fr] gap-0">
                  {/* Left: Hero info */}
                  <div className="p-7 sm:p-10 lg:p-12 relative">
                    {active.popular && (
                      <motion.div
                        initial={{ scale: 0, rotate: -8 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 220 }}
                        className="inline-flex items-center gap-1.5 bg-foreground text-background text-[11px] font-bold px-3 py-1.5 rounded-full mb-5 shadow-lg"
                      >
                        <Star className="h-3 w-3 fill-current" /> MOST POPULAR
                      </motion.div>
                    )}
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-2">
                      {active.type}
                    </p>
                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-4"
                    >
                      {active.name}
                    </motion.h3>
                    <p className="text-muted-foreground leading-relaxed mb-7 text-sm sm:text-base max-w-md">
                      {active.tagline}
                    </p>

                    {/* Price block */}
                    <div className="mb-7 p-5 rounded-2xl bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.01] border border-border/50">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-base text-muted-foreground line-through">{active.originalPrice}</span>
                        <motion.span
                          key={active.price}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 280 }}
                          className="font-display text-5xl sm:text-6xl font-black tracking-tight"
                        >
                          {active.price}
                        </motion.span>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                          <Sparkles className="h-2.5 w-2.5 mr-1" /> ON SALE
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">one-time payment • no hidden fees</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        size="lg"
                        className="rounded-full font-semibold shadow-lg group"
                        onClick={() => setSelectedPlan(active)}
                      >
                        See Full Inclusions
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full font-semibold hover:bg-foreground hover:text-background"
                        onClick={() => (window.location.href = `mailto:support@lynxinvitation.com?subject=Interested in ${active.name} Package`)}
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>

                  {/* Right: Feature reel */}
                  <div className="relative p-7 sm:p-10 lg:p-12 lg:border-l border-t lg:border-t-0 border-border/50 bg-gradient-to-br from-secondary/40 to-transparent">
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-5">
                      What's Inside
                    </p>
                    <ul className="space-y-2.5 max-h-[24rem] overflow-hidden relative">
                      {active.features.slice(0, 10).map((f, i) => (
                        <motion.li
                          key={f}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.04 }}
                          className="flex items-start gap-3 text-sm group"
                        >
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span className="leading-snug">{f}</span>
                        </motion.li>
                      ))}
                      {active.features.length > 10 && (
                        <motion.li
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-xs text-muted-foreground italic pl-8"
                        >
                          + {active.features.length - 10} more inclusions
                        </motion.li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Bottom progress strip showing other packages */}
                <div className="border-t border-border/50 bg-background/40 backdrop-blur px-4 sm:px-8 py-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                      All Packages
                    </p>
                    <div className="flex gap-1.5 flex-1 max-w-md ml-auto">
                      {packages.map((p, i) => (
                        <button
                          key={p.name}
                          onClick={() => setActiveIdx(i)}
                          className="flex-1 group"
                          aria-label={p.name}
                        >
                          <div className={`h-1.5 rounded-full transition-all ${i === activeIdx ? "bg-foreground" : "bg-border group-hover:bg-muted-foreground/50"}`} />
                          <p className={`mt-1.5 text-[10px] font-medium truncate text-center transition-colors ${i === activeIdx ? "text-foreground" : "text-muted-foreground"}`}>
                            {p.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </LayoutGroup>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {guarantees.map((item) => (
            <div key={item.text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-xs text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <item.icon className="h-3 w-3 text-emerald-600" />
              </span>
              {item.text}
            </div>
          ))}
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-14 max-w-2xl mx-auto"
        >
          <h3 className="font-display font-bold text-lg text-center mb-6 flex items-center justify-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            Common Questions
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-sm font-medium text-left hover:bg-accent/30 transition-colors"
                >
                  {faq.q}
                  <motion.div animate={{ rotate: expandedFaq === i ? 180 : 0 }}>
                    <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need a custom solution? <a href="mailto:support@lynxinvitation.com" className="text-primary hover:underline">Contact us</a>
          </p>
        </div>
      </div>

      <PlanDetails plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
    </section>
  );
}
