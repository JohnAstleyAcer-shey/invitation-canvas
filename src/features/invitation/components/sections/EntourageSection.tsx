import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";

interface Person {
  id: string;
  person_name: string;
  image_url?: string | null;
  role_description?: string | null;
  message?: string | null;
  gift_description?: string | null;
}

type Variant = "classic" | "modern" | "elegant" | "bold";

interface EntourageSectionProps {
  title: string;
  icon: React.ReactNode;
  people: Person[];
  variant?: Variant;
  descKey?: "role_description" | "message" | "gift_description";
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const staggerItem = {
  hidden: { opacity: 0, scale: 0.8, y: 20, filter: "blur(4px)" },
  visible: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function EntourageSection({ title, icon, people, variant = "classic", descKey = "role_description" }: EntourageSectionProps) {
  if (!people.length) return null;

  return (
    <SectionWrapper className="!overflow-y-auto">
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="mb-4"
      >
        {icon}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl sm:text-3xl mb-6 sm:mb-8"
        style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}
      >
        {variant === "bold" ? title.toUpperCase() : title}
      </motion.h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        {people.map((p, i) => (
          <motion.div
            key={p.id}
            variants={staggerItem}
            whileHover={{ y: -4, scale: 1.03 }}
            className="flex flex-col items-center gap-2 transition-all duration-300 cursor-default"
          >
            {p.image_url ? (
              <motion.img
                whileHover={{ scale: 1.08 }}
                src={p.image_url} alt={p.person_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 shadow-md transition-all duration-300"
                style={{ borderColor: "var(--inv-accent)" }}
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold shadow-inner transition-all duration-300"
                style={{ background: "var(--inv-accent)", color: "var(--inv-secondary)", opacity: 0.4 }}
              >
                {p.person_name.charAt(0)}
              </motion.div>
            )}
            <p className="font-semibold text-xs sm:text-sm leading-tight" style={{ color: "var(--inv-text)" }}>{p.person_name}</p>
            {p[descKey] && <p className="text-[10px] sm:text-xs leading-tight" style={{ color: "var(--inv-text-secondary)" }}>{p[descKey]}</p>}
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
