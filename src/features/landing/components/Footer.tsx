import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail, MapPin, Sparkles, Users, Calendar, Star } from "lucide-react";
import lynxSeal from "@/assets/lynx-seal.png.asset.json";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Showcase", href: "#showcase" },
      { label: "How It Works", href: "#how-it-works" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "mailto:support@lynxinvitation.com" },
      { label: "FAQ", href: "#pricing" },
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
  { label: "TikTok", href: "#", emoji: "🎵" },
  { label: "Email", href: "mailto:support@lynxinvitation.com", emoji: "✉️" },
];

const stats = [
  { icon: Sparkles, value: "327", label: "Invitations crafted" },
  { icon: Users, value: "18.4k", label: "Guests welcomed" },
  { icon: Calendar, value: "112", label: "Events this year" },
  { icon: Star, value: "4.9 / 5", label: "Avg. client rating" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-gradient-to-b from-secondary/20 via-background to-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full border border-border/10 pointer-events-none"
      />

      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-14 sm:py-20 relative">
        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-card/60 backdrop-blur border border-border/60 hover:border-border transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-display text-lg sm:text-xl font-black tracking-tight">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <motion.img
                src={lynxSeal.url}
                alt="LynxInvitation"
                className="h-12 w-12 sm:h-14 sm:w-14 drop-shadow-xl"
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 260 }}
              />
              <div>
                <div className="font-display text-xl font-black tracking-tight">LynxInvitation</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Crafted Digital Invitations</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
              A fully managed studio for digital invitations. We design, build, and publish elegant story-style experiences for every life celebration.
            </p>

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

            <div className="flex gap-2 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 rounded-xl bg-accent/50 flex items-center justify-center text-sm hover:bg-accent transition-all hover:scale-110"
                  aria-label={s.label}
                >
                  {s.emoji}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
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
