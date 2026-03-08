import { useState, useCallback } from "react";
import { Share2, Copy, Check, MessageCircle, Phone, QrCode, X, Link as LinkIcon, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const channels = [
    { label: "WhatsApp", icon: MessageCircle, color: "bg-green-500", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "SMS", icon: Phone, color: "bg-blue-500", href: `sms:?body=${encodedTitle}%20${encodedUrl}` },
    { label: "Facebook", icon: Facebook, color: "bg-blue-600", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "Twitter", icon: Twitter, color: "bg-sky-500", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Share2 className="w-5 h-5" /> Share Invitation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Copy link */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted text-sm">
              <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate text-muted-foreground">{url}</span>
            </div>
            <button
              onClick={copyLink}
              className="shrink-0 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Share channels */}
          <div className="grid grid-cols-2 gap-2">
            {channels.map(ch => (
              <a
                key={ch.label}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity ${ch.color}`}
              >
                <ch.icon className="w-4 h-4" /> {ch.label}
              </a>
            ))}
          </div>

          {/* Guest-specific link */}
          <div className="p-3 rounded-xl bg-accent/30 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">💡 Pro tip</p>
            <p>Each guest has a unique invitation code. Share the link and they'll enter their code to RSVP.</p>
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
