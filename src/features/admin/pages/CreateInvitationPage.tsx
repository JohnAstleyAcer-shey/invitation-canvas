import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Cake, Baby, Building2, PartyPopper, ArrowLeft, ArrowRight, Check, Sparkles, Wand2, Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCreateInvitation } from "../hooks/useInvitations";
import { useAuth } from "../hooks/useAuth";
import { EVENT_TYPE_LABELS, type EventType } from "../types";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

const eventIcons: Record<EventType, React.ElementType> = {
  debut: PartyPopper,
  wedding: Heart,
  birthday: Cake,
  christening: Baby,
  corporate: Building2,
};

const eventDescriptions: Record<EventType, string> = {
  debut: "18th birthday celebration with roses, candles, treasures & blue bills",
  wedding: "Beautiful wedding ceremony and reception",
  birthday: "Fun birthday party celebration",
  christening: "Baby dedication and christening ceremony",
  corporate: "Professional corporate event or gala",
};

const eventColors: Record<EventType, string> = {
  debut: "from-pink-500/10 to-purple-500/10 hover:border-pink-500/30",
  wedding: "from-rose-500/10 to-pink-500/10 hover:border-rose-500/30",
  birthday: "from-amber-500/10 to-orange-500/10 hover:border-amber-500/30",
  christening: "from-sky-500/10 to-blue-500/10 hover:border-sky-500/30",
  corporate: "from-slate-500/10 to-gray-500/10 hover:border-slate-500/30",
};

const TITLE_SUGGESTIONS: Record<EventType, string[]> = {
  debut: ["Sofia's Grand Debut", "My 18th Birthday Celebration", "18 & Fabulous"],
  wedding: ["John & Jane's Wedding", "A Love Story Unfolds", "Forever Begins Here"],
  birthday: ["Happy Birthday Party", "Let's Celebrate!", "Birthday Bash"],
  christening: ["Baby's Christening Day", "A Blessed Beginning", "Baptism Celebration"],
  corporate: ["Annual Gala Night", "Company Summit 2026", "Awards Ceremony"],
};

export default function CreateInvitationPage() {
  const [step, setStep] = useState(0);
  const [eventType, setEventType] = useState<EventType | "">("");
  const [title, setTitle] = useState("");
  const [celebrantName, setCelebrantName] = useState("");
  const [slug, setSlug] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const createInvitation = useCreateInvitation();

  const generateSlug = useCallback((text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleTitleChange(suggestion);
    toast.success("Title applied!");
  };

  const handleCreate = async () => {
    if (!user || !eventType) return;
    try {
      const inv = await createInvitation.mutateAsync({
        admin_user_id: user.id,
        title,
        celebrant_name: celebrantName || null,
        slug: slug || generateSlug(title),
        event_type: eventType,
        event_date: eventDate ? new Date(eventDate).toISOString() : null,
        venue_name: venueName || null,
        venue_address: venueAddress || null,
        invitation_message: message || null,
      });
      setShowConfetti(true);
      setTimeout(() => navigate(`/admin/edit/${inv.id}`), 2000);
    } catch {}
  };

  const canProceed = step === 0 ? !!eventType : step === 1 ? !!title && !!slug : true;

  // Calculate completion percentage
  const filledFields = [title, celebrantName, slug, eventDate, venueName, venueAddress, message].filter(Boolean).length;
  const completionPercent = Math.round((filledFields / 7) * 100);

  return (
    <div className="max-w-2xl mx-auto w-full">
      <SEOHead title="Create Invitation" />
      <motion.h1
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-display text-2xl sm:text-3xl font-black mb-2"
      >
        Create Invitation
      </motion.h1>
      <p className="text-sm text-muted-foreground mb-8">Set up your new event invitation</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["Event Type", "Details", "Review"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <motion.div
              animate={{
                scale: i === step ? 1.1 : 1,
                backgroundColor: i <= step ? "hsl(var(--primary))" : "hsl(var(--accent))",
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= step ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </motion.div>
            <span className="text-xs font-medium hidden sm:block">{label}</span>
            {i < 2 && <div className={`flex-1 h-px transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Confetti overlay */}
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
            </motion.div>
            <h2 className="font-display text-2xl font-black mb-2">Invitation Created! 🎉</h2>
            <p className="text-muted-foreground">Redirecting to editor...</p>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(([type, label], i) => {
                const Icon = eventIcons[type];
                const isSelected = eventType === type;
                return (
                  <motion.button
                    key={type}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEventType(type)}
                    className={`rounded-2xl border-2 bg-gradient-to-br ${eventColors[type]} p-6 text-left transition-all ${
                      isSelected ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: isSelected ? Infinity : 0, duration: 2 }}
                        className="w-12 h-12 rounded-xl bg-background/60 flex items-center justify-center"
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Badge className="text-[9px]">Selected</Badge>
                        </motion.div>
                      )}
                    </div>
                    <h3 className="font-display font-bold mb-1">{label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{eventDescriptions[type]}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
            {/* Title suggestions */}
            {eventType && TITLE_SUGGESTIONS[eventType] && !title && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-[10px] font-semibold text-primary flex items-center gap-1 mb-2">
                  <Wand2 className="h-3 w-3" /> Quick suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {TITLE_SUGGESTIONS[eventType].map(s => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-accent hover:border-primary/30 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
              {/* Completion indicator */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Completion</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      animate={{ width: `${completionPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{completionPercent}%</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Event Title *</Label>
                  <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Sofia's 18th Birthday" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Celebrant Name</Label>
                  <Input value={celebrantName} onChange={(e) => setCelebrantName(e.target.value)} placeholder="Sofia Martinez" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">URL Slug *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">/invite/</span>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="sofias-18th" className="rounded-xl" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => { navigator.clipboard.writeText(`/invite/${slug}`); toast.success("Copied!"); }}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy URL</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Event Date</Label>
                  <Input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Venue Name</Label>
                  <Input value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Grand Ballroom" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Venue Address</Label>
                <Input value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="123 Main St, Manila" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Invitation Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="You are cordially invited..." className="rounded-xl min-h-[100px]" />
                <p className="text-[10px] text-muted-foreground">{message.length}/500 characters</p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-lg">Review Your Invitation</h3>
                <Badge variant="secondary" className="text-[10px]">
                  <Eye className="h-3 w-3 mr-1" /> Preview
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Event Type", value: eventType ? EVENT_TYPE_LABELS[eventType] : "-" },
                  { label: "Title", value: title || "-" },
                  { label: "Celebrant", value: celebrantName || "-" },
                  { label: "Slug", value: `/invite/${slug}`, mono: true },
                  { label: "Date", value: eventDate ? new Date(eventDate).toLocaleDateString() : "-" },
                  { label: "Venue", value: venueName || "-" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-xl bg-accent/30"
                  >
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className={`text-sm font-medium ${item.mono ? "font-mono text-xs" : ""}`}>{item.value}</p>
                  </motion.div>
                ))}
              </div>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-3 rounded-xl bg-accent/30"
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Message</p>
                  <p className="text-sm whitespace-pre-wrap">{message}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed} className="rounded-full">
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={createInvitation.isPending} className="rounded-full shadow-md">
            {createInvitation.isPending ? "Creating..." : "Create Invitation"} <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
