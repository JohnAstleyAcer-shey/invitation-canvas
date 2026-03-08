import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Cake, Baby, Building2, PartyPopper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventType, EVENT_TYPE_LABELS } from "../types";

const templates = [
  {
    name: "Classic Debut",
    type: "debut" as EventType,
    description: "Traditional debut celebration with 18 roses, candles, treasures, and blue bills",
    icon: PartyPopper,
  },
  {
    name: "Elegant Wedding",
    type: "wedding" as EventType,
    description: "Timeless wedding invitation with ceremony details and RSVP",
    icon: Heart,
  },
  {
    name: "Fun Birthday",
    type: "birthday" as EventType,
    description: "Colorful birthday party with countdown and gallery",
    icon: Cake,
  },
  {
    name: "Blessed Christening",
    type: "christening" as EventType,
    description: "Gentle christening ceremony with timeline and guest management",
    icon: Baby,
  },
  {
    name: "Corporate Gala",
    type: "corporate" as EventType,
    description: "Professional event with schedule, dress code, and RSVP",
    icon: Building2,
  },
  {
    name: "Minimal Wedding",
    type: "wedding" as EventType,
    description: "Clean, modern wedding invitation with essential pages only",
    icon: Heart,
  },
];

export default function TemplatesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Templates</h1>
        <p className="text-sm text-muted-foreground">Quick-start templates for every event type</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-6 flex flex-col"
          >
            <t.icon className="h-8 w-8 mb-4" />
            <h3 className="font-display font-semibold mb-1">{t.name}</h3>
            <p className="text-xs text-muted-foreground mb-4 flex-1">{t.description}</p>
            <Button
              variant="outline"
              className="rounded-full w-full"
              onClick={() => navigate("/admin/create")}
            >
              Use Template <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
