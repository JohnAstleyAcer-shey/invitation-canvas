import { useState } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageSquare, BookOpen, Video, FileText, Search, Lightbulb, Keyboard, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";

const faqItems = [
  { q: "How do I create an invitation?", a: "Go to Dashboard and click 'New Invitation'. Follow the 3-step wizard to choose your event type, fill in details, and review before creating. You can also use Templates for a quick start.", category: "basics" },
  { q: "How do guests RSVP?", a: "Share your invitation link (/invite/your-slug) with guests. They can search their name, verify with their invitation code, and submit their RSVP response including number of companions and dietary notes.", category: "guests" },
  { q: "Can I customize the theme?", a: "Yes! Go to Edit Invitation > Theme tab to change colors (with suggested palettes), fonts (with live preview), particle effects, page transitions, glassmorphism, and add background music.", category: "design" },
  { q: "How do I manage guest lists?", a: "From Dashboard, click the Guests button on any invitation card. You can add guests individually, bulk import by pasting names (one per line), edit guest details, and export the full list to CSV.", category: "guests" },
  { q: "What are Customer Admin accounts?", a: "Customer Admin accounts give your clients read-only access to view their invitation stats, guest lists, and RSVP responses via a separate portal at /customer-admin — without accessing your admin panel.", category: "advanced" },
  { q: "How do I add 18 Roses/Candles/Treasures/Blue Bills?", a: "These sections are available for Debut event types only. Go to Edit Invitation > Content tab to add them individually or use Bulk Add to paste multiple names at once.", category: "content" },
  { q: "Can I duplicate an invitation?", a: "Yes! From the Dashboard, click the three-dot menu on any invitation card and select 'Duplicate'. This copies all settings, pages, and theme — but not guest data.", category: "basics" },
  { q: "How do I delete an invitation?", a: "Invitations are first soft-deleted to the Trash tab. From there, you can restore them or permanently delete them. Permanent deletion removes ALL associated data and uploaded files.", category: "basics" },
  { q: "What image formats are supported?", a: "JPG, PNG, WebP, and GIF are supported for cover images, gallery uploads, and person photos. Images are stored securely in cloud storage.", category: "content" },
  { q: "Can I add background music?", a: "Yes! Go to Theme tab and paste a direct audio file URL (.mp3, .wav, .ogg). You can configure autoplay, loop, and volume settings. Note: YouTube/Spotify links are not supported — use direct file URLs.", category: "design" },
  { q: "How do style variants work?", a: "Each invitation page section can have one of 4 style variants: Classic (centered, traditional), Modern (asymmetric, bold), Elegant (script fonts, ornamental), or Bold (full-width, high contrast). Change them in the Pages tab.", category: "design" },
  { q: "What is the Block Editor?", a: "The Block Editor is an advanced drag-and-drop builder where you can compose custom invitation layouts using 30+ block types. Access it from the Dashboard card menu or the Edit page.", category: "advanced" },
];

const resources = [
  { icon: BookOpen, title: "Getting Started Guide", desc: "Learn the basics of creating your first invitation", color: "from-blue-500/10 to-blue-500/5" },
  { icon: Video, title: "Video Tutorials", desc: "Watch step-by-step walkthroughs", color: "from-purple-500/10 to-purple-500/5" },
  { icon: FileText, title: "API Documentation", desc: "For developers and advanced users", color: "from-green-500/10 to-green-500/5" },
];

const quickTips = [
  "Use the Block Editor for custom layouts beyond the standard page system",
  "Bulk import guests by pasting names separated by new lines",
  "Press ⌘K anywhere to open the command palette",
  "Export your guest list as CSV for external use",
  "Use keyboard shortcuts (press ? on Dashboard) for faster navigation",
  "Templates are the fastest way to create a polished invitation",
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = searchQuery
    ? faqItems.filter(item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;

  return (
    <div className="max-w-3xl mx-auto space-y-6 w-full">
      <SEOHead title="Help & Support" />
      <div>
        <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-2xl sm:text-3xl font-black">
          Help & Support
        </motion.h1>
        <p className="text-sm text-muted-foreground mt-0.5">Everything you need to get started and troubleshoot</p>
      </div>

      {/* Quick resources */}
      <div className="grid sm:grid-cols-3 gap-3">
        {resources.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-2xl border border-border bg-gradient-to-br ${r.color} p-5 flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-all group`}
          >
            <div className="w-12 h-12 rounded-xl bg-background/60 flex items-center justify-center group-hover:scale-110 transition-transform">
              <r.icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold font-display">{r.title}</p>
            <p className="text-[11px] text-muted-foreground">{r.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick tips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-gradient-to-br from-amber-500/5 to-amber-500/0 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="font-display font-bold text-sm">Quick Tips</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {quickTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ search */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl bg-muted/50 border-transparent focus:border-border focus:bg-background"
          />
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          Frequently Asked Questions
          <Badge variant="secondary" className="text-[10px]">{filteredFaqs.length}</Badge>
        </h3>
        {filteredFaqs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No matching questions found. Try a different search term.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm text-left hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </motion.div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h3 className="font-display font-bold mb-4">Need More Help?</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/30">
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold">Email Support</p>
              <p className="text-xs text-muted-foreground">support@lynxinvitation.com</p>
              <p className="text-[10px] text-muted-foreground mt-1">Response within 24 hours</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/30">
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold">Live Chat</p>
              <p className="text-xs text-muted-foreground">Available Mon-Fri 9AM-5PM PHT</p>
              <p className="text-[10px] text-muted-foreground mt-1">Average response: 5 minutes</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Keyboard shortcuts */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display font-bold text-sm">Keyboard Shortcuts</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {[
            { keys: "⌘ K", desc: "Open command palette" },
            { keys: "N", desc: "New invitation" },
            { keys: "/", desc: "Focus search" },
            { keys: "G", desc: "Grid view" },
            { keys: "L", desc: "List view" },
            { keys: "?", desc: "Show shortcuts" },
            { keys: "Esc", desc: "Close dialogs / Deselect" },
            { keys: "⌘ P", desc: "Toggle preview (Block Editor)" },
          ].map(s => (
            <div key={s.keys} className="flex items-center justify-between p-2.5 rounded-xl bg-accent/20">
              <span className="text-muted-foreground text-xs">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded-md border border-border bg-muted text-[10px] font-mono">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
