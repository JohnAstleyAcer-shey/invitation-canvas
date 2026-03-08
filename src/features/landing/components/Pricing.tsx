import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const packages = [
  {
    name: "Serenity",
    price: 1499,
    originalPrice: 1999,
    popular: false,
    description: "Perfect for simple events",
    features: [
      "1 Event Invitation",
      "Basic Themes",
      "Up to 50 Guests",
      "RSVP Management",
      "Email Support",
    ],
  },
  {
    name: "Infinity",
    price: 1899,
    originalPrice: 2499,
    popular: true,
    description: "Best value for most events",
    features: [
      "3 Event Invitations",
      "Premium Themes",
      "Unlimited Guests",
      "RSVP + Analytics",
      "18 Roses & Candles",
      "Customer Admin Portal",
      "Priority Support",
    ],
  },
  {
    name: "Legality",
    price: 1799,
    originalPrice: 2299,
    popular: false,
    description: "Great for medium events",
    features: [
      "2 Event Invitations",
      "Custom Themes",
      "Up to 200 Guests",
      "RSVP Management",
      "Gallery & Timeline",
      "Email Support",
    ],
  },
  {
    name: "Felicity",
    price: 1799,
    originalPrice: 2299,
    popular: false,
    description: "Premium event experience",
    features: [
      "2 Event Invitations",
      "Premium Themes",
      "Up to 150 Guests",
      "RSVP + Gift Guide",
      "Music Player",
      "Email Support",
    ],
  },
];

export function Pricing() {
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
          <p className="text-muted-foreground max-w-md mx-auto">Choose the perfect package for your event. All plans include free updates.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`glass-card p-5 sm:p-6 relative flex flex-col hover:-translate-y-1 transition-transform duration-300 ${
                pkg.popular ? "border-foreground/20 ring-1 ring-foreground/10 shadow-xl" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                  <Star className="h-3 w-3" /> Most Popular
                </div>
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
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="h-2.5 w-2.5 text-foreground" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={pkg.popular ? "default" : "outline"}
                className="w-full rounded-full"
                size="lg"
              >
                <Link to="/auth">Get Started</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
