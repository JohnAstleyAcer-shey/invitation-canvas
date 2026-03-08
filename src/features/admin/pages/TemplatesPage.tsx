import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Cake, Baby, Building2, PartyPopper, ArrowRight, Sparkles, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCreateInvitation } from "../hooks/useInvitations";
import { useAuth } from "../hooks/useAuth";
import { EventType, EVENT_TYPE_LABELS } from "../types";
import { toast } from "sonner";

const templates = [
  {
    name: "Grand Debut",
    type: "debut" as EventType,
    description: "Complete debut celebration with 18 roses, candles, treasures, blue bills, gallery, and RSVP",
    icon: PartyPopper,
    popular: true,
    preset: { title: "My Grand Debut", celebrant_name: "", invitation_message: "You are cordially invited to celebrate a beautiful milestone — my 18th birthday." },
  },
  {
    name: "Elegant Wedding",
    type: "wedding" as EventType,
    description: "Timeless wedding invitation with ceremony details, timeline, gallery, and RSVP management",
    icon: Heart,
    popular: false,
    preset: { title: "Our Wedding", celebrant_name: "", invitation_message: "Together with our families, we invite you to celebrate our union." },
  },
  {
    name: "Minimalist Wedding",
    type: "wedding" as EventType,
    description: "Clean, modern wedding with essential pages — cover, message, location, and RSVP",
    icon: Crown,
    popular: false,
    preset: { title: "We're Getting Married", celebrant_name: "", invitation_message: "Join us as we say I do." },
  },
  {
    name: "Fun Birthday",
    type: "birthday" as EventType,
    description: "Colorful birthday celebration with countdown, gallery, dress code, and gift guide",
    icon: Cake,
    popular: false,
    preset: { title: "Birthday Bash", celebrant_name: "", invitation_message: "Let's celebrate another year of life, love, and laughter!" },
  },
  {
    name: "Blessed Christening",
    type: "christening" as EventType,
    description: "Gentle christening ceremony invitation with timeline, guest management, and photos",
    icon: Baby,
    popular: false,
    preset: { title: "Christening Celebration", celebrant_name: "", invitation_message: "Join us as we celebrate a blessed beginning." },
  },
  {
    name: "Corporate Gala",
    type: "corporate" as EventType,
    description: "Professional event with schedule, dress code, FAQ, and RSVP — perfect for galas and conferences",
    icon: Building2,
    popular: false,
    preset: { title: "Annual Gala", celebrant_name: "", invitation_message: "You are invited to an evening of excellence." },
  },
  {
    name: "Starlit Debut",
    type: "debut" as EventType,
    description: "A celestial-themed debut with sparkle effects, elegant fonts, and full debut ceremony sections",
    icon: Star,
    popular: false,
    preset: { title: "Under the Stars", celebrant_name: "", invitation_message: "Join me as I dance under the starlit sky on my 18th birthday." },
  },
  {
    name: "Garden Wedding",
    type: "wedding" as EventType,
    description: "Nature-inspired wedding with soft palette, gallery focus, and outdoor venue details",
    icon: Sparkles,
    popular: false,
    preset: { title: "Garden of Love", celebrant_name: "", invitation_message: "Surrounded by nature's beauty, we invite you to witness our love story." },
  },
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createInvitation = useCreateInvitation();

  const handleUseTemplate = async (template: typeof templates[0]) => {
    if (!user) return;
    try {
      const slug = template.preset.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
      const inv = await createInvitation.mutateAsync({
        admin_user_id: user.id,
        title: template.preset.title,
        celebrant_name: template.preset.celebrant_name || null,
        slug,
        event_type: template.type,
        invitation_message: template.preset.invitation_message || null,
      });
      toast.success("Invitation created from template!");
      navigate(`/admin/edit/${inv.id}`);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Templates</h1>
        <p className="text-sm text-muted-foreground">Quick-start templates for every event type. Click to create instantly.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t, i) => (
          <motion.div
            key={`${t.name}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-6 flex flex-col relative"
          >
            {t.popular && (
              <Badge className="absolute top-3 right-3 text-[10px]">Popular</Badge>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <t.icon className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px]">{EVENT_TYPE_LABELS[t.type]}</Badge>
            </div>
            <h3 className="font-display font-semibold mb-1">{t.name}</h3>
            <p className="text-xs text-muted-foreground mb-4 flex-1">{t.description}</p>
            <Button
              variant="outline"
              className="rounded-full w-full"
              onClick={() => handleUseTemplate(t)}
              disabled={createInvitation.isPending}
            >
              {createInvitation.isPending ? "Creating..." : "Use Template"} <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
