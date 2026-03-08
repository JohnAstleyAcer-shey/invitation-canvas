import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Templates", href: "/auth" },
      { label: "Block Editor", href: "/auth" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/auth" },
      { label: "Contact Us", href: "mailto:support@lynxinvitation.com" },
      { label: "FAQ", href: "#pricing" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "#", emoji: "📘" },
  { label: "Instagram", href: "#", emoji: "📸" },
  { label: "Twitter", href: "#", emoji: "🐦" },
  { label: "TikTok", href: "#", emoji: "🎵" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      {/* Newsletter */}
      <div className="section-container py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-primary/5 border border-border"
        >
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display font-bold text-lg mb-1">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">Get tips, updates, and exclusive offers delivered to your inbox.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input placeholder="your@email.com" className="rounded-full max-w-xs" />
            <Button className="rounded-full shrink-0">
              Subscribe <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="section-container pb-12 sm:pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoDark} alt="LynxInvitation" className="hidden dark:block h-7 w-7" />
              <img src={logoLight} alt="LynxInvitation" className="block dark:hidden h-7 w-7" />
              <span className="font-display text-lg font-bold">LynxInvitation</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
              Create stunning digital invitations for every life celebration. Beautiful, interactive, and unforgettable.
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <a href="mailto:support@lynxinvitation.com" className="hover:text-foreground transition-colors">support@lynxinvitation.com</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>Manila, Philippines</span>
              </div>
            </div>
            
            {/* Social links */}
            <div className="flex gap-2 mt-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 rounded-xl bg-accent/50 flex items-center justify-center text-sm hover:bg-accent transition-colors hover:scale-110"
                  aria-label={s.label}
                >
                  {s.emoji}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-display font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LynxInvitation. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-destructive fill-destructive" /> in the Philippines
          </p>
        </div>
      </div>
    </footer>
  );
}
