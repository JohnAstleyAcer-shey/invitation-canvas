import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Features } from "../components/Features";

import { Carousel3D } from "../components/Carousel3D";
import { MarqueeTicker } from "../components/MarqueeTicker";
import { Pricing } from "../components/Pricing";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { MessageCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <MarqueeTicker />
      <HowItWorks />
      <Carousel3D />
      <Features />
      <Pricing />
      <Testimonials />

      {/* CTA — editorial */}
      <section className="py-24 sm:py-32 bg-foreground text-background border-b border-foreground">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-3xl mx-auto px-6 text-center"
        >
          <span className="inline-block border border-background/30 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-background/70 mb-8">
            Begin the Conversation
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Ready to Create Something <span className="italic font-normal">Beautiful</span>?
          </h2>
          <p className="text-background/70 max-w-xl mx-auto mb-10 text-sm sm:text-base leading-relaxed">
            LynxInvitation is a fully managed service. We handle everything — from design to deployment. Tell us about your celebration.
          </p>
          <a
            href="mailto:support@lynxinvitation.com"
            className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-background/90 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Contact Us
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
