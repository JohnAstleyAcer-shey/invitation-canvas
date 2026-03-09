import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, X, User } from "lucide-react";

interface Companion {
  name: string;
  dietary?: string;
}

interface CompanionDetailsFormProps {
  maxCompanions: number;
  companions: number;
  onCompanionsChange: (count: number) => void;
  companionDetails: Companion[];
  onCompanionDetailsChange: (details: Companion[]) => void;
}

export function CompanionDetailsForm({
  maxCompanions,
  companions,
  onCompanionsChange,
  companionDetails,
  onCompanionDetailsChange,
}: CompanionDetailsFormProps) {
  const handleCountChange = (count: number) => {
    const clamped = Math.min(Math.max(0, count), maxCompanions);
    onCompanionsChange(clamped);
    // Adjust details array
    const newDetails = [...companionDetails];
    while (newDetails.length < clamped) newDetails.push({ name: "", dietary: "" });
    while (newDetails.length > clamped) newDetails.pop();
    onCompanionDetailsChange(newDetails);
  };

  const updateDetail = (idx: number, field: keyof Companion, value: string) => {
    const updated = [...companionDetails];
    updated[idx] = { ...updated[idx], [field]: value };
    onCompanionDetailsChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Counter */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "var(--inv-text-secondary)" }}>
          <UserPlus className="w-3.5 h-3.5" />
          Companions (max {maxCompanions})
        </label>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCountChange(companions - 1)}
            disabled={companions <= 0}
            className="w-8 h-8 rounded-full border flex items-center justify-center text-lg disabled:opacity-30 transition-opacity"
            style={{ borderColor: "var(--inv-accent)", color: "var(--inv-text)" }}
          >
            −
          </motion.button>
          <span className="w-6 text-center text-sm font-medium" style={{ color: "var(--inv-text)" }}>
            {companions}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCountChange(companions + 1)}
            disabled={companions >= maxCompanions}
            className="w-8 h-8 rounded-full border flex items-center justify-center text-lg disabled:opacity-30 transition-opacity"
            style={{ borderColor: "var(--inv-accent)", color: "var(--inv-text)" }}
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Companion detail fields */}
      <AnimatePresence>
        {companionDetails.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-xl space-y-2" style={{ background: "var(--inv-primary)", opacity: 0.05 }}>
              <div className="flex items-center gap-2" style={{ opacity: 1 }}>
                <User className="w-3 h-3" style={{ color: "var(--inv-text-secondary)" }} />
                <span className="text-[10px] font-medium" style={{ color: "var(--inv-text-secondary)" }}>
                  Companion {i + 1}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl space-y-2 border mt-1" style={{ borderColor: "var(--inv-accent)" }}>
              <input
                value={c.name}
                onChange={(e) => updateDetail(i, "name", e.target.value)}
                placeholder={`Companion ${i + 1} name`}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:outline-none transition-all"
                style={{ borderColor: "var(--inv-accent)", color: "var(--inv-text)", background: "transparent" }}
              />
              <input
                value={c.dietary || ""}
                onChange={(e) => updateDetail(i, "dietary", e.target.value)}
                placeholder="Dietary notes (optional)"
                className="w-full px-3 py-2 rounded-lg border text-xs focus:ring-2 focus:outline-none transition-all"
                style={{ borderColor: "var(--inv-accent)", color: "var(--inv-text)", background: "transparent" }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
