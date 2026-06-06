import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <article className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <header className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Legal</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-3">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 6, 2026</p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl font-bold mb-3">1. Agreement</h2>
            <p className="text-muted-foreground leading-relaxed">
              By engaging LynxInvitation to design, host, or manage your digital invitation, you agree to these Terms
              of Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">2. Service Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              LynxInvitation is a fully-managed service. Our team handles design, setup, edits, publishing, and
              hosting for the duration of your package. Edits are coordinated by email or chat and applied within a
              reasonable window.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">3. Payments</h2>
            <p className="text-muted-foreground leading-relaxed">
              All packages are one-time payments. Work begins after full payment is received unless otherwise agreed.
              All sales are final once production has started, but we will always work to make your invitation right.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">4. Client Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate event details, names, and assets.</li>
              <li>Confirm proofs and content within reasonable timelines.</li>
              <li>Ensure you have rights to any images, music, or content you submit.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              Designs, code, templates, and visual systems remain the property of LynxInvitation. You receive a
              non-exclusive license to use the delivered invitation for your event and personal sharing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">6. Hosting & Uptime</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hosting is provided for one year from the event date unless extended. We aim for high availability but
              do not guarantee uninterrupted service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              LynxInvitation is not liable for indirect, incidental, or consequential damages arising from the use of
              our service. Our maximum liability is limited to the amount paid for the affected package.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3">8. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these terms, email{" "}
              <a href="mailto:support@lynxinvitation.com" className="text-primary hover:underline">support@lynxinvitation.com</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
