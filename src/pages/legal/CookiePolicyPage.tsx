import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <article className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <header className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Legal</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-3">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 6, 2026</p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl font-bold mb-3">1. What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help us keep you
              signed in, remember preferences, and understand how our service is used.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">2. Cookies We Use</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Essential</strong> — authentication tokens and session cookies required for the admin and customer portals to work.</li>
              <li><strong>Preferences</strong> — theme choice, language, and music playback state for invitation microsites.</li>
              <li><strong>Analytics</strong> — aggregate, privacy-respecting metrics used to improve performance and reliability.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">3. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use trusted infrastructure providers for hosting, authentication, and email. These providers may set
              their own cookies subject to their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">4. Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can control or delete cookies through your browser settings. Disabling essential cookies may prevent
              parts of the admin portal from functioning.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">5. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions? Email{" "}
              <a href="mailto:support@lynxinvitation.com" className="text-primary hover:underline">support@lynxinvitation.com</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
