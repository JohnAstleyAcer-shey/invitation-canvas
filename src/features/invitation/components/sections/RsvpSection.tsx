import { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, HelpCircle, Send, Loader2, PartyPopper, Sparkles, Heart, Calendar, Users, MessageSquare, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Guest = Tables<"guests">;
type RsvpStatus = "attending" | "not_attending" | "maybe";
type Variant = "classic" | "modern" | "elegant" | "bold";

const statusOptions = [
  { key: "attending" as const, label: "Yes, I'll be there!", icon: Check, color: "from-green-500/20 to-emerald-500/20" },
  { key: "maybe" as const, label: "Maybe", icon: HelpCircle, color: "from-amber-500/20 to-yellow-500/20" },
  { key: "not_attending" as const, label: "Can't make it", icon: X, color: "from-red-500/20 to-rose-500/20" },
];

const confettiColors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#1dd1a1", "#5f27cd"];

function ConfettiPiece({ delay, color }: { delay: number; color: string }) {
  const x = Math.random() * 200 - 100;
  const rotation = Math.random() * 720 - 360;
  
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{ backgroundColor: color }}
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
      animate={{ 
        opacity: 0, 
        y: [-20, 200], 
        x: [0, x],
        rotate: rotation,
        scale: [1, 0.5]
      }}
      transition={{ 
        duration: 2,
        delay,
        ease: "easeOut"
      }}
    />
  );
}

function SuccessAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiPiece 
          key={i} 
          delay={i * 0.05} 
          color={confettiColors[i % confettiColors.length]} 
        />
      ))}
    </div>
  );
}

