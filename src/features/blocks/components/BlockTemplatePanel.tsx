import { motion } from "framer-motion";
import { Sparkles, Heart, Cake, Baby, Building2, PartyPopper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BlockType, BlockContent, BlockStyle } from "../types";

interface TemplateBlock {
  block_type: BlockType;
  content: BlockContent;
  style: BlockStyle;
}

interface BlockTemplateDef {
  name: string;
  description: string;
  category: string;
  icon: React.FC<any>;
  blocks: TemplateBlock[];
}

const BUILT_IN_TEMPLATES: BlockTemplateDef[] = [
  {
    name: "Grand Debut",
    description: "Full debut ceremony with cover, message, countdown, entourage sections, gallery, and RSVP",
    category: "Debut",
    icon: PartyPopper,
    blocks: [
      { block_type: "cover_hero", content: { overlayText: "My Grand Debut", overlaySubtext: "You are cordially invited", overlay: true }, style: { fullHeight: true } },
      { block_type: "message_card", content: { body: "Dear Guest,\n\nYou are cordially invited to celebrate a beautiful milestone — my 18th birthday.\n\nWith love and excitement, I hope you can join me on this special day." }, style: { textAlign: "center", padding: "3rem 2rem", glassmorphism: true } },
      { block_type: "countdown", content: { showDays: true, showHours: true, showMinutes: true, showSeconds: true }, style: { textAlign: "center", padding: "3rem 1rem" } },
      { block_type: "location", content: { venueName: "Venue Name", venueAddress: "Address" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "timeline", content: { events: [{ time: "5:00 PM", title: "Arrival & Registration", description: "" }, { time: "6:00 PM", title: "18 Roses", description: "" }, { time: "7:00 PM", title: "18 Candles", description: "" }, { time: "8:00 PM", title: "Dinner & Party", description: "" }] }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "entourage", content: { entourageType: "roses", entourageTitle: "18 Roses", people: [] }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "entourage", content: { entourageType: "candles", entourageTitle: "18 Candles", people: [] }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "entourage", content: { entourageType: "treasures", entourageTitle: "18 Treasures", people: [] }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "entourage", content: { entourageType: "blue_bills", entourageTitle: "18 Blue Bills", people: [] }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "gallery", content: { images: [], columns: 3 }, style: { padding: "2rem 1rem" } },
      { block_type: "dress_code", content: { colors: [], dressCodeNote: "Please come dressed in the following colors" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "gift_registry", content: { items: [] }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "faq", content: { faqs: [] }, style: { padding: "2rem 1rem" } },
      { block_type: "rsvp", content: { showDietaryNotes: true, showCompanions: true, showMessage: true, maxCompanions: 3 }, style: { textAlign: "center", padding: "2rem 1rem" } },
    ],
  },
  {
    name: "Elegant Wedding",
    description: "Classic wedding invitation with ceremony details, timeline, and RSVP",
    category: "Wedding",
    icon: Heart,
    blocks: [
      { block_type: "cover_hero", content: { overlayText: "We're Getting Married", overlaySubtext: "Together with our families", overlay: true }, style: { fullHeight: true } },
      { block_type: "message_card", content: { body: "Together with our families, we invite you to celebrate our union of love." }, style: { textAlign: "center", padding: "3rem 2rem", glassmorphism: true } },
      { block_type: "countdown", content: { showDays: true, showHours: true, showMinutes: true, showSeconds: true }, style: { textAlign: "center", padding: "3rem 1rem" } },
      { block_type: "location", content: { venueName: "Ceremony Venue", venueAddress: "" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "timeline", content: { events: [{ time: "3:00 PM", title: "Ceremony", description: "" }, { time: "4:00 PM", title: "Cocktail Hour", description: "" }, { time: "5:00 PM", title: "Reception", description: "" }] }, style: { textAlign: "center" } },
      { block_type: "gallery", content: { images: [], columns: 3 }, style: { padding: "2rem 1rem" } },
      { block_type: "dress_code", content: { colors: [] }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "gift_registry", content: { items: [] }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "rsvp", content: { showDietaryNotes: true, showCompanions: true, showMessage: true }, style: { textAlign: "center", padding: "2rem 1rem" } },
    ],
  },
  {
    name: "Fun Birthday",
    description: "Colorful birthday bash with countdown, gallery, and gift guide",
    category: "Birthday",
    icon: Cake,
    blocks: [
      { block_type: "cover_hero", content: { overlayText: "Birthday Bash!", overlaySubtext: "Let's celebrate!", overlay: true }, style: { fullHeight: true } },
      { block_type: "text", content: { body: "Let's celebrate another year of life, love, and laughter!" }, style: { textAlign: "center", padding: "2rem" } },
      { block_type: "countdown", content: { showDays: true, showHours: true, showMinutes: true, showSeconds: true }, style: { textAlign: "center", padding: "3rem 1rem" } },
      { block_type: "location", content: { venueName: "Party Venue" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "gallery", content: { images: [], columns: 2 }, style: { padding: "1rem" } },
      { block_type: "gift_registry", content: { items: [] }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "rsvp", content: { showDietaryNotes: false, showCompanions: true, showMessage: true }, style: { textAlign: "center", padding: "2rem 1rem" } },
    ],
  },
  {
    name: "Blessed Christening",
    description: "Gentle christening ceremony invitation",
    category: "Christening",
    icon: Baby,
    blocks: [
      { block_type: "cover_hero", content: { overlayText: "Christening Celebration", overlaySubtext: "A blessed beginning", overlay: true }, style: { fullHeight: true } },
      { block_type: "message_card", content: { body: "Join us as we celebrate a blessed beginning." }, style: { textAlign: "center", padding: "3rem 2rem", glassmorphism: true } },
      { block_type: "countdown", content: { showDays: true, showHours: true }, style: { textAlign: "center", padding: "2rem" } },
      { block_type: "location", content: { venueName: "Church / Venue" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "timeline", content: { events: [] }, style: { textAlign: "center" } },
      { block_type: "gallery", content: { images: [], columns: 2 }, style: { padding: "1rem" } },
      { block_type: "rsvp", content: { showDietaryNotes: true, showCompanions: true, showMessage: true }, style: { textAlign: "center", padding: "2rem 1rem" } },
    ],
  },
  {
    name: "Corporate Gala",
    description: "Professional event with schedule and dress code",
    category: "Corporate",
    icon: Building2,
    blocks: [
      { block_type: "cover_hero", content: { overlayText: "Annual Gala", overlaySubtext: "An evening of excellence", overlay: true }, style: { fullHeight: true } },
      { block_type: "text", content: { body: "You are invited to an evening of excellence and networking." }, style: { textAlign: "center", padding: "2rem" } },
      { block_type: "countdown", content: { showDays: true, showHours: true }, style: { textAlign: "center" } },
      { block_type: "location", content: { venueName: "Grand Ballroom" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "timeline", content: { events: [{ time: "6:00 PM", title: "Registration", description: "" }, { time: "7:00 PM", title: "Keynote", description: "" }, { time: "8:00 PM", title: "Dinner", description: "" }] }, style: { textAlign: "center" } },
      { block_type: "dress_code", content: { colors: [{ hex: "#000000", name: "Black" }, { hex: "#FFFFFF", name: "White" }], dressCodeNote: "Black tie" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "faq", content: { faqs: [] }, style: { padding: "2rem 1rem" } },
      { block_type: "rsvp", content: { showDietaryNotes: true, showCompanions: false, showMessage: false }, style: { textAlign: "center", padding: "2rem 1rem" } },
    ],
  },
  {
    name: "Minimal Invite",
    description: "Just the essentials: cover, message, and RSVP",
    category: "Minimal",
    icon: Sparkles,
    blocks: [
      { block_type: "cover_hero", content: { overlayText: "You're Invited", overlay: true }, style: { fullHeight: true } },
      { block_type: "text", content: { body: "We'd love for you to join us." }, style: { textAlign: "center", padding: "3rem 2rem" } },
      { block_type: "location", content: { venueName: "Venue" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "rsvp", content: { showMessage: true }, style: { textAlign: "center", padding: "2rem 1rem" } },
    ],
  },
];

interface BlockTemplatePanelProps {
  invitationId: string;
  onApplyTemplate: (blocks: { block_type: BlockType; content: BlockContent; style: BlockStyle }[]) => void;
}

export function BlockTemplatePanel({ onApplyTemplate }: BlockTemplatePanelProps) {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h3 className="font-display font-bold text-sm">Templates</h3>
        <p className="text-[10px] text-muted-foreground">Start with a pre-made layout</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {BUILT_IN_TEMPLATES.map((tmpl, i) => (
            <motion.div
              key={tmpl.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-3 border border-border rounded-lg hover:border-primary/30 hover:bg-accent/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                  <tmpl.icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">{tmpl.name}</p>
                  <Badge variant="outline" className="text-[8px]">{tmpl.category}</Badge>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">{tmpl.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground">{tmpl.blocks.length} blocks</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-[10px] rounded-full"
                  onClick={() => onApplyTemplate(tmpl.blocks)}
                >
                  Use <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
