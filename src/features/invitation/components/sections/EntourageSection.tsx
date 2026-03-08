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
    <SectionWrapper>
      <div className="mb-4">{icon}</div>
      <h2 className="text-3xl mb-8" style={{ fontFamily: "var(--inv-font-title)", color: "var(--inv-text)" }}>
        {variant === "bold" ? title.toUpperCase() : title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {people.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-2"
          >
            {p.image_url ? (
              <img src={p.image_url} alt={p.person_name} className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: "var(--inv-accent)" }} />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "var(--inv-accent)", color: "var(--inv-secondary)", opacity: 0.3 }}>
                {p.person_name.charAt(0)}
              </div>
            )}
            <p className="font-semibold text-sm" style={{ color: "var(--inv-text)" }}>{p.person_name}</p>
            {p[descKey] && <p className="text-xs" style={{ color: "var(--inv-text-secondary)" }}>{p[descKey]}</p>}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
