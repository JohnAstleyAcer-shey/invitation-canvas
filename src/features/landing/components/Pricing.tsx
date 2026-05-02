import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, Star, Zap, HelpCircle, X, Sparkles, ArrowRight, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const packages = [
  {
    name: "Serenity",
    price: 1499,
    originalPrice: 1999,
    popular: false,
    description: "Perfect for simple events",
    gradient: "from-slate-500/10 to-gray-500/10",
    features: [
      { text: "1 Event Invitation", included: true },
      { text: "Basic Themes", included: true },
      { text: "Up to 50 Guests", included: true },
      { text: "RSVP Management", included: true },
      { text: "Email Support", included: true },
      { text: "Block Editor", included: false },
      { text: "Analytics", included: false },
      { text: "Customer Portal", included: false },
    ],
  },
  {
    name: "Infinity",
    price: 1899,
    originalPrice: 2499,
    popular: true,
    description: "Best value for most events",
    gradient: "from-primary/10 to-primary/5",
    features: [
      { text: "3 Event Invitations", included: true },
      { text: "Premium Themes", included: true },
      { text: "Unlimited Guests", included: true },
      { text: "RSVP + Analytics", included: true },
      { text: "18 Roses & Candles", included: true },
      { text: "Block Editor", included: true },
      { text: "Customer Admin Portal", included: true },
      { text: "Priority Support", included: true },
    ],
  },
  {
    name: "Legality",
    price: 1799,
    originalPrice: 2299,
    popular: false,
    description: "Great for medium events",
    gradient: "from-blue-500/10 to-cyan-500/10",
    features: [
      { text: "2 Event Invitations", included: true },
      { text: "Custom Themes", included: true },
      { text: "Up to 200 Guests", included: true },
      { text: "RSVP Management", included: true },
      { text: "Gallery & Timeline", included: true },
      { text: "Block Editor", included: true },
      { text: "Email Support", included: true },
      { text: "Customer Portal", included: false },
    ],
  },
  {
    name: "Felicity",
    price: 1799,
    originalPrice: 2299,
    popular: false,
    description: "Premium event experience",
    gradient: "from-purple-500/10 to-pink-500/10",
    features: [
      { text: "2 Event Invitations", included: true },
      { text: "Premium Themes", included: true },
      { text: "Up to 150 Guests", included: true },
      { text: "RSVP + Gift Guide", included: true },
      { text: "Music Player", included: true },
      { text: "Block Editor", included: true },
      { text: "Email Support", included: true },
      { text: "Basic Analytics", included: true },
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

function PricingCard({ pkg, index }: { pkg: typeof packages[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`glass-card p-5 sm:p-6 relative flex flex-col transition-all duration-500 overflow-hidden ${
        pkg.popular ? "border-primary/30 ring-1 ring-primary/20 shadow-xl scale-[1.02]" : ""
      }`}
    >
      {/* Background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered || pkg.popular ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Popular badge */}
      {pkg.popular && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full shadow-lg"
        >
          <Star className="h-3 w-3 fill-current" /> Most Popular
        </motion.div>
      )}

      {/* Savings badge */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", delay: 0.2 + index * 0.1 }}
      >
        <Badge variant="destructive" className="relative w-fit text-[10px] mb-3">
          <Sparkles className="h-3 w-3 mr-1" />
          Save ₱{(pkg.originalPrice - pkg.price).toLocaleString()}
        </Badge>
      </motion.div>

      {/* Header */}
      <div className="relative">
        <h3 className="font-display text-xl font-bold">{pkg.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{pkg.description}</p>
      </div>

      {/* Price */}
      <div className="relative mb-5">
        <span className="text-sm text-muted-foreground line-through">
          ₱{pkg.originalPrice.toLocaleString()}
        </span>
        <motion.div 
          className="font-display text-3xl sm:text-4xl font-black"
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          ₱{pkg.price.toLocaleString()}
        </motion.div>
        <span className="text-[10px] text-muted-foreground">one-time payment</span>
      </div>

      {/* Features */}
      <ul className="relative space-y-2.5 mb-6 flex-1">
        {pkg.features.map((f, i) => (
          <motion.li 
            key={f.text} 
            className={`flex items-start gap-2.5 text-sm ${!f.included ? "opacity-40" : ""}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: f.included ? 1 : 0.4, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <motion.div 
              className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                f.included ? "bg-primary/10" : "bg-muted"
              }`}
              whileHover={f.included ? { scale: 1.2 } : {}}
            >
              {f.included ? (
                <Check className="h-2.5 w-2.5 text-foreground" />
              ) : (
                <X className="h-2.5 w-2.5 text-muted-foreground" />
              )}
            </motion.div>
            <span>{f.text}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button - Contact instead of sign up */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant={pkg.popular ? "default" : "outline"}
          className={`relative w-full rounded-full transition-all overflow-hidden ${
            pkg.popular ? "shadow-md hover:shadow-lg" : ""
          }`}
          size="lg"
          onClick={() => window.location.href = "mailto:support@lynxinvitation.com?subject=Interested in " + pkg.name + " Package"}
        >
          <span className="relative">Inquire Now</span>
          <ArrowRight className="ml-2 h-4 w-4 relative" />
        </Button>
      </motion.div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
        animate={isHovered ? { translateX: "100%" } : {}}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}

export function Pricing() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <Zap className="h-3.5 w-3.5 animate-pulse" /> Limited Time Offer
          </motion.span>
          <motion.h2 
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Simple Pricing
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            One-time pricing. Our team designs, builds, and publishes your invitation — you simply share the link with your guests.
          </motion.p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {packages.map((pkg, i) => (
            <PricingCard key={pkg.name} pkg={pkg} index={i} />
          ))}
        </div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {guarantees.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-xs text-muted-foreground"
            >
              <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <item.icon className="h-3 w-3 text-green-600" />
              </span>
              {item.text}
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <h3 className="font-display font-bold text-lg text-center mb-6 flex items-center justify-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            Common Questions
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <motion.button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-sm font-medium text-left hover:bg-accent/30 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  {faq.q}
                  <motion.div
                    animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <motion.p 
                        className="px-4 pb-4 text-sm text-muted-foreground"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                      >
                        {faq.a}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Need a custom solution? <a href="mailto:support@lynxinvitation.com" className="text-primary hover:underline">Contact us</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
