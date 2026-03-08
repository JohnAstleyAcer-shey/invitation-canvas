import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageSquare } from "lucide-react";

const faqItems = [
  { q: "How do I create an invitation?", a: "Go to Dashboard and click 'New Invitation'. Follow the 3-step wizard to choose your event type, fill in details, and review before creating." },
  { q: "How do guests RSVP?", a: "Share your invitation link with guests. They can search their name, verify with their invitation code, and submit their RSVP response." },
  { q: "Can I customize the theme?", a: "Yes! Go to Edit Invitation > Theme tab to change colors, fonts, particle effects, page transitions, and add background music." },
  { q: "How do I manage guest lists?", a: "From Dashboard, click the Guests button on any invitation card. You can add guests individually, bulk import by pasting names, and export to CSV." },
  { q: "What are Customer Admin accounts?", a: "Customer Admin accounts give your clients read-only access to view their invitation stats, guest lists, and RSVP responses without accessing your admin panel." },
  { q: "How do I add 18 Roses/Candles?", a: "These sections are available for Debut event types. Go to Edit Invitation > Content tab to add roses, candles, treasures, and blue bills." },
  { q: "Can I duplicate an invitation?", a: "Yes! From the Dashboard, click the menu button on any invitation card and select 'Duplicate'. This copies all settings and pages." },
  { q: "How do I delete an invitation?", a: "Invitations are first soft-deleted to the Trash tab. From there, you can restore or permanently delete them." },
  { q: "What image formats are supported?", a: "JPG, PNG, WebP, and GIF are supported for cover images, gallery, and person photos." },
  { q: "Can I add background music?", a: "Yes! Go to Theme tab and paste a direct audio file URL (.mp3). You can configure autoplay, loop, and volume settings." },
];

export default function HelpPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Help & Support</h1>
        <p className="text-sm text-muted-foreground">Frequently asked questions and support</p>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">FAQ</h3>
        <Accordion type="single" collapsible>
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-sm text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="font-display font-semibold">Need More Help?</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 flex-1">
            <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">Email Support</p>
              <p className="text-xs text-muted-foreground">support@lynxinvitation.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 flex-1">
            <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">Live Chat</p>
              <p className="text-xs text-muted-foreground">Available Mon-Fri 9AM-5PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
