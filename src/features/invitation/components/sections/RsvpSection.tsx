import { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, HelpCircle, Send, Loader2, PartyPopper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Guest = Tables<"guests">;
type RsvpStatus = "attending" | "not_attending" | "maybe";
type Variant = "classic" | "modern" | "elegant" | "bold";

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
    else { setDone(true); toast.success("RSVP submitted!"); }
  };

  const btnStyle = { background: "var(--inv-primary)", color: "var(--inv-secondary)" };
  const inputStyle: React.CSSProperties = { borderColor: "var(--inv-accent)", color: "var(--inv-text)", background: "transparent" };

  if (done) {
    return (
      <SectionWrapper>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 12 }} className="space-y-4">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{ background: "var(--inv-primary)" }}
          >
            <PartyPopper className="w-10 h-10" style={{ color: "var(--inv-secondary)" }} />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>Thank You!</h2>
          <p className="text-sm sm:text-base" style={{ color: "var(--inv-text-secondary)" }}>Your response has been recorded.</p>
        </motion.div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
        <Send className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "RSVP" : "Kindly Respond"}
      </h2>

      <AnimatePresence mode="wait">
        {step === 0 && !foundGuest && (
          <motion.div key="code" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4 max-w-xs mx-auto">
            <p className="text-xs sm:text-sm" style={{ color: "var(--inv-text-secondary)" }}>Enter your invitation code</p>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. A1B2C3D4"
              className="w-full px-4 py-3 rounded-xl border text-center text-lg tracking-widest focus:ring-2 focus:outline-none transition-shadow"
              style={{ ...inputStyle, boxShadow: code ? "0 0 0 2px var(--inv-primary)" : undefined }}
              maxLength={8}
              onKeyDown={e => e.key === "Enter" && lookupGuest()}
            />
            <button
              onClick={lookupGuest}
              disabled={loading || !code.trim()}
              className="w-full px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={btnStyle}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Find My Invitation"}
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            <p className="text-base sm:text-lg font-medium" style={{ color: "var(--inv-text)" }}>Hi, {foundGuest?.full_name}!</p>
            <p className="text-xs sm:text-sm" style={{ color: "var(--inv-text-secondary)" }}>Will you be attending?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              {([
                { key: "attending" as const, label: "Yes, I'll be there!", icon: <Check className="w-5 h-5" /> },
                { key: "maybe" as const, label: "Maybe", icon: <HelpCircle className="w-5 h-5" /> },
                { key: "not_attending" as const, label: "Can't make it", icon: <X className="w-5 h-5" /> },
              ]).map(opt => (
                <motion.button
                  key={opt.key}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setStatus(opt.key); setStep(2); }}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 font-medium transition-all text-sm"
                  style={{
                    borderColor: status === opt.key ? "var(--inv-primary)" : "var(--inv-accent)",
                    background: status === opt.key ? "var(--inv-primary)" : "transparent",
                    color: status === opt.key ? "var(--inv-secondary)" : "var(--inv-text)",
                  }}
                >
                  {opt.icon} {opt.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4 max-w-sm mx-auto">
            {status === "attending" && (foundGuest?.max_companions ?? 0) > 0 && (
              <div>
                <label className="block text-xs sm:text-sm mb-1 text-left" style={{ color: "var(--inv-text-secondary)" }}>Number of companions (max {foundGuest?.max_companions})</label>
                <input
                  type="number"
                  min={0}
                  max={foundGuest?.max_companions ?? 0}
                  value={companions}
                  onChange={e => setCompanions(Math.min(Number(e.target.value), foundGuest?.max_companions ?? 0))}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none"
                  style={inputStyle}
                />
              </div>
            )}
            <div>
              <label className="block text-xs sm:text-sm mb-1 text-left" style={{ color: "var(--inv-text-secondary)" }}>Message for the host (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:outline-none"
                style={inputStyle}
              />
            </div>
            {status === "attending" && (
              <div>
                <label className="block text-xs sm:text-sm mb-1 text-left" style={{ color: "var(--inv-text-secondary)" }}>Dietary restrictions (optional)</label>
                <input
                  value={dietary}
                  onChange={e => setDietary(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none"
                  style={inputStyle}
                />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ borderColor: "var(--inv-accent)", color: "var(--inv-text)" }}>
                Back
              </button>
              <button
                onClick={submitRsvp}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl font-medium disabled:opacity-50 text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={btnStyle}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit RSVP"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
