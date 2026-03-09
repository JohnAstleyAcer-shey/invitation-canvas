import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Tablet, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type DeviceMode = "desktop" | "tablet" | "mobile";

const deviceConfig: Record<DeviceMode, { width: string; maxWidth: string; icon: React.ElementType; label: string }> = {
  desktop: { width: "100%", maxWidth: "100%", icon: Monitor, label: "Desktop" },
  tablet: { width: "768px", maxWidth: "768px", icon: Tablet, label: "Tablet" },
  mobile: { width: "375px", maxWidth: "375px", icon: Smartphone, label: "Mobile" },
};

interface InvitationPreviewDialogProps {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvitationPreviewDialog({ slug, open, onOpenChange }: InvitationPreviewDialogProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const previewUrl = `/invite/${slug}`;
  const config = deviceConfig[device];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-1">
            {(Object.entries(deviceConfig) as [DeviceMode, typeof config][]).map(([key, cfg]) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <Button
                    variant={device === key ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 w-8 rounded-lg p-0"
                    onClick={() => setDevice(key)}
                  >
                    <cfg.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{cfg.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden sm:inline font-mono bg-accent px-2 py-1 rounded-lg">
              {config.width === "100%" ? "Full width" : config.width}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg p-0" asChild>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg p-0" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="flex-1 bg-muted/30 flex items-start justify-center overflow-auto p-4">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-background rounded-xl shadow-2xl border border-border overflow-hidden h-full"
            style={{
              width: config.width,
              maxWidth: config.maxWidth,
            }}
          >
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Invitation Preview"
            />
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
