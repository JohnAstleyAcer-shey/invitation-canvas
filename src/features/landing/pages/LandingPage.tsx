import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Features } from "../components/Features";
import { Showcase } from "../components/Showcase";
import { Pricing } from "../components/Pricing";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Showcase />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}
