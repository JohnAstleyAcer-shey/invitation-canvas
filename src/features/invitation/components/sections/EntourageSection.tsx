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

export function EntourageSection({ title, icon, people, variant = "classic", descKey = "role_description" }: EntourageSectionProps) {
  if (!people.length) return null;

  return (
    <SectionWrapper className="!overflow-y-auto">
      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", damping: 15 }} className="mb-4">
        {icon}
      </motion.div>
      <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? title.toUpperCase() : title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {people.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, type: "spring", damping: 15 }}
            className="flex flex-col items-center gap-2"
          >
            {p.image_url ? (
              <img src={p.image_url} alt={p.person_name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 shadow-md" style={{ borderColor: "var(--inv-accent)" }} />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold shadow-inner" style={{ background: "var(--inv-accent)", color: "var(--inv-secondary)", opacity: 0.4 }}>
                {p.person_name.charAt(0)}
              </div>
            )}
            <p className="font-semibold text-xs sm:text-sm leading-tight" style={{ color: "var(--inv-text)" }}>{p.person_name}</p>
            {p[descKey] && <p className="text-[10px] sm:text-xs leading-tight" style={{ color: "var(--inv-text-secondary)" }}>{p[descKey]}</p>}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
