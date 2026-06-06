import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Monitor, ExternalLink, Calendar, Users, Sparkles, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export type ShowcaseProject = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  year: string;
  audience: string;
  status: string;
  problem: string;
  scope: string[];
  features: string[];
  techStack: string[];
  images: string[];
  liveUrl?: string;
  gradient: string;
};

interface Props {
  project: ShowcaseProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShowcaseDetailModal({ project, isOpen, onClose }: Props) {
  const [view, setView] = useState<"desktop" | "mobile">("mobile");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (project) setIdx(0);
  }, [project?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && project) setIdx((i) => (i + 1) % project.images.length);
      if (e.key === "ArrowLeft" && project) setIdx((i) => (i - 1 + project.images.length) % project.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, project, onClose]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl flex flex-col"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-accent"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto scrollbar-hide">
              {/* Carousel */}
              <div className={`relative w-full bg-gradient-to-br ${project.gradient}`}>
                <div className="absolute top-4 left-4 z-20 flex gap-1 bg-background/70 backdrop-blur border border-border rounded-full p-1">
                  <button
                    onClick={() => setView("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      view === "mobile" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" /> Mobile
                  </button>
                  <button
                    onClick={() => setView("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      view === "desktop" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" /> Desktop
                  </button>
                </div>

                <div className="relative h-[340px] sm:h-[460px] flex items-center justify-center px-4 sm:px-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${project.id}-${idx}-${view}`}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.3 }}
                      className={`relative overflow-hidden shadow-2xl ${
                        view === "mobile"
                          ? "w-[220px] sm:w-[260px] h-[300px] sm:h-[420px] rounded-[2rem] border-[6px] border-foreground/15 bg-card"
                          : "w-full max-w-3xl h-[260px] sm:h-[400px] rounded-2xl border border-foreground/10 bg-card"
                      }`}
                    >
                      <img
                        src={project.images[idx]}
                        alt={`${project.name} preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setIdx((i) => (i - 1 + project.images.length) % project.images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-accent z-10"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIdx((i) => (i + 1) % project.images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-accent z-10"
                        aria-label="Next"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                {project.images.length > 1 && (
                  <div className="flex justify-center gap-1.5 pb-4">
                    {project.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIdx(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === idx ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30"
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-border bg-accent/40">
                    <Sparkles className="h-3 w-3" /> {project.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full border border-border text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {project.year}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight">{project.name}</h2>
                  <p className="text-muted-foreground italic mt-1">{project.tagline}</p>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{project.description}</p>

                {/* Context */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Users, label: "Audience", value: project.audience },
                    { icon: Sparkles, label: "Status", value: project.status },
                    { icon: Calendar, label: "Year", value: project.year },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl border border-border bg-accent/30">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                        <item.icon className="h-3 w-3" /> {item.label}
                      </div>
                      <p className="text-sm font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* What it solves */}
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">What It Solves</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.problem}</p>
                </div>

                {/* Scope */}
                <div>
                  <h3 className="font-display font-bold text-lg mb-3">Project Scope</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {project.scope.map((s) => (
                      <div key={s} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-display font-bold text-lg mb-3">Key Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.features.map((f) => (
                      <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-accent/60 border border-border">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stack */}
                <div>
                  <h3 className="font-display font-bold text-lg mb-3">Built With</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((t) => (
                      <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-foreground text-background">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                  <Button
                    className="flex-1 rounded-full"
                    size="lg"
                    onClick={() =>
                      (window.location.href = `mailto:support@lynxinvitation.com?subject=Interested in a ${project.category} invitation`)
                    }
                  >
                    Order Similar Invitation <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
