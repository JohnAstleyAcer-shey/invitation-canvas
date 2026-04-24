import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, X, MessageCircle, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface SocialShareSheetProps {
  slug: string;
  title: string;
}

export function SocialShareSheet({ slug, title }: SocialShareSheetProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const directUrl = `${window.location.origin}/invite/${slug}`;
  // Share URL points to the social-preview edge function so WhatsApp / Facebook
  // / iMessage can fetch the cover image + title via Open Graph tags before
  // redirecting the visitor to the live invitation.
  const projectRef = "znbjzhrytnkysoatwuhi";
  const shareUrl = `https://${projectRef}.supabase.co/functions/v1/social-preview?slug=${encodeURIComponent(slug)}&target=${encodeURIComponent(directUrl)}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`You're invited to ${title}! 🎉`);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const channels = [
    { label: "WhatsApp", icon: MessageCircle, bg: "#25D366", href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
    { label: "SMS", icon: Phone, bg: "#3B82F6", href: `sms:?body=${encodedText}%20${encodedUrl}` },
    { label: "Email", icon: Mail, bg: "#6366F1", href: `mailto:?subject=${encodedText}&body=${encodedText}%20${encodedUrl}` },
    { label: "Copy", icon: copied ? Check : Copy, bg: "#6B7280", onClick: copyLink },
  ];

  // Try native share first
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `You're invited to ${title}!`, url });
        return;
      } catch {}
    }
    setOpen(!open);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={handleShare}
        className="p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all hover:scale-110 active:scale-95 shadow-lg"
        aria-label="Share invitation"
      >
        {open ? <X className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-14 right-0 flex flex-col gap-2"
          >
            {channels.map((ch, i) => (
              <motion.div
                key={ch.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                {ch.onClick ? (
                  <button
                    onClick={ch.onClick}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow-lg hover:scale-105 active:scale-95 transition-transform backdrop-blur-md whitespace-nowrap"
                    style={{ backgroundColor: ch.bg }}
                  >
                    <ch.icon className="w-4 h-4" />
                    {ch.label}
                  </button>
                ) : (
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow-lg hover:scale-105 active:scale-95 transition-transform backdrop-blur-md whitespace-nowrap"
                    style={{ backgroundColor: ch.bg }}
                  >
                    <ch.icon className="w-4 h-4" />
                    {ch.label}
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
