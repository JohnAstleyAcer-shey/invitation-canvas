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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 group"
      aria-label="Scroll down"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.5 }}
        className="text-[10px] uppercase tracking-[0.3em] group-hover:opacity-100 transition-opacity"
      >
        Scroll
      </motion.span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 opacity-60" />
      </motion.div>
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/20"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
    </motion.button>
  );

  // Shared animated line
  const AnimatedLine = ({ delay = 0.8, color = "bg-white/50" }: { delay?: number; color?: string }) => (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`w-16 h-px ${color} mx-auto origin-center`}
    />
  );

  const layouts: Record<Variant, React.ReactNode> = {
    classic: (
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative">
        {invitation.cover_image_url && (
          <div className="absolute inset-0">
            <motion.img
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
              src={invitation.cover_image_url} alt="" className="w-full h-full object-cover" loading="eager"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/65"
            />
          </div>
        )}
        <div className="relative z-10 text-center text-white space-y-6 px-6">
          <motion.p
            initial={{ opacity: 0, y: -15, filter: "blur(4px)" }}
            animate={{ opacity: 0.8, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs sm:text-sm tracking-[0.3em] uppercase"
          >
            You are invited to
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(12px)", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight drop-shadow-2xl"
            style={{ fontFamily: "var(--inv-font-title)" }}
          >
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          {date && (
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 0.8, letterSpacing: "0.25em" }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-base sm:text-lg tracking-widest"
            >{date}</motion.p>
          )}
          <AnimatedLine delay={1.3} />
        </div>
        <ScrollHint />
      </div>
    ),
    modern: (
      <div className="min-h-screen w-full flex items-end relative">
        {invitation.cover_image_url && (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
            src={invitation.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager"
          />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
        />
        <div className="relative z-10 p-6 sm:p-8 md:p-16 text-white space-y-3 max-w-xl w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-1 bg-white/60 rounded-full"
          />
          <motion.h1
            initial={{ x: -50, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight"
            style={{ fontFamily: "var(--inv-font-title)" }}
          >
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p
            initial={{ x: -50, opacity: 0, filter: "blur(8px)" }}
            animate={{ x: 0, opacity: 0.9, filter: "blur(0px)" }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-lg sm:text-xl"
          >{date}</motion.p>
        </div>
        <ScrollHint />
      </div>
    ),
    elegant: (
      <div className="min-h-screen w-full flex items-center justify-center relative" style={{ background: "var(--inv-secondary)" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, var(--inv-primary) 0%, transparent 50%)" }}
        />
        <div className="relative text-center space-y-8 px-6">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-px mx-auto" style={{ background: "var(--inv-accent)" }}
          />
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs uppercase" style={{ color: "var(--inv-text-secondary)" }}
          >You are cordially invited</motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl italic leading-tight"
            style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
          >
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="tracking-[0.4em] text-xs sm:text-sm uppercase"
            style={{ color: "var(--inv-text-secondary)" }}
          >{date}</motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-px mx-auto" style={{ background: "var(--inv-accent)" }}
          />
        </div>
        <ScrollHint />
      </div>
    ),
    bold: (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: "var(--inv-primary)" }}>
        {invitation.cover_image_url && (
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2 }}
            src={invitation.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" loading="eager"
          />
        )}
        <div className="relative text-center space-y-4 px-6">
          <motion.h1
            initial={{ scale: 0.4, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="text-5xl sm:text-6xl md:text-9xl font-black uppercase tracking-tight leading-none"
            style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-secondary)" }}
          >
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl sm:text-2xl font-light"
            style={{ color: "var(--inv-secondary)" }}
          >{date}</motion.p>
        </div>
        <ScrollHint />
      </div>
    ),
  };

  return <>{layouts[variant]}</>;
}
