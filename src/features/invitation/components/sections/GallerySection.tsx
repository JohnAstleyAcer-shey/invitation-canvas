import { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type GalleryImage = Tables<"gallery_images">;
type Variant = "classic" | "modern" | "elegant" | "bold";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const staggerItem = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(4px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" as const } },
};

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
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
      >
        <ImageIcon className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl sm:text-3xl mb-6 sm:mb-8"
        style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
      >
        {variant === "bold" ? "GALLERY" : "Photo Gallery"}
      </motion.h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2"
      >
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            variants={staggerItem}
            whileHover={{ scale: 1.04, zIndex: 10 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedIdx(i)}
            className="relative aspect-square overflow-hidden rounded-lg group shadow-sm hover:shadow-xl transition-shadow duration-300"
          >
            <img src={img.image_url} alt={img.caption || ""} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] sm:text-xs p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {img.caption}
              </div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Lightbox with enhanced animations */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedIdx(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
              onClick={() => setSelectedIdx(null)}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goPrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
                >
                  <ChevronLeft className="w-8 h-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
                >
                  <ChevronRight className="w-8 h-8" />
                </motion.button>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={selectedIdx}
                initial={{ scale: 0.8, opacity: 0, rotateY: 10 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: -10 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                src={images[selectedIdx].image_url}
                alt={images[selectedIdx].caption || ""}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={e => e.stopPropagation()}
              />
            </AnimatePresence>

            {images[selectedIdx].caption && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm text-center max-w-md bg-black/40 backdrop-blur-sm rounded-full px-4 py-1.5"
              >
                {images[selectedIdx].caption}
              </motion.p>
            )}

            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/40 text-xs">{selectedIdx + 1} / {images.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
