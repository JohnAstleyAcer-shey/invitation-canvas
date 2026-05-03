import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Eye, ArrowRight, Layers, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ALL_TEMPLATES, getTemplatesByCategory } from "../registry";
import { CATEGORY_LABELS, type TemplateCategory, type TemplateDef } from "../types";

interface Props {
  onPreview: (tmpl: TemplateDef) => void;
  onApply?: (tmpl: TemplateDef) => void;
  applyLabel?: string;
  defaultCategory?: TemplateCategory | "all";
  compact?: boolean;
}

export function TemplateGrid({ onPreview, onApply, applyLabel = "Apply", defaultCategory = "all", compact }: Props) {
  const [cat, setCat] = useState<TemplateCategory | "all">(defaultCategory);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const base = getTemplatesByCategory(cat);
    if (!q.trim()) return base;
    const needle = q.toLowerCase();
    return base.filter((t) =>
      t.name.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle),
    );
  }, [cat, q]);

  const categories: ({ key: TemplateCategory | "all"; label: string })[] = [
    { key: "all", label: `All (${ALL_TEMPLATES.length})` },
    ...(Object.keys(CATEGORY_LABELS) as TemplateCategory[]).map((k) => ({
      key: k,
      label: `${CATEGORY_LABELS[k]} (${ALL_TEMPLATES.filter(t => t.category === k).length})`,
    })),
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-3 p-3 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates..." className="pl-9 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                cat === c.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className={`p-4 grid gap-4 ${compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {list.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="group relative rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Visual preview block */}
              <div
                className="aspect-[4/5] relative flex items-center justify-center text-center p-6"
                style={{ background: t.palette.bg, color: t.palette.text }}
              >
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `radial-gradient(circle at 30% 20%, ${t.palette.accent}33, transparent 60%), radial-gradient(circle at 70% 80%, ${t.palette.accent}22, transparent 60%)`,
                }} />
                <div className="relative">
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-2">{CATEGORY_LABELS[t.category]}</p>
                  <h3 className="font-display text-xl sm:text-2xl font-light leading-tight">{t.name}</h3>
                  <div className="mt-3 mx-auto w-10 h-px" style={{ background: t.palette.accent }} />
                  <p className="mt-3 text-[11px] opacity-70 line-clamp-2">{t.description}</p>
                </div>
                {t.featured && (
                  <Badge className="absolute top-3 right-3 bg-amber-500/90 text-white border-0">
                    <Star className="h-2.5 w-2.5 mr-1 fill-current" /> Featured
                  </Badge>
                )}
              </div>

              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Layers className="h-3 w-3" /> {t.blocks.length} blocks
                </span>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onPreview(t)}>
                    <Eye className="h-3 w-3 mr-1" /> Preview
                  </Button>
                  {onApply && (
                    <Button size="sm" className="h-7 text-xs rounded-full" onClick={() => onApply(t)}>
                      {applyLabel} <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {list.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No templates match your search.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
