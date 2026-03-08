import { useState, useEffect } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Variant = "classic" | "modern" | "elegant" | "bold";

function useCountdown(targetDate: string | null) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: false });
  useEffect(() => {
    if (!targetDate) return;
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: true }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        passed: false,
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function CountdownUnit({ value, label, variant, index }: { value: number; label: string; variant: Variant; index: number }) {
  const boxStyles: Record<Variant, string> = {
    classic: "p-4 sm:p-6 rounded-xl border",
    modern: "p-4 sm:p-6 rounded-none border-b-2",
    elegant: "p-4 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-sm",
    bold: "p-4 sm:p-6 rounded-none",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, type: "spring", damping: 15, stiffness: 150 }}
      whileHover={{ y: -4, scale: 1.05 }}
      className={`${boxStyles[variant]} transition-all duration-300`}
      style={{ borderColor: "var(--inv-accent)" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ y: -15, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 15, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums"
          style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
        >
          {String(value).padStart(2, "0")}
        </motion.div>
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12 + 0.3 }}
        className="text-[10px] sm:text-xs mt-2 uppercase tracking-widest"
        style={{ color: "var(--inv-text-secondary)" }}
      >{label}</motion.div>
    </motion.div>
  );
}

export function CountdownSection({ invitation, variant = "classic" }: { invitation: Invitation; variant?: Variant }) {
  const { days, hours, minutes, seconds, passed } = useCountdown(invitation.event_date);
  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  if (passed) {
    return (
      <SectionWrapper>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
        >
          <motion.h2
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
          >
            The celebration has begun! 🎉
          </motion.h2>
        </motion.div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl sm:text-3xl mb-8 sm:mb-10"
        style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
      >
        {variant === "bold" ? "COUNTING DOWN" : "Save the Date"}
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
        {units.map((u, i) => (
          <CountdownUnit key={u.label} value={u.value} label={u.label} variant={variant} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
