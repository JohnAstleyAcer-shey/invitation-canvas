import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="section-container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoDark} alt="LynxInvitation" className="hidden dark:block h-8 w-8" />
          <img src={logoLight} alt="LynxInvitation" className="block dark:hidden h-8 w-8" />
          <span className="font-display text-xl font-bold tracking-tight">LynxInvitation</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo("features")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </button>
          <button onClick={() => scrollTo("pricing")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </button>
          <ThemeToggle />
          <Button asChild size="sm" className="rounded-full px-6">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-fade-up">
          <div className="section-container py-4 flex flex-col gap-3">
            <button onClick={() => scrollTo("features")} className="text-sm font-medium py-2 text-muted-foreground">Features</button>
            <button onClick={() => scrollTo("pricing")} className="text-sm font-medium py-2 text-muted-foreground">Pricing</button>
            <Button asChild className="rounded-full">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
