import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, Star, Zap, HelpCircle, X, Sparkles, ArrowRight, Shield, Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
  gradient: string;
  features: string[];
  videoFeatures?: string[];
};

const packages: Pkg[] = [
  {
    name: "Serenity",
    type: "Wedding Website Package",
    price: "₱1,499",
    originalPrice: "₱2,500",
    popular: false,
    description: "Mini Website + Animated Video Invitation",
    tagline: "A sleek mini-website paired with a personalized animated video. Delivered in a premium online envelope—ready to share instantly.",
    gradient: "from-slate-500/15 to-gray-500/10",
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
    type: "Wedding Website Package",
    price: "₱1,899",
    originalPrice: "₱1,999",
    popular: true,
    description: "Full Wedding Website",
    tagline: "Perfect for couples who want everything in one place—your love story, timeline, entourage, venue details, gallery, and more.",
    gradient: "from-primary/15 to-primary/5",
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
    type: "Debut Website Package",
    price: "₱1,799",
    originalPrice: "₱2,300",
    popular: false,
    description: "Full Debut Website",
    tagline: "A complete digital debut experience. Showcase your 18 Roses, 18 Candles, 18 Treasures, and more—all in a stunning layout.",
    gradient: "from-blue-500/15 to-cyan-500/10",
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
    type: "Birthday Website Package",
    price: "₱1,799",
    originalPrice: "₱2,300",
    popular: false,
    description: "Full Birthday Website",
    tagline: "Perfect for all ages—1st, 18th, 21st, 30th, or 60th! Highlight memories, messages, galleries, timelines, and more.",
    gradient: "from-purple-500/15 to-pink-500/10",
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

function PricingCard({ pkg, onSelect, isActive }: { pkg: Pkg; onSelect: (p: Pkg) => void; isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{ scale: isActive ? 1 : 0.92, opacity: isActive ? 1 : 0.55 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={`relative flex flex-col rounded-3xl border bg-card/70 backdrop-blur-xl p-6 sm:p-7 overflow-hidden h-full ${
        pkg.popular
          ? "border-primary/40 ring-2 ring-primary/15 shadow-2xl"
          : "border-border/60 hover:border-border hover:shadow-xl"
      }`}
    >
      <motion.div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pkg.gradient}`}
        animate={{ opacity: isHovered || pkg.popular ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      {pkg.popular && (
        <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-primary/20 blur-3xl" />
      )}
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-foreground text-background text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-lg z-10">
          <Star className="h-3 w-3 fill-current" /> Most Popular
        </div>
      )}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="secondary" className="text-[10px] font-bold bg-foreground/5 text-foreground border border-border/60">
          <Sparkles className="h-2.5 w-2.5 mr-1" /> On Sale
        </Badge>
      </div>

      <div className="relative mt-4 mb-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-1">{pkg.type}</p>
        <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight">{pkg.name}</h3>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pkg.tagline}</p>
      </div>

      <div className="relative mb-5 pb-5 border-b border-border/50">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground line-through">{pkg.originalPrice}</span>
          <motion.div
            className="font-display text-4xl sm:text-5xl font-black tracking-tight"
            animate={isHovered ? { scale: 1.04 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {pkg.price}
          </motion.div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">one-time payment</p>
      </div>

      <ul className="relative space-y-2.5 mb-6 flex-1">
        {pkg.features.slice(0, 6).map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px]">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className="leading-snug">{f}</span>
          </li>
        ))}
        {pkg.features.length > 6 && (
          <li className="text-[11px] text-muted-foreground pl-6.5 italic">+ {pkg.features.length - 6} more features</li>
        )}
      </ul>

      <Button
        variant={pkg.popular ? "default" : "outline"}
        className={`relative w-full rounded-full font-semibold ${pkg.popular ? "shadow-lg" : "hover:bg-foreground hover:text-background"}`}
        size="lg"
        onClick={() => onSelect(pkg)}
      >
        {pkg.popular ? "See Everything Included" : "See Full Inclusions"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
}

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
  const [activeIdx, setActiveIdx] = useState(() => packages.findIndex(p => p.popular) || 0);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Auto-rotate
  useEffect(() => {
    if (isPaused || selectedPlan) return;
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % packages.length), 5000);
    return () => clearInterval(t);
  }, [isPaused, selectedPlan]);

  const next = () => setActiveIdx((i) => (i + 1) % packages.length);
  const prev = () => setActiveIdx((i) => (i - 1 + packages.length) % packages.length);

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.06]" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 12, repeat: Infinity }}
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
            Beautifully designed digital invitations at unbeatable prices. Our team handles everything—design, setup, and publishing.
          </p>
        </motion.div>

        {/* Mobile/Tablet: Carousel */}
        <div
          className="lg:hidden relative"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `${-activeIdx * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 28 }}
            >
              {packages.map((pkg) => (
                <div key={pkg.name} className="w-full shrink-0 px-2 sm:px-3 pt-4 pb-2">
                  <PricingCard pkg={pkg} onSelect={setSelectedPlan} isActive />
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={prev} className="w-9 h-9 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {packages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`transition-all rounded-full ${i === activeIdx ? "w-6 h-2 bg-foreground" : "w-2 h-2 bg-border"}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop: 3D-ish carousel showing 3 cards with focus on active */}
        <div
          className="hidden lg:block relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative flex items-stretch justify-center gap-6 px-16 py-6 min-h-[600px]">
            {packages.map((pkg, i) => {
              const offset = i - activeIdx;
              const distance = Math.abs(offset);
              if (distance > 1) return null;
              return (
                <motion.div
                  key={pkg.name}
                  className="w-[340px] cursor-pointer"
                  animate={{
                    x: offset * 380,
                    rotateY: offset * -8,
                    zIndex: 10 - distance,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 28 }}
                  style={{ transformStyle: "preserve-3d", position: offset === 0 ? "relative" : "absolute" }}
                  onClick={() => offset !== 0 && setActiveIdx(i)}
                >
                  <PricingCard pkg={pkg} onSelect={setSelectedPlan} isActive={offset === 0} />
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-border bg-card/80 backdrop-blur hover:bg-accent flex items-center justify-center shadow-lg z-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-border bg-card/80 backdrop-blur hover:bg-accent flex items-center justify-center shadow-lg z-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-center gap-2 mt-2">
            {packages.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActiveIdx(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  i === activeIdx ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {guarantees.map((item) => (
            <div key={item.text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-xs text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <item.icon className="h-3 w-3 text-green-600" />
              </span>
              {item.text}
            </div>
          ))}
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
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
