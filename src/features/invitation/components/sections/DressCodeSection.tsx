import { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";
import { Shirt, Sparkles, CheckCircle2, Info } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DressCodeColor = Tables<"dress_code_colors">;
type Variant = "classic" | "modern" | "elegant" | "bold";

function ColorSwatch({ color, index, isSelected, onClick }: { 
  color: DressCodeColor; 
  index: number; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate if color is light or dark for text contrast
  const isLightColor = (hex: string) => {
    const c = hex.replace("#", "");
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 128;
  };

  const textColor = isLightColor(color.color_hex) ? "#1a1a1a" : "#ffffff";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -20 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay: index * 0.1, 
        type: "spring", 
        damping: 12,
        stiffness: 200
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer"
    >
      <motion.div
        className="relative"
        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
        whileHover={{ scale: 1.15, y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ background: color.color_hex }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered || isSelected ? 0.4 : 0, scale: isHovered ? 1.2 : 0.8 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Main swatch */}
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 shadow-lg relative overflow-hidden"
          style={{ 
            background: color.color_hex, 
            borderColor: isSelected ? "var(--inv-primary)" : "var(--inv-accent)",
            boxShadow: isSelected ? `0 0 20px ${color.color_hex}40` : undefined
          }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.5 }}
          />
          
          {/* Sparkle on hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1 right-1"
            >
              <Sparkles className="w-3 h-3" style={{ color: textColor }} />
            </motion.div>
          )}

          {/* Selection indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <CheckCircle2 className="w-6 h-6" style={{ color: textColor }} />
            </motion.div>
          )}
        </motion.div>

        {/* Pulse ring on selection */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${color.color_hex}` }}
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
      
      {/* Color name */}
      {color.color_name && (
        <motion.p 
          className="text-xs sm:text-sm font-medium text-center"
          style={{ color: "var(--inv-text)" }}
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {color.color_name}
        </motion.p>
      )}
      
      {/* Color description */}
      {color.description && (
        <motion.p 
          className="text-[10px] text-center max-w-[80px]"
          style={{ color: "var(--inv-text-secondary)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          {color.description}
        </motion.p>
      )}
    </motion.div>
  );
}

export function DressCodeSection({ colors, variant = "classic" }: { colors: DressCodeColor[]; variant?: Variant }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  if (!colors.length) return null;

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
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Shirt className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
        </motion.div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl mb-2" 
        style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
      >
        {variant === "bold" ? "DRESS CODE" : "Dress Code"}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-xs sm:text-sm mb-6 sm:mb-8 flex items-center justify-center gap-2"
        style={{ color: "var(--inv-text-secondary)" }}
      >
        <Info className="w-3.5 h-3.5" />
        Tap a color to see details
      </motion.p>

      {/* Color palette */}
      <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
        {colors.map((c, i) => (
          <ColorSwatch
            key={c.id}
            color={c}
            index={i}
            isSelected={selectedIndex === i}
            onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
          />
        ))}
      </div>

      {/* Selected color details */}
      {selectedIndex !== null && colors[selectedIndex] && (
        <motion.div
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="mt-8 p-4 rounded-xl border"
          style={{ 
            borderColor: colors[selectedIndex].color_hex,
            background: `${colors[selectedIndex].color_hex}10`
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border-2"
              style={{ 
                background: colors[selectedIndex].color_hex,
                borderColor: "var(--inv-accent)"
              }}
            />
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ color: "var(--inv-text)" }}>
                {colors[selectedIndex].color_name || "Selected Color"}
              </p>
              <p className="text-xs" style={{ color: "var(--inv-text-secondary)" }}>
                {colors[selectedIndex].color_hex.toUpperCase()}
              </p>
            </div>
          </div>
          {colors[selectedIndex].description && (
            <p className="mt-2 text-xs" style={{ color: "var(--inv-text-secondary)" }}>
              {colors[selectedIndex].description}
            </p>
          )}
        </motion.div>
      )}

      {/* Decorative elements */}
      <motion.div
        className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: colors[0]?.color_hex || "var(--inv-accent)" }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
    </SectionWrapper>
  );
}
