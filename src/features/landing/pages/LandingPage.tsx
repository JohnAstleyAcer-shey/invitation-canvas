import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Features } from "../components/Features";
import { Showcase } from "../components/Showcase";
import { Pricing } from "../components/Pricing";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

      {/* CTA Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-container text-center relative"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-base sm:text-lg">
            Join thousands of happy customers who trust LynxInvitation for their special moments.
          </p>
          <Button asChild size="lg" className="rounded-full px-10 text-base font-semibold shadow-lg">
            <Link to="/auth">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
