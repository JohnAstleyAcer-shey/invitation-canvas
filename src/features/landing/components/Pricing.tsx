import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, X, ArrowRight, Star, Sparkles } from "lucide-react";
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
    tagline: "A sleek mini-website paired with a personalized animated video, delivered in a premium online envelope.",
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
    tagline: "Everything in one place — your love story, timeline, entourage, venue, gallery, and more.",
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
    tagline: "A complete digital debut experience — 18 Roses, 18 Candles, 18 Treasures, and more.",
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
    tagline: "Perfect for all ages — memories, messages, galleries, and timelines beautifully composed.",
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
  { q: "How long is the turnaround time?", a: "Most invitations are designed and delivered within 1–3 business days after we receive your event details and photos. Express options are available on request." },
  { q: "Can I make edits after the website is live?", a: "Yes. All edits are handled by our team to keep the design pixel-perfect. Message us with your changes and we'll update within 24 hours." },
  { q: "How do I receive guest RSVPs?", a: "All responses sync to a private Google Spreadsheet and email you in real time, with reminders before the event." },
  { q: "What payment methods do you accept?", a: "We accept GCash, Maya, bank transfers, and major credit / debit cards. One-time payment, no hidden fees." },
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
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-card border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 sm:p-8 relative">
              <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 hover:bg-accent flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-2">{plan.type}</p>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="font-display text-3xl sm:text-4xl font-bold italic">{plan.name}</h2>
                {plan.popular && <Badge className="bg-foreground text-background rounded-none uppercase tracking-widest text-[9px]"><Star className="h-3 w-3 mr-1 fill-current" /> Most Popular</Badge>}
              </div>
              <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>
              <div className="flex items-center justify-between gap-4 p-5 border border-border mb-6">
                <div>
                  <span className="text-xs text-muted-foreground line-through">{plan.originalPrice}</span>
                  <div className="font-display text-4xl font-bold tracking-tight">{plan.price}</div>
                  <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-widest">one-time payment</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">{plan.tagline}</p>
              <h3 className="font-display font-bold text-lg mb-3 uppercase tracking-wider text-sm">What's Included</h3>
              <div className="grid sm:grid-cols-2 gap-2 mb-6">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              {plan.videoFeatures && plan.videoFeatures.length > 0 && (
                <>
                  <h3 className="font-display font-bold mb-3 uppercase tracking-wider text-sm">Animated Video Includes</h3>
                  <div className="grid sm:grid-cols-2 gap-2 mb-6">
                    {plan.videoFeatures.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <Sparkles className="h-3.5 w-3.5 text-foreground mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  className="flex-1 rounded-none uppercase tracking-widest text-xs"
                  size="lg"
                  onClick={() => (window.location.href = `mailto:support@lynxinvitation.com?subject=Interested in ${plan.name} Package`)}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-none uppercase tracking-widest text-xs" onClick={onClose}>Close</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PricingCard({ pkg, idx, onSelect }: { pkg: Pkg; idx: number; onSelect: (p: Pkg) => void }) {
  const isDark = pkg.popular;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col p-8 ${
        isDark
          ? "bg-foreground text-background shadow-2xl lg:scale-[1.03] z-10 border border-foreground"
          : "bg-card border border-border hover:border-foreground transition-colors duration-300"
      }`}
    >
      {isDark && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-foreground text-[9px] font-bold uppercase tracking-[0.25em] px-4 py-1.5 border border-foreground">
          Most Popular
        </div>
      )}

      <span className={`text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold ${isDark ? "text-background/50" : "text-muted-foreground"}`}>
        {pkg.type}
      </span>
      <h3 className="font-display text-3xl sm:text-4xl font-bold italic mb-2">{pkg.name}</h3>
      <p className={`text-xs italic mb-8 leading-relaxed min-h-[3rem] ${isDark ? "text-background/60" : "text-muted-foreground"}`}>
        {pkg.tagline}
      </p>

      <div className="mb-8">
        <span className={`text-sm line-through ${isDark ? "text-background/40" : "text-muted-foreground/60"}`}>{pkg.originalPrice}</span>
        <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{pkg.price}</div>
        <p className={`text-[10px] uppercase tracking-[0.2em] mt-1 ${isDark ? "text-background/50" : "text-muted-foreground"}`}>
          one-time payment
        </p>
      </div>

      <ul className={`flex-grow mb-8 space-y-3 text-[13px] ${isDark ? "text-background/85" : "text-foreground/80"}`}>
        {pkg.features.slice(0, 8).map((f) => (
          <li key={f} className="flex gap-3 leading-snug">
            <span className={`shrink-0 ${isDark ? "text-background/40" : "text-muted-foreground"}`}>—</span>
            <span>{f}</span>
          </li>
        ))}
        {pkg.features.length > 8 && (
          <li className={`italic text-xs pl-6 ${isDark ? "text-background/40" : "text-muted-foreground/60"}`}>
            + {pkg.features.length - 8} more inclusions
          </li>
        )}
      </ul>

      <div className="space-y-2 mt-auto">
        <button
          onClick={() => (window.location.href = `mailto:support@lynxinvitation.com?subject=Interested in ${pkg.name} Package`)}
          className={`w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] transition-colors ${
            isDark
              ? "bg-background text-foreground hover:bg-background/90"
              : "bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          Get Started
        </button>
        <button
          onClick={() => onSelect(pkg)}
          className={`w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] border transition-colors ${
            isDark
              ? "border-background/20 text-background/80 hover:border-background hover:text-background"
              : "border-border text-foreground hover:border-foreground"
          }`}
        >
          Full Inclusions
        </button>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.05 }}
      className="border-b border-border"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center py-6 text-left group"
      >
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] pr-4 group-hover:translate-x-0.5 transition-transform">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 w-8 h-8 border border-border flex items-center justify-center group-hover:border-foreground transition-colors"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm text-muted-foreground leading-relaxed max-w-xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<Pkg | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-background relative">
      <div className="section-container relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Premium Digital Invitations
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Choose Your Perfect <span className="italic font-normal">Package</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Transparent pricing. No hidden fees. Every package is hand-crafted and fully managed by our team.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-7xl mx-auto mb-20 pt-4">
          {packages.map((pkg, i) => (
            <PricingCard key={pkg.name} pkg={pkg} idx={i} onSelect={setSelectedPlan} />
          ))}
        </div>

        {/* Guarantees strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-y border-border py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-24 max-w-4xl mx-auto"
        >
          {["Fully Managed", "1–3 Day Delivery", "Free Updates", "Lifetime Hosting"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70">{t}</span>
            </div>
          ))}
        </motion.div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Common Inquiries
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-bold italic mt-3">
              Questions & Answers
            </h3>
            <div className="w-10 h-px bg-foreground mx-auto mt-5" />
          </motion.div>

          <div className="border-t border-border">
            {faqs.map((faq, i) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} idx={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Need a custom solution?{" "}
              <a href="mailto:support@lynxinvitation.com" className="text-foreground font-semibold underline underline-offset-4 hover:no-underline">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>

      <PlanDetails plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
    </section>
  );
}
