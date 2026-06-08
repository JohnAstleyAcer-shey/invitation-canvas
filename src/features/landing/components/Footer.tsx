import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

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
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "Email", href: "mailto:support@lynxinvitation.com" },
];

const stats = [
  { value: "327", label: "Invitations Crafted" },
  { value: "18,400", label: "Guests Welcomed" },
  { value: "112", label: "Events This Year" },
  { value: "4.9 / 5", label: "Avg. Client Rating" },
];

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border">
      {/* Stats strip — full width */}
      <div className="border-b border-border">
        <div className="w-full max-w-[1920px] mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="px-6 py-10 sm:py-12 text-center"
            >
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold italic tracking-tight">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mt-3">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display text-3xl sm:text-4xl font-bold italic tracking-tight">Lynx</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Invitation</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-8">
              A fully managed studio for digital invitations. We design, build, and publish elegant story-style experiences for every life celebration.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                <a href="mailto:support@lynxinvitation.com" className="hover:text-foreground transition-colors">support@lynxinvitation.com</a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>Manila, Philippines</span>
              </div>
            </div>

            <div className="flex gap-px mt-8 border border-border w-fit">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors border-r border-border last:border-r-0"
                  aria-label={s.label}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground mb-5 pb-3 border-b border-border">{group.title}</h4>
                <ul className="space-y-3">
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
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            © {new Date().getFullYear()} LynxInvitation — All Rights Reserved
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            Crafted in the Philippines
          </p>
        </div>
      </div>
    </footer>
  );
}
