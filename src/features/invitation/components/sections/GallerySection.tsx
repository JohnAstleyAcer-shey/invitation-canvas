import { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type GalleryImage = Tables<"gallery_images">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function GallerySection({ images, variant = "classic" }: { images: GalleryImage[]; variant?: Variant }) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  if (!images.length) return null;

  return (
    <SectionWrapper className="!overflow-y-auto">
      <ImageIcon className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      <h2 className="text-3xl mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "GALLERY" : "Photo Gallery"}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(img)}
            className="relative aspect-square overflow-hidden rounded-lg group"
          >
            <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {img.caption}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-4 right-4 text-white p-2" onClick={() => setSelected(null)}><X /></button>
            <img src={selected.image_url} alt={selected.caption || ""} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
