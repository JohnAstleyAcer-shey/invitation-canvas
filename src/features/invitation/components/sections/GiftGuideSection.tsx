import { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ExternalLink, Heart, Sparkles, Tag, ShoppingBag, Check, Star } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type GiftItem = Tables<"gift_items">;
type Variant = "classic" | "modern" | "elegant" | "bold";

function GiftCard({ item, index }: { item: GiftItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, type: "spring", damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="p-4 rounded-xl border transition-all relative overflow-hidden group"
      style={{ borderColor: "var(--inv-accent)" }}
    >
      {/* Background shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "100%" } : {}}
        transition={{ duration: 0.6 }}
      />

      {/* Wishlist button */}
      <motion.button
        onClick={() => setIsWishlisted(!isWishlisted)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        style={{ 
          background: isWishlisted ? "var(--inv-primary)" : "var(--inv-accent)",
          color: isWishlisted ? "var(--inv-secondary)" : "var(--inv-text)"
        }}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
      </motion.button>

      <div className="flex items-start justify-between gap-3 pr-10">
        <div className="min-w-0 flex-1">
          {/* Item icon */}
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: "var(--inv-accent)" }}
            animate={isHovered ? { rotate: [0, -5, 5, 0], scale: 1.05 } : {}}
            transition={{ duration: 0.3 }}
          >
            <ShoppingBag className="w-5 h-5" style={{ color: "var(--inv-primary)" }} />
          </motion.div>

          {/* Item name */}
          <p className="font-semibold text-sm sm:text-base" style={{ color: "var(--inv-text)" }}>
            {item.item_name}
          </p>

          {/* Description */}
          {item.description && (
            <motion.p 
              className="text-xs sm:text-sm mt-1 line-clamp-2"
              style={{ color: "var(--inv-text-secondary)" }}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0.8 }}
            >
              {item.description}
            </motion.p>
          )}

          {/* Category badge */}
          {item.category && (
            <motion.span 
              className="inline-flex items-center gap-1 text-[10px] mt-3 px-2.5 py-1 rounded-full"
              style={{ background: "var(--inv-accent)", color: "var(--inv-secondary)" }}
              whileHover={{ scale: 1.05 }}
            >
              <Tag className="w-3 h-3" />
              {item.category}
            </motion.span>
          )}
        </div>

        {/* External link */}
        {item.link_url && (
          <motion.a 
            href={item.link_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="shrink-0 p-2.5 rounded-xl transition-all"
            style={{ 
              color: "var(--inv-primary)",
              background: isHovered ? "var(--inv-accent)" : "transparent"
            }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        )}
      </div>

      {/* Hover indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5"
        style={{ background: "var(--inv-primary)" }}
        initial={{ width: 0 }}
        animate={{ width: isHovered ? "100%" : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export function GiftGuideSection({ items, variant = "classic" }: { items: GiftItem[]; variant?: Variant }) {
  const [filter, setFilter] = useState<string | null>(null);

  if (!items.length) return null;

  // Get unique categories
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))];

  // Filter items
  const filteredItems = filter
    ? items.filter(item => item.category === filter)
    : items;

  return (
    <SectionWrapper className="!overflow-y-auto">
      {/* Animated icon */}
      <motion.div 
        initial={{ scale: 0, rotate: -180 }} 
        whileInView={{ scale: 1, rotate: 0 }} 
        viewport={{ once: true }} 
        transition={{ type: "spring", damping: 15 }}
      >
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative"
        >
          <Gift className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--inv-accent)" }} />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "var(--inv-primary)" }} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl mb-2" 
        style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
      >
        {variant === "bold" ? "GIFT GUIDE" : "Gift Guide"}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-xs sm:text-sm mb-6 flex items-center justify-center gap-2"
        style={{ color: "var(--inv-text-secondary)" }}
      >
        <Star className="w-3.5 h-3.5" />
        {items.length} gift idea{items.length !== 1 ? "s" : ""}
      </motion.p>

      {/* Category filters */}
      {categories.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: filter === null ? "var(--inv-primary)" : "var(--inv-accent)",
              color: filter === null ? "var(--inv-secondary)" : "var(--inv-text)"
            }}
          >
            All ({items.length})
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat!)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filter === cat ? "var(--inv-primary)" : "var(--inv-accent)",
                color: filter === cat ? "var(--inv-secondary)" : "var(--inv-text)"
              }}
            >
              {cat} ({items.filter(i => i.category === cat).length})
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Gift list */}
      <div className="space-y-3 text-left max-w-md mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, i) => (
            <GiftCard key={item.id} item={item} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: "var(--inv-text)" }} />
          <p className="text-sm" style={{ color: "var(--inv-text-secondary)" }}>
            No items in this category.
          </p>
        </motion.div>
      )}

      {/* Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-xl text-center"
        style={{ background: "var(--inv-accent)" }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Heart className="w-4 h-4" style={{ color: "var(--inv-primary)" }} />
          <p className="text-xs font-medium" style={{ color: "var(--inv-text)" }}>
            Your presence is the best gift
          </p>
        </div>
        <p className="text-[10px]" style={{ color: "var(--inv-text-secondary)" }}>
          These are just suggestions if you'd like to bring something
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
