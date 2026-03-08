import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Invitation = Tables<"invitations">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function CoverSection({ invitation, variant = "classic" }: { invitation: Invitation; variant?: Variant }) {
  const date = invitation.event_date ? format(new Date(invitation.event_date), "MMMM d, yyyy") : "";

  const layouts: Record<Variant, React.ReactNode> = {
    classic: (
      <div className="h-screen w-full flex flex-col items-center justify-center relative">
        {invitation.cover_image_url && (
          <div className="absolute inset-0">
            <img src={invitation.cover_image_url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        <div className="relative z-10 text-center text-white space-y-6">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm tracking-[0.3em] uppercase opacity-80">
            You are invited to
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-5xl md:text-7xl font-bold" style={{ fontFamily: "var(--inv-font-title)" }}>
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-lg tracking-widest">{date}</motion.p>
        </div>
      </div>
    ),
    modern: (
      <div className="h-screen w-full flex items-end relative">
        {invitation.cover_image_url && <img src={invitation.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 p-8 md:p-16 text-white space-y-3 max-w-xl">
          <motion.h1 initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-4xl md:text-6xl font-black" style={{ fontFamily: "var(--inv-font-title)" }}>
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl opacity-90">{date}</motion.p>
        </div>
      </div>
    ),
    elegant: (
      <div className="h-screen w-full flex items-center justify-center relative" style={{ background: "var(--inv-secondary)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, var(--inv-primary) 0%, transparent 50%)" }} />
        <div className="relative text-center space-y-8">
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} className="w-24 h-px mx-auto" style={{ background: "var(--inv-accent)" }} />
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-5xl md:text-7xl italic" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="tracking-[0.4em] text-sm uppercase" style={{ color: "var(--inv-text-secondary)" }}>{date}</motion.p>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} className="w-24 h-px mx-auto" style={{ background: "var(--inv-accent)" }} />
        </div>
      </div>
    ),
    bold: (
      <div className="h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: "var(--inv-primary)" }}>
        {invitation.cover_image_url && <img src={invitation.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />}
        <div className="relative text-center space-y-4">
          <motion.h1 initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl md:text-9xl font-black uppercase tracking-tight" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-secondary)" }}>
            {invitation.celebrant_name || invitation.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-2xl font-light" style={{ color: "var(--inv-secondary)" }}>{date}</motion.p>
        </div>
      </div>
    ),
  };

  return <>{layouts[variant]}</>;
}
