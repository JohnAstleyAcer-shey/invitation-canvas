import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface EnvelopeSettings {
  background_image_url?: string | null;
  background_color?: string;
  envelope_style?: "classic-cream" | "navy-formal" | "blush-romance" | "kraft-rustic" | "black-luxe" | "sage-botanical" | "blue-watercolor" | "ivory-silk" | "burgundy-velvet" | "gold-foil";
  envelope_color?: string;
  seal_style?: "wax-leaf" | "wax-monogram" | "wax-heart" | "ribbon-bow" | "stamp-circle" | "none";
  seal_color?: string;
  seal_image_url?: string | null;
  title_text?: string;
  title_font?: string;
  title_color?: string;
  subtitle_text?: string;
  cta_text?: string;
  cta_style?: "minimal" | "outline" | "filled" | "shimmer";
  stamp_text?: string;
  show_stamp?: boolean;
}

const ENVELOPE_PRESETS: Record<string, { color: string; flap: string; text: string }> = {
  "classic-cream": { color: "#f5f1e8", flap: "#ebe5d4", text: "#5a4a32" },
  "navy-formal": { color: "#1f2d44", flap: "#152033", text: "#e6cc8a" },
  "blush-romance": { color: "#dfc5cb", flap: "#cdb0b8", text: "#5a3540" },
  "kraft-rustic": { color: "#c9a982", flap: "#b59770", text: "#3a2814" },
  "black-luxe": { color: "#1a1a1a", flap: "#0d0d0d", text: "#d4af6f" },
  "sage-botanical": { color: "#a8b896", flap: "#92a47e", text: "#2a3520" },
  "blue-watercolor": { color: "#a4b8c8", flap: "#8fa3b5", text: "#f4d97c" },
  "ivory-silk": { color: "#f8f4ed", flap: "#ede6d3", text: "#7a5a32" },
  "burgundy-velvet": { color: "#5a1f2a", flap: "#421520", text: "#e8c989" },
  "gold-foil": { color: "#d4af6f", flap: "#b8924f", text: "#3a2814" },
};

export const ENVELOPE_PRESET_OPTIONS = Object.keys(ENVELOPE_PRESETS) as Array<keyof typeof ENVELOPE_PRESETS>;

interface EnvelopeCoverProps {
  settings: EnvelopeSettings;
  onOpen: () => void;
}

export function EnvelopeCover({ settings, onOpen }: EnvelopeCoverProps) {
  const [opening, setOpening] = useState(false);
  const preset = ENVELOPE_PRESETS[settings.envelope_style || "classic-cream"];
  const envColor = settings.envelope_color || preset.color;
  const flapColor = preset.flap;
  const titleColor = settings.title_color || preset.text;
  const sealColor = settings.seal_color || preset.text;

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 1100);
  };

  // Load envelope title font
  const titleFont = settings.title_font || "Great Vibes";
  if (typeof document !== "undefined" && titleFont) {
    const id = `envfont-${titleFont.replace(/\s/g, "")}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${titleFont.replace(/ /g, "+")}:wght@400;500;600&display=swap`;
      document.head.appendChild(link);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 py-10 overflow-hidden"
      style={{
        background: settings.background_image_url
          ? `url(${settings.background_image_url}) center/cover no-repeat`
          : settings.background_color || "#e5e0d6",
      }}
    >
      {/* Subtle texture/vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/15 pointer-events-none" />

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative text-center mb-8 text-2xl sm:text-4xl"
        style={{ fontFamily: `'${titleFont}', cursive`, color: titleColor }}
      >
        {settings.title_text || "A Special Message Awaits..."}
      </motion.p>

      <AnimatePresence>
        {!opening && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.4, opacity: 0, y: -100, rotateY: 180 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04, y: -4 }}
            onClick={handleOpen}
            className="relative cursor-pointer"
            style={{ width: "min(90vw, 380px)", aspectRatio: "16/10", perspective: "1000px" }}
            aria-label="Open invitation"
          >
            {/* Envelope body */}
            <div
              className="absolute inset-0 rounded-md shadow-2xl"
              style={{
                background: envColor,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4), inset 0 0 60px rgba(0,0,0,0.05)",
              }}
            >
              {/* Diagonal flap lines */}
              <div className="absolute inset-0 overflow-hidden rounded-md">
                <div
                  className="absolute inset-x-0 top-0 h-1/2"
                  style={{
                    background: `linear-gradient(180deg, ${flapColor} 0%, ${envColor} 100%)`,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2"
                  style={{
                    background: envColor,
                    clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                    opacity: 0.2,
                  }}
                />
              </div>

              {/* Wax seal */}
              {settings.seal_style !== "none" && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: "spring", damping: 12 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${sealColor}ee, ${sealColor}aa 70%, ${sealColor} 100%)`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.2)`,
                  }}
                >
                  {settings.seal_image_url ? (
                    <img src={settings.seal_image_url} alt="" className="w-2/3 h-2/3 object-contain" />
                  ) : (
                    <span className="text-white/80 text-xs font-serif italic">{settings.seal_style === "wax-heart" ? "♥" : "✦"}</span>
                  )}
                </motion.div>
              )}

              {/* Stamp */}
              {settings.show_stamp && (
                <div
                  className="absolute top-2 right-2 w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed flex items-center justify-center text-[8px] font-bold uppercase rotate-12"
                  style={{ borderColor: titleColor, color: titleColor, background: "rgba(255,255,255,0.06)" }}
                >
                  {settings.stamp_text || "Invited"}
                </div>
              )}
            </div>

            {/* Animated open flap */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={opening ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-x-0 top-0 h-1/2 origin-top pointer-events-none"
              style={{
                background: flapColor,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!opening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            {settings.subtitle_text && (
              <p className="text-sm" style={{ color: titleColor, opacity: 0.85, fontFamily: `'${titleFont}', cursive` }}>
                {settings.subtitle_text}
              </p>
            )}
            <button
              onClick={handleOpen}
              className={`mt-2 px-6 py-2.5 text-xs font-semibold tracking-[0.3em] transition-all rounded-full ${
                settings.cta_style === "filled" ? "shadow-lg" :
                settings.cta_style === "outline" ? "border-2 bg-transparent" :
                settings.cta_style === "shimmer" ? "bg-gradient-to-r from-transparent via-white/20 to-transparent border" :
                "bg-transparent"
              }`}
              style={{
                color: titleColor,
                borderColor: titleColor,
                background: settings.cta_style === "filled" ? titleColor : undefined,
                ...(settings.cta_style === "filled" ? { color: envColor } : {}),
              }}
            >
              {settings.cta_text || "CLICK TO OPEN"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles for delight */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ background: titleColor, opacity: 0.3, left: `${10 + (i * 7) % 80}%`, top: `${15 + (i * 11) % 70}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
