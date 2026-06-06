import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <article className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <header className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Legal</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 6, 2026</p>
        </header>

        <div className="prose prose-sm sm:prose max-w-none text-foreground space-y-8">
          <section>
            <h2 className="font-display text-2xl font-bold mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              LynxInvitation ("we", "us", "our") provides fully-managed digital invitation services. This Privacy
              Policy explains what information we collect, how we use it, and the choices you have when you use our
              websites and invitation microsites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Client information</strong> — names, email, contact number, event details, and assets provided for invitation design.</li>
              <li><strong>Guest information</strong> — RSVPs, guest names, contact details, dietary preferences, and messages submitted through invitation microsites.</li>
              <li><strong>Usage data</strong> — page views, device type, and IP address used to maintain reliability and analytics.</li>
              <li><strong>Payment information</strong> — handled by third-party processors (GCash, Maya, banks, card networks). We do not store card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">3. How We Use Information</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Design, host, and operate your invitation.</li>
              <li>Deliver RSVP notifications and guest messages to the host.</li>
              <li>Respond to inquiries and provide customer support.</li>
              <li>Improve our services, security, and uptime.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">4. Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell personal information. We share data only with the event host, our hosting and email
              providers, payment processors, and when required by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">5. Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Invitation data is retained for the duration of your one-year hosting term, plus a reasonable archival
              window. RSVP exports are available to the host on request.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may request access, correction, or deletion of your personal information by emailing{" "}
              <a href="mailto:support@lynxinvitation.com" className="text-primary hover:underline">support@lynxinvitation.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">7. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about this policy? Email{" "}
              <a href="mailto:support@lynxinvitation.com" className="text-primary hover:underline">support@lynxinvitation.com</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