export function RsvpSection({ invitation, guest, variant = "classic" }: { invitation: Invitation; guest: Guest | null | undefined; variant?: Variant }) {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [foundGuest, setFoundGuest] = useState<Guest | null>(guest ?? null);
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [companions, setCompanions] = useState(0);
  const [message, setMessage] = useState("");
  const [dietary, setDietary] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const lookupGuest = async () => {
    if (!code.trim()) return;
    setLoading(true);
    const { data } = await supabase
      .from("guests")
      .select("*")
      .eq("invitation_id", invitation.id)
      .eq("invitation_code", code.trim().toUpperCase())
      .maybeSingle();
    setLoading(false);
    if (data) { setFoundGuest(data); setStep(1); }
    else toast.error("Invalid invitation code. Please try again.");
  };

  const submitRsvp = async () => {
    if (!foundGuest || !status) return;
    setLoading(true);
    const { error } = await supabase.from("rsvps").upsert({
      invitation_id: invitation.id,
      guest_id: foundGuest.id,
      status,
      num_companions: companions,
      message: message || null,
      dietary_notes: dietary || null,
      responded_at: new Date().toISOString(),
    }, { onConflict: "guest_id,invitation_id" });
    setLoading(false);
    if (error) toast.error("Failed to submit RSVP");
    else { 
      setDone(true); 
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success("RSVP submitted!"); 
    }
  };

  const btnStyle = { background: "var(--inv-primary)", color: "var(--inv-secondary)" };
  const inputStyle: React.CSSProperties = { borderColor: "var(--inv-accent)", color: "var(--inv-text)", background: "transparent" };

  if (done) {
    return (
      <SectionWrapper>
        <div className="relative">
          {showConfetti && <SuccessAnimation />}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ type: "spring", damping: 12 }} 
            className="space-y-6"
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center relative"
              style={{ background: "var(--inv-primary)" }}
            >
              <PartyPopper className="w-12 h-12" style={{ color: "var(--inv-secondary)" }} />
              
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: "2px solid var(--inv-primary)" }}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: "2px solid var(--inv-primary)" }}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl flex items-center justify-center gap-2" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
                Thank You!
                <Sparkles className="w-6 h-6" style={{ color: "var(--inv-accent)" }} />
              </h2>
              <p className="text-sm sm:text-base mt-2" style={{ color: "var(--inv-text-secondary)" }}>
                Your response has been recorded.
              </p>
            </motion.div>

            {status === "attending" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-2 text-sm"
                style={{ color: "var(--inv-text-secondary)" }}
              >
                <Heart className="w-4 h-4" style={{ color: "var(--inv-accent)" }} />
                We can't wait to see you!
              </motion.div>
            )}
          </motion.div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      {/* Animated icon */}
      <motion.div 
        initial={{ scale: 0, rotate: -180 }} 
        whileInView={{ scale: 1, rotate: 0 }} 
        viewport={{ once: true }} 
        transition={{ type: "spring", damping: 15 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Send className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
        </motion.div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl mb-6 sm:mb-8" 
        style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
      >
        {variant === "bold" ? "RSVP" : "Kindly Respond"}
      </motion.h2>

      <AnimatePresence mode="wait">
        {/* Step 0: Enter code */}
        {step === 0 && !foundGuest && (
          <motion.div 
            key="code" 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -20, scale: 0.95 }} 
            transition={{ type: "spring", damping: 20 }}
            className="space-y-4 max-w-xs mx-auto"
          >
            <p className="text-xs sm:text-sm flex items-center justify-center gap-2" style={{ color: "var(--inv-text-secondary)" }}>
              <Calendar className="w-4 h-4" />
              Enter your invitation code
            </p>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. A1B2C3D4"
                className="w-full px-4 py-3 rounded-xl border text-center text-lg tracking-widest focus:ring-2 focus:outline-none transition-all"
                style={{ ...inputStyle, boxShadow: code ? "0 0 0 2px var(--inv-primary)" : undefined }}
                maxLength={8}
                onKeyDown={e => e.key === "Enter" && lookupGuest()}
              />
              {code.length === 8 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Check className="w-5 h-5" style={{ color: "var(--inv-primary)" }} />
                </motion.div>
              )}
            </motion.div>
            <motion.button
              onClick={lookupGuest}
              disabled={loading || !code.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-all"
              style={btnStyle}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Find My Invitation
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Step 1: Choose status */}
        {step === 1 && (
          <motion.div 
            key="status" 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -20, scale: 0.95 }} 
            transition={{ type: "spring", damping: 20 }}
            className="space-y-4"
          >
            <motion.p 
              className="text-base sm:text-lg font-medium flex items-center justify-center gap-2" 
              style={{ color: "var(--inv-text)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Users className="w-4 h-4" />
              Hi, {foundGuest?.full_name}!
            </motion.p>
            <p className="text-xs sm:text-sm" style={{ color: "var(--inv-text-secondary)" }}>
              Will you be attending?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              {statusOptions.map((opt, i) => (
                <motion.button
                  key={opt.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setStatus(opt.key); setStep(2); }}
                  className={`relative flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 font-medium transition-all text-sm overflow-hidden`}
                  style={{
                    borderColor: status === opt.key ? "var(--inv-primary)" : "var(--inv-accent)",
                    background: status === opt.key ? "var(--inv-primary)" : "transparent",
                    color: status === opt.key ? "var(--inv-secondary)" : "var(--inv-text)",
                  }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${opt.color}`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <opt.icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div 
            key="details" 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -20, scale: 0.95 }} 
            transition={{ type: "spring", damping: 20 }}
            className="space-y-4 max-w-sm mx-auto"
          >
            {status === "attending" && (foundGuest?.max_companions ?? 0) > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="flex items-center gap-2 text-xs sm:text-sm mb-1 text-left" style={{ color: "var(--inv-text-secondary)" }}>
                  <Users className="w-3.5 h-3.5" />
                  Number of companions (max {foundGuest?.max_companions})
                </label>
                <input
                  type="number"
                  min={0}
                  max={foundGuest?.max_companions ?? 0}
                  value={companions}
                  onChange={e => setCompanions(Math.min(Number(e.target.value), foundGuest?.max_companions ?? 0))}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition-all"
                  style={inputStyle}
                />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center gap-2 text-xs sm:text-sm mb-1 text-left" style={{ color: "var(--inv-text-secondary)" }}>
                <MessageSquare className="w-3.5 h-3.5" />
                Message for the host (optional)
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:outline-none transition-all"
                style={inputStyle}
                placeholder="Write a heartfelt message..."
              />
            </motion.div>
            {status === "attending" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="flex items-center gap-2 text-xs sm:text-sm mb-1 text-left" style={{ color: "var(--inv-text-secondary)" }}>
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  Dietary restrictions (optional)
                </label>
                <input
                  value={dietary}
                  onChange={e => setDietary(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition-all"
                  style={inputStyle}
                  placeholder="e.g. Vegetarian, No pork"
                />
              </motion.div>
            )}
            <motion.div 
              className="flex gap-3 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                onClick={() => setStep(1)} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-3 rounded-xl border font-medium text-sm transition-all" 
                style={{ borderColor: "var(--inv-accent)", color: "var(--inv-text)" }}
              >
                Back
              </motion.button>
              <motion.button
                onClick={submitRsvp}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 rounded-xl font-medium disabled:opacity-50 text-sm transition-all relative overflow-hidden"
                style={btnStyle}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit RSVP
                  </span>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
