import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, MessageCircle, Phone, Link as LinkIcon, Facebook, Twitter, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ShareDialogProps {
  slug: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ slug, title, open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/invite/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`You're invited to ${title}!`);

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const channels = [
    { label: "WhatsApp", icon: MessageCircle, gradient: "from-emerald-500 to-green-600", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "Messenger", icon: MessageCircle, gradient: "from-blue-500 to-indigo-600", href: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=140586622674265&redirect_uri=${encodedUrl}` },
    { label: "SMS", icon: Phone, gradient: "from-sky-500 to-cyan-600", href: `sms:?body=${encodedTitle}%20${encodedUrl}` },
    { label: "Email", icon: Mail, gradient: "from-violet-500 to-purple-600", href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%20${encodedUrl}` },
    { label: "Facebook", icon: Facebook, gradient: "from-blue-600 to-blue-800", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X / Twitter", icon: Twitter, gradient: "from-slate-700 to-slate-900", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-md sm:max-w-md p-0 overflow-hidden gap-0 border-border/60 max-h-[90vh] overflow-y-auto">
        {/* Decorative header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 border-b border-border/50">
          <div className="absolute inset-0 bg-grid opacity-[0.04]" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg font-display font-bold leading-tight">Share Invitation</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground truncate">
                  {title}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Copy link */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Invitation link
            </label>
            <div className="flex items-stretch gap-2">
              <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-muted/40">
                <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="truncate text-sm text-foreground/80 font-mono">{url}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={copyLink}
                className={`shrink-0 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </motion.button>
            </div>
          </div>

          {/* Share channels */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Send via
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {channels.map((ch, i) => (
                <motion.a
                  key={ch.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden flex items-center gap-2 px-3 py-3 rounded-xl text-white text-sm font-medium shadow-sm hover:shadow-md transition-all bg-gradient-to-br ${ch.gradient}`}
                >
                  <ch.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{ch.label}</span>
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Pro tip */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-accent/40 border border-border/50">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed min-w-0">
              <span className="font-semibold text-foreground">Pro tip — </span>
              Each guest has a unique invitation code. Share the link and they'll enter their code to RSVP securely.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Inline share button for invitation cards
export function ShareButton({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg hover:bg-accent transition-colors" title="Share">
        <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
      <ShareDialog slug={slug} title={title} open={open} onOpenChange={setOpen} />
    </>
  );
}
