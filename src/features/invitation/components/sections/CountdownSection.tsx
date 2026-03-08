import { useState, useEffect } from "react";
import { SectionWrapper } from "./SectionWrapper";
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

export function CountdownSection({ invitation, variant = "classic" }: { invitation: Invitation; variant?: Variant }) {
  const { days, hours, minutes, seconds, passed } = useCountdown(invitation.event_date);
  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  if (passed) {
    return <SectionWrapper><h2 className="text-4xl" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>The celebration has begun! 🎉</h2></SectionWrapper>;
  }

  const boxStyles: Record<Variant, string> = {
    classic: "p-6 rounded-xl border",
    modern: "p-6 rounded-none border-b-2",
    elegant: "p-8 rounded-2xl bg-white/10 backdrop-blur-sm",
    bold: "p-6 rounded-none",
  };

  return (
    <SectionWrapper>
      <h2 className="text-3xl mb-10" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "COUNTING DOWN" : "Save the Date"}
      </h2>
      <div className="grid grid-cols-4 gap-3 md:gap-6">
        {units.map(u => (
          <div key={u.label} className={boxStyles[variant]} style={{ borderColor: "var(--inv-accent)" }}>
            <div className="text-4xl md:text-5xl font-bold tabular-nums" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
              {String(u.value).padStart(2, "0")}
            </div>
            <div className="text-xs mt-2 uppercase tracking-widest" style={{ color: "var(--inv-text-secondary)" }}>{u.label}</div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
