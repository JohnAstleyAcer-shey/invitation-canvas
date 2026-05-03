import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlockViewRenderer } from "@/features/blocks/components/BlockViewRenderer";
import type { TemplateDef } from "../types";
import type { InvitationBlock } from "@/features/blocks/types";

interface Props {
  template: TemplateDef | null;
  onClose: () => void;
  onApply?: (tmpl: TemplateDef) => void;
}

const variants = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 60 : -60, scale: 0.96, filter: "blur(6px)" }),
  center: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -60 : 60, scale: 0.96, filter: "blur(6px)" }),
};

export function TemplatePreviewDialog({ template, onClose, onApply }: Props) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!template) return null;

  const pages = template.blocks;
  const current = pages[page];

  // Adapt CatalogBlock to InvitationBlock shape
  const asBlock: InvitationBlock = {
    id: `preview-${page}`,
    invitation_id: "preview",
    block_type: current.block_type,
    content: current.content,
    style: current.style,
    sort_order: page,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const goNext = () => {
    if (page < pages.length - 1) {
      setDirection(1);
      setPage(page + 1);
    }
  };
  const goPrev = () => {
    if (page > 0) {
      setDirection(-1);
      setPage(page - 1);
    }
  };

  return (
    <Dialog open={!!template} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden border-0 bg-black h-[85vh]">
        {/* Header */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
          <div className="text-white">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Preview</p>
            <h3 className="font-display text-sm font-medium">{template.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/10 text-white border-0 text-[10px]">
              {page + 1} / {pages.length}
            </Badge>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="relative w-full h-full overflow-hidden" style={{ background: template.palette.bg }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-y-auto"
            >
              <BlockViewRenderer blocks={[asBlock]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav arrows centered */}
        <button
          onClick={goPrev}
          disabled={page === 0}
          className="absolute top-12 inset-x-0 mx-auto z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white disabled:opacity-30 hover:bg-black/50 transition"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          onClick={goNext}
          disabled={page === pages.length - 1}
          className="absolute bottom-20 inset-x-0 mx-auto z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white disabled:opacity-30 hover:bg-black/50 transition"
        >
          <ChevronDown className="h-5 w-5" />
        </button>

        {/* Footer */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-3 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent">
          {onApply && (
            <Button className="flex-1 rounded-full" onClick={() => onApply(template)}>
              Use this template
            </Button>
          )}
          <Button variant="outline" className="rounded-full text-white border-white/30 bg-white/10 hover:bg-white/20" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
