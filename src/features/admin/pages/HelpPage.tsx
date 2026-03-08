import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageSquare, BookOpen, Video, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqItems = [
  { q: "How do I create an invitation?", a: "Go to Dashboard and click 'New Invitation'. Follow the 3-step wizard to choose your event type, fill in details, and review before creating. You can also use Templates for a quick start." },
  { q: "How do guests RSVP?", a: "Share your invitation link (/invite/your-slug) with guests. They can search their name, verify with their invitation code, and submit their RSVP response including number of companions and dietary notes." },
  { q: "Can I customize the theme?", a: "Yes! Go to Edit Invitation > Theme tab to change colors (with suggested palettes), fonts (with live preview), particle effects, page transitions, glassmorphism, and add background music." },
  { q: "How do I manage guest lists?", a: "From Dashboard, click the Guests button on any invitation card. You can add guests individually, bulk import by pasting names (one per line), edit guest details, and export the full list to CSV." },
  { q: "What are Customer Admin accounts?", a: "Customer Admin accounts give your clients read-only access to view their invitation stats, guest lists, and RSVP responses via a separate portal at /customer-admin — without accessing your admin panel." },
  { q: "How do I add 18 Roses/Candles/Treasures/Blue Bills?", a: "These sections are available for Debut event types only. Go to Edit Invitation > Content tab to add them individually or use Bulk Add to paste multiple names at once." },
  { q: "Can I duplicate an invitation?", a: "Yes! From the Dashboard, click the three-dot menu on any invitation card and select 'Duplicate'. This copies all settings, pages, and theme — but not guest data." },
  { q: "How do I delete an invitation?", a: "Invitations are first soft-deleted to the Trash tab. From there, you can restore them or permanently delete them. Permanent deletion removes ALL associated data and uploaded files." },
  { q: "What image formats are supported?", a: "JPG, PNG, WebP, and GIF are supported for cover images, gallery uploads, and person photos. Images are stored securely in cloud storage." },
  { q: "Can I add background music?", a: "Yes! Go to Theme tab and paste a direct audio file URL (.mp3, .wav, .ogg). You can configure autoplay, loop, and volume settings. Note: YouTube/Spotify links are not supported — use direct file URLs." },
  { q: "How do style variants work?", a: "Each invitation page section can have one of 4 style variants: Classic (centered, traditional), Modern (asymmetric, bold), Elegant (script fonts, ornamental), or Bold (full-width, high contrast). Change them in the Pages tab." },
  { q: "Can I reorder pages?", a: "Yes! In the Pages tab of the editor, you can toggle pages on/off and they will display in the order shown. Drag handles allow visual reordering." },
];

const resources = [
  { icon: BookOpen, title: "Getting Started Guide", desc: "Learn the basics of creating your first invitation", external: false },
  { icon: Video, title: "Video Tutorials", desc: "Watch step-by-step walkthroughs", external: false },
  { icon: FileText, title: "API Documentation", desc: "For developers and advanced users", external: false },
];

export default function HelpPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Help & Support</h1>
        <p className="text-sm text-muted-foreground">Everything you need to get started and troubleshoot</p>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3">
        {resources.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-4 flex flex-col items-center text-center gap-2 cursor-pointer hover:bg-accent/30 transition-colors"
          >
            <r.icon className="h-6 w-6 text-muted-foreground" />
            <p className="text-xs font-medium">{r.title}</p>
            <p className="text-[10px] text-muted-foreground">{r.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-sm text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 space-y-4">
        <h3 className="font-display font-semibold">Need More Help?</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 flex-1">
            <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">Email Support</p>
              <p className="text-xs text-muted-foreground">support@lynxinvitation.com</p>
              <p className="text-[10px] text-muted-foreground mt-1">Response within 24 hours</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 flex-1">
            <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">Live Chat</p>
              <p className="text-xs text-muted-foreground">Available Mon-Fri 9AM-5PM PHT</p>
              <p className="text-[10px] text-muted-foreground mt-1">Average response: 5 minutes</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Keyboard shortcuts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { keys: "⌘ K", desc: "Open command palette" },
            { keys: "⌘ N", desc: "New invitation" },
            { keys: "⌘ /", desc: "Toggle sidebar" },
            { keys: "Esc", desc: "Close dialogs" },
          ].map(s => (
            <div key={s.keys} className="flex items-center justify-between p-2 rounded-lg bg-accent/20">
              <span className="text-muted-foreground">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
