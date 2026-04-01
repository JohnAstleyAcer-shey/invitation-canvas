import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Features } from "../components/Features";
import { Showcase } from "../components/Showcase";
import { Pricing } from "../components/Pricing";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { MessageCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Showcase />
      <Pricing />
      <Testimonials />

      {/* CTA Section - Showcase focused, no login */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 text-center relative"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-base sm:text-lg">
            LynxInvitation is a managed service. We handle everything — from design to deployment. Contact us to get started with your perfect invitation.
          </p>
          <motion.a
            href="mailto:support@lynxinvitation.com"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-10 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Us
          </motion.a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
