import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Invitation = Tables<"invitations">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function CoverSection({ invitation, variant = "classic" }: { invitation: Invitation; variant?: Variant }) {
  const date = invitation.event_date ? format(new Date(invitation.event_date), "MMMM d, yyyy") : "";

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  const ScrollHint = () => (
    <motion.button
      onClick={scrollDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 group"
      aria-label="Scroll down"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">Scroll</span>
      <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
        <ChevronDown className="w-5 h-5 opacity-60" />
      </motion.div>
    </motion.button>
  );

  const layouts: Record<Variant, React.ReactNode> = {
    classic: (
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative">
        {invitation.cover_image_url && (
          <div className="absolute inset-0">
            <img src={invitation.cover_image_url} alt="" className="w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
          </div>
        )}
        <div className="relative z-10 text-center text-white space-y-6 px-6">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-xs sm:text-sm tracking-[0.3em] uppercase opacity-80">
            You are invited to
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: "var(--inv-font-title)" }}>
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          {date && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="text-base sm:text-lg tracking-widest opacity-80">{date}</motion.p>
          )}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.6 }} className="w-16 h-px bg-white/50 mx-auto" />
        </div>
        <ScrollHint />
      </div>
    ),
    modern: (
      <div className="min-h-screen w-full flex items-end relative">
        {invitation.cover_image_url && <img src={invitation.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 p-6 sm:p-8 md:p-16 text-white space-y-3 max-w-xl w-full">
          <motion.div initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.2 }} className="h-1 bg-white/60 rounded-full" />
          <motion.h1 initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight" style={{ fontFamily: "var(--inv-font-title)" }}>
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg sm:text-xl opacity-90">{date}</motion.p>
        </div>
        <ScrollHint />
      </div>
    ),
    elegant: (
      <div className="min-h-screen w-full flex items-center justify-center relative" style={{ background: "var(--inv-secondary)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, var(--inv-primary) 0%, transparent 50%)" }} />
        <div className="relative text-center space-y-8 px-6">
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="w-24 h-px mx-auto" style={{ background: "var(--inv-accent)" }} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xs tracking-[0.4em] uppercase" style={{ color: "var(--inv-text-secondary)" }}>You are cordially invited</motion.p>
          <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-4xl sm:text-5xl md:text-7xl italic leading-tight" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="tracking-[0.4em] text-xs sm:text-sm uppercase" style={{ color: "var(--inv-text-secondary)" }}>{date}</motion.p>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="w-24 h-px mx-auto" style={{ background: "var(--inv-accent)" }} />
        </div>
        <ScrollHint />
      </div>
    ),
    bold: (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: "var(--inv-primary)" }}>
        {invitation.cover_image_url && <img src={invitation.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" loading="eager" />}
        <div className="relative text-center space-y-4 px-6">
          <motion.h1 initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 15 }} className="text-5xl sm:text-6xl md:text-9xl font-black uppercase tracking-tight leading-none" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-secondary)" }}>
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl sm:text-2xl font-light" style={{ color: "var(--inv-secondary)" }}>{date}</motion.p>
        </div>
        <ScrollHint />
      </div>
    ),
  };

  return <>{layouts[variant]}</>;
}
