import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Cake, Baby, Building2, PartyPopper, ArrowRight, Search, Eye, Layers, Filter, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  featured?: boolean;
}

const BUILT_IN_TEMPLATES: BlockTemplateDef[] = [
  {
    name: "Grand Debut",
    description: "Full debut ceremony with cover, message, countdown, entourage sections, gallery, and RSVP",
    category: "Debut",
    icon: PartyPopper,
    featured: true,
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
    featured: true,
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
  {
    name: "Video-First Event",
    description: "Hero video background with modern social links",
    category: "Modern",
    icon: Zap,
    blocks: [
      { block_type: "hero_video", content: { heroOverlayText: "Save the Date", heroOverlaySubtext: "An unforgettable experience", heroOverlay: true }, style: { fullHeight: true } },
      { block_type: "separator_fancy", content: { separatorStyle: "stars" }, style: { textAlign: "center", padding: "1rem 2rem" } },
      { block_type: "text", content: { body: "We invite you to be part of something truly special." }, style: { textAlign: "center", padding: "2rem" } },
      { block_type: "countdown_flip", content: { showDays: true, showHours: true, showMinutes: true, showSeconds: true, flipStyle: "glass" }, style: { textAlign: "center", padding: "3rem 1rem" } },
      { block_type: "location", content: { venueName: "Premium Venue" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "social_links", content: { links: [], socialStyle: "pills", socialTitle: "Follow Us" }, style: { textAlign: "center", padding: "2rem 1rem" } },
      { block_type: "rsvp", content: { showMessage: true, showCompanions: true }, style: { textAlign: "center", padding: "2rem 1rem" } },
    ],
  },
];

interface BlockTemplatePanelProps {
  invitationId: string;
  onApplyTemplate: (blocks: { block_type: BlockType; content: BlockContent; style: BlockStyle }[]) => void;
}

export function BlockTemplatePanel({ onApplyTemplate }: BlockTemplatePanelProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const categories = ["all", ...Array.from(new Set(BUILT_IN_TEMPLATES.map(t => t.category)))];

  const filtered = BUILT_IN_TEMPLATES.filter(t => {
    if (category !== "all" && t.category !== category) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm">Templates</h3>
          <Badge variant="secondary" className="text-[9px]">{BUILT_IN_TEMPLATES.length}</Badge>
        </div>
        <p className="text-[10px] text-muted-foreground">Start with a pre-made layout</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs rounded-lg"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-3 py-1.5 border-b border-border">
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-colors capitalize ${
                category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filtered.map((tmpl, i) => (
            <motion.div
              key={tmpl.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`p-3 border rounded-lg hover:border-primary/30 hover:bg-accent/30 transition-all cursor-pointer ${
                tmpl.featured ? "border-primary/20 bg-primary/5" : "border-border"
              }`}
              onMouseEnter={() => setPreviewTemplate(tmpl.name)}
              onMouseLeave={() => setPreviewTemplate(null)}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                  <tmpl.icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold truncate">{tmpl.name}</p>
                    {tmpl.featured && <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500 shrink-0" />}
                  </div>
                  <Badge variant="outline" className="text-[8px]">{tmpl.category}</Badge>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">{tmpl.description}</p>

              {/* Block type preview */}
              <AnimatePresence>
                {previewTemplate === tmpl.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-2"
                  >
                    <div className="flex flex-wrap gap-0.5">
                      {tmpl.blocks.map((b, j) => (
                        <span key={j} className="text-[7px] bg-muted px-1 py-0.5 rounded">{b.block_type.replace(/_/g, " ")}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                  <Layers className="h-2.5 w-2.5" /> {tmpl.blocks.length} blocks
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-[10px] rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onApplyTemplate(tmpl.blocks)}
                >
                  Use <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">No templates found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
