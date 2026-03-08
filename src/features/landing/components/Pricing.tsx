import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const packages = [
  {
    name: "Serenity",
    price: 1499,
    originalPrice: 1999,
    popular: false,
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
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Choose the perfect package for your event</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card p-6 relative flex flex-col ${
                pkg.popular ? "border-foreground/30 ring-1 ring-foreground/10" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  <Star className="h-3 w-3" /> Most Popular
                </div>
              )}

              <div className="mb-1">
                <span className="inline-block bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Sale
                </span>
              </div>

              <h3 className="font-display text-xl font-bold mb-2">{pkg.name}</h3>

              <div className="mb-4">
                <span className="text-sm text-muted-foreground line-through">₱{pkg.originalPrice.toLocaleString()}</span>
                <div className="font-display text-3xl font-black">
                  ₱{pkg.price.toLocaleString()}
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-foreground" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={pkg.popular ? "default" : "outline"}
                className="w-full rounded-full"
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
