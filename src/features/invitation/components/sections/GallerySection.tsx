import { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type GalleryImage = Tables<"gallery_images">;
type Variant = "classic" | "modern" | "elegant" | "bold";

export function GallerySection({ images, variant = "classic" }: { images: GalleryImage[]; variant?: Variant }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!images.length) return null;

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) setSelectedIdx((selectedIdx + 1) % images.length);
  };
  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
  };

  return (
    <SectionWrapper className="!overflow-y-auto">
      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }}>
        <ImageIcon className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? "GALLERY" : "Photo Gallery"}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedIdx(i)}
            className="relative aspect-square overflow-hidden rounded-lg group"
          >
            <img src={img.image_url} alt={img.caption || ""} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] sm:text-xs p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                {img.caption}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedIdx(null)}
          >
            <button className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10" onClick={() => setSelectedIdx(null)}>
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button onClick={goPrev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10">
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button onClick={goNext} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10">
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.img
              key={selectedIdx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[selectedIdx].image_url}
              alt={images[selectedIdx].caption || ""}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />

            {images[selectedIdx].caption && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm text-center max-w-md">{images[selectedIdx].caption}</p>
            )}

            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/40 text-xs">{selectedIdx + 1} / {images.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
