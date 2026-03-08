import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Zap, HelpCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const packages = [
  {
    name: "Serenity",
    price: 1499,
    originalPrice: 1999,
    popular: false,
    description: "Perfect for simple events",
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
  { q: "Can I upgrade my plan later?", a: "Yes! You can upgrade at any time and only pay the difference." },
  { q: "Is there a free trial?", a: "We offer a free starter plan with basic features so you can try before buying." },
  { q: "What payment methods are accepted?", a: "We accept GCash, Maya, bank transfers, and major credit/debit cards." },
  { q: "Can I get a refund?", a: "We offer a 7-day money-back guarantee if you're not satisfied." },
];

export function Pricing() {
  const [showComparison, setShowComparison] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            <Zap className="h-3.5 w-3.5" /> Limited Time Offer
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Choose the perfect package for your event. All plans include free updates and secure hosting.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`glass-card p-5 sm:p-6 relative flex flex-col transition-all duration-300 ${
                pkg.popular ? "border-foreground/20 ring-1 ring-foreground/10 shadow-xl scale-[1.02]" : ""
              }`}
            >
              {pkg.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full shadow-lg"
                >
                  <Star className="h-3 w-3" /> Most Popular
                </motion.div>
              )}

              <Badge variant="destructive" className="w-fit text-[10px] mb-3">
                Save ₱{(pkg.originalPrice - pkg.price).toLocaleString()}
              </Badge>

              <h3 className="font-display text-xl font-bold">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{pkg.description}</p>

              <div className="mb-5">
                <span className="text-sm text-muted-foreground line-through">₱{pkg.originalPrice.toLocaleString()}</span>
                <div className="font-display text-3xl sm:text-4xl font-black">
                  ₱{pkg.price.toLocaleString()}
                </div>
                <span className="text-[10px] text-muted-foreground">one-time payment</span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {pkg.features.map((f) => (
                  <li key={f.text} className={`flex items-start gap-2.5 text-sm ${!f.included ? "opacity-40" : ""}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${f.included ? "bg-primary/10" : "bg-muted"}`}>
                      {f.included ? (
                        <Check className="h-2.5 w-2.5 text-foreground" />
                      ) : (
                        <X className="h-2.5 w-2.5 text-muted-foreground" />
                      )}
                    </div>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={pkg.popular ? "default" : "outline"}
                className={`w-full rounded-full transition-all ${pkg.popular ? "shadow-md hover:shadow-lg" : ""}`}
                size="lg"
              >
                <Link to="/auth">Get Started</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-xs text-muted-foreground">
            <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="h-3 w-3 text-green-600" />
            </span>
            7-day money-back guarantee • No hidden fees • Instant activation
          </div>
        </motion.div>

        {/* Pricing FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <h3 className="font-display font-bold text-lg text-center mb-6">Common Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-sm font-medium text-left hover:bg-accent/30 transition-colors"
                >
                  {faq.q}
                  <HelpCircle className={`h-4 w-4 text-muted-foreground shrink-0 ml-2 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
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
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
