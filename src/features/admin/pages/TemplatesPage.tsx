import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Cake, Baby, Building2, PartyPopper, ArrowRight, Sparkles, Crown, Star, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateInvitation } from "../hooks/useInvitations";
import { useAuth } from "../hooks/useAuth";
import { EventType, EVENT_TYPE_LABELS } from "../types";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";

const templates = [
  {
    name: "Grand Debut",
    type: "debut" as EventType,
    description: "Complete debut celebration with 18 roses, candles, treasures, blue bills, gallery, and RSVP",
    icon: PartyPopper,
    popular: true,
    color: "from-pink-500/10 to-purple-500/10",
    preset: { title: "My Grand Debut", celebrant_name: "", invitation_message: "You are cordially invited to celebrate a beautiful milestone — my 18th birthday." },
  },
  {
    name: "Elegant Wedding",
    type: "wedding" as EventType,
    description: "Timeless wedding invitation with ceremony details, timeline, gallery, and RSVP management",
    icon: Heart,
    popular: true,
    color: "from-rose-500/10 to-pink-500/10",
    preset: { title: "Our Wedding", celebrant_name: "", invitation_message: "Together with our families, we invite you to celebrate our union." },
  },
  {
    name: "Minimalist Wedding",
    type: "wedding" as EventType,
    description: "Clean, modern wedding with essential pages — cover, message, location, and RSVP",
    icon: Crown,
    popular: false,
    color: "from-slate-500/10 to-gray-500/10",
    preset: { title: "We're Getting Married", celebrant_name: "", invitation_message: "Join us as we say I do." },
  },
  {
    name: "Fun Birthday",
    type: "birthday" as EventType,
    description: "Colorful birthday celebration with countdown, gallery, dress code, and gift guide",
    icon: Cake,
    popular: false,
    color: "from-amber-500/10 to-orange-500/10",
    preset: { title: "Birthday Bash", celebrant_name: "", invitation_message: "Let's celebrate another year of life, love, and laughter!" },
  },
  {
    name: "Blessed Christening",
    type: "christening" as EventType,
    description: "Gentle christening ceremony invitation with timeline, guest management, and photos",
    icon: Baby,
    popular: false,
    color: "from-sky-500/10 to-blue-500/10",
    preset: { title: "Christening Celebration", celebrant_name: "", invitation_message: "Join us as we celebrate a blessed beginning." },
  },
  {
    name: "Corporate Gala",
    type: "corporate" as EventType,
    description: "Professional event with schedule, dress code, FAQ, and RSVP — perfect for galas and conferences",
    icon: Building2,
    popular: false,
    color: "from-indigo-500/10 to-blue-500/10",
    preset: { title: "Annual Gala", celebrant_name: "", invitation_message: "You are invited to an evening of excellence." },
  },
  {
    name: "Starlit Debut",
    type: "debut" as EventType,
    description: "A celestial-themed debut with sparkle effects, elegant fonts, and full debut ceremony sections",
    icon: Star,
    popular: false,
    color: "from-violet-500/10 to-indigo-500/10",
    preset: { title: "Under the Stars", celebrant_name: "", invitation_message: "Join me as I dance under the starlit sky on my 18th birthday." },
  },
  {
    name: "Garden Wedding",
    type: "wedding" as EventType,
    description: "Nature-inspired wedding with soft palette, gallery focus, and outdoor venue details",
    icon: Sparkles,
    popular: false,
    color: "from-emerald-500/10 to-green-500/10",
    preset: { title: "Garden of Love", celebrant_name: "", invitation_message: "Surrounded by nature's beauty, we invite you to witness our love story." },
  },
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createInvitation = useCreateInvitation();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null);

  const filtered = templates.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  });

  const handleUseTemplate = async (template: typeof templates[0]) => {
    if (!user) return;
    setCreatingTemplate(template.name);
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
    } catch {
      setCreatingTemplate(null);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <SEOHead title="Templates" />
      <div>
        <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-2xl sm:text-3xl font-black">
          Templates
        </motion.h1>
        <p className="text-sm text-muted-foreground mt-0.5">Quick-start templates for every event type. Click to create instantly.</p>
      </div>

      {/* Search & filter */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-muted/50 border-transparent focus:border-border focus:bg-background"
          />
        </div>
        <Tabs value={filterType} onValueChange={v => setFilterType(v as EventType | "all")}>
          <TabsList className="w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => (
              <TabsTrigger key={k} value={k} className="text-xs">{v}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      <p className="text-xs text-muted-foreground">{filtered.length} template{filtered.length !== 1 ? "s" : ""} found</p>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
          <Filter className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No templates match your search</p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((t, i) => {
            const isCreating = creatingTemplate === t.name;
            return (
              <motion.div
                key={`${t.name}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative rounded-2xl border border-border bg-gradient-to-br ${t.color} p-5 flex flex-col hover:shadow-lg hover:border-primary/20 transition-all duration-300`}
              >
                {t.popular && (
                  <Badge className="absolute top-3 right-3 text-[9px] shadow-sm">Popular</Badge>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-11 h-11 rounded-xl bg-background/60 backdrop-blur-sm flex items-center justify-center"
                  >
                    <t.icon className="h-5 w-5" />
                  </motion.div>
                  <Badge variant="outline" className="text-[10px] bg-background/50">{EVENT_TYPE_LABELS[t.type]}</Badge>
                </div>
                <h3 className="font-display font-bold mb-1">{t.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 flex-1 leading-relaxed">{t.description}</p>
                <Button
                  variant="outline"
                  className="rounded-full w-full bg-background/60 hover:bg-background transition-colors"
                  onClick={() => handleUseTemplate(t)}
                  disabled={!!creatingTemplate}
                >
                  {isCreating ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</>
                  ) : (
                    <>Use Template <ArrowRight className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
