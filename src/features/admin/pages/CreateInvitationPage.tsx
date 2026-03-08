import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Cake, Baby, Building2, PartyPopper, ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateInvitation } from "../hooks/useInvitations";
import { useAuth } from "../hooks/useAuth";
import { EVENT_TYPE_LABELS, type EventType } from "../types";

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

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-2">Create Invitation</h1>
      <p className="text-sm text-muted-foreground mb-8">Set up your new event invitation</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["Event Type", "Details", "Review"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
            }`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:block">{label}</span>
            {i < 2 && <div className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-foreground" />
            <h2 className="font-display text-2xl font-bold mb-2">Invitation Created! 🎉</h2>
            <p className="text-muted-foreground">Redirecting to editor...</p>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Event Type */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(([type, label]) => {
                const Icon = eventIcons[type];
                return (
                  <button
                    key={type}
                    onClick={() => setEventType(type)}
                    className={`glass-card p-6 text-left transition-all hover:shadow-lg ${
                      eventType === type ? "ring-2 ring-foreground border-foreground/30" : ""
                    }`}
                  >
                    <Icon className="h-8 w-8 mb-3" />
                    <h3 className="font-display font-semibold mb-1">{label}</h3>
                    <p className="text-xs text-muted-foreground">{eventDescriptions[type]}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Title *</Label>
                <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Sofia's 18th Birthday" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Celebrant Name</Label>
                <Input value={celebrantName} onChange={(e) => setCelebrantName(e.target.value)} placeholder="Sofia Martinez" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">/invite/</span>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="sofias-18th" className="rounded-xl" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Date</Label>
                <Input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Venue Name</Label>
                <Input value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Grand Ballroom" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Venue Address</Label>
              <Input value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="123 Main St, Manila" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Invitation Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="You are cordially invited..." className="rounded-xl min-h-[100px]" />
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-display font-bold text-lg">Review Your Invitation</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Event Type</p><p className="font-medium">{eventType ? EVENT_TYPE_LABELS[eventType] : "-"}</p></div>
                <div><p className="text-muted-foreground">Title</p><p className="font-medium">{title || "-"}</p></div>
                <div><p className="text-muted-foreground">Celebrant</p><p className="font-medium">{celebrantName || "-"}</p></div>
                <div><p className="text-muted-foreground">Slug</p><p className="font-medium font-mono text-xs">/invite/{slug}</p></div>
                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{eventDate ? new Date(eventDate).toLocaleDateString() : "-"}</p></div>
                <div><p className="text-muted-foreground">Venue</p><p className="font-medium">{venueName || "-"}</p></div>
              </div>
              {message && (
                <div><p className="text-muted-foreground text-sm">Message</p><p className="text-sm">{message}</p></div>
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
          <Button onClick={handleCreate} disabled={createInvitation.isPending} className="rounded-full">
            {createInvitation.isPending ? "Creating..." : "Create Invitation"} <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
