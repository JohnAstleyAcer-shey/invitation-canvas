import { Link } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Templates", href: "/auth" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/auth" },
      { label: "Contact Us", href: "mailto:support@lynxinvitation.com" },
      { label: "FAQ", href: "#pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="section-container py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoDark} alt="LynxInvitation" className="hidden dark:block h-7 w-7" />
              <img src={logoLight} alt="LynxInvitation" className="block dark:hidden h-7 w-7" />
              <span className="font-display text-lg font-bold">LynxInvitation</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Create stunning digital invitations for every life celebration. Beautiful, interactive, and unforgettable.
            </p>
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
          <p className="text-xs text-muted-foreground">
            Made with ❤️ in the Philippines
          </p>
        </div>
      </div>
    </footer>
  );
}
