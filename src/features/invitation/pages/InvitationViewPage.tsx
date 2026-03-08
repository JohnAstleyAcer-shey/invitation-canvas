import { useState } from "react";
import { useParams } from "react-router-dom";
import { Share2, MessageCircle, ArrowLeft, Heart, Sparkles, ChevronUp, Volume2, VolumeX } from "lucide-react";
import { Flower2, Flame, Crown, Banknote } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  usePublicInvitation, usePublicTheme, usePublicPages,
  usePublicTimeline, usePublicRoses, usePublicCandles, usePublicTreasures,
  usePublicBlueBills, usePublicGallery, usePublicDressCode, usePublicGiftItems, usePublicFaqs,
} from "../hooks/usePublicInvitation";
import { usePublicBlocks } from "@/features/blocks/hooks/useBlocks";
import { BlockViewRenderer } from "@/features/blocks/components/BlockViewRenderer";
import { useViewTracking } from "../hooks/useViewTracking";
import { InvitationThemeProvider } from "../components/ThemeProvider";
import { StoryNavigation } from "../components/StoryNavigation";
import { MusicPlayer } from "../components/MusicPlayer";
import { ParticleCanvas } from "../components/ParticleCanvas";
import { PasswordGate } from "../components/sections/PasswordGate";
import { CoverSection } from "../components/sections/CoverSection";
import { MessageSection } from "../components/sections/MessageSection";
import { CountdownSection } from "../components/sections/CountdownSection";
import { LocationSection } from "../components/sections/LocationSection";
import { TimelineSection } from "../components/sections/TimelineSection";
import { EntourageSection } from "../components/sections/EntourageSection";
import { DressCodeSection } from "../components/sections/DressCodeSection";
import { GallerySection } from "../components/sections/GallerySection";
import { GiftGuideSection } from "../components/sections/GiftGuideSection";
import { FaqSection } from "../components/sections/FaqSection";
import { RsvpSection } from "../components/sections/RsvpSection";
import { InvitationSEO } from "@/components/SEOHead";
import { InvitationViewSkeleton } from "@/components/LoadingSkeletons";
import type { Tables } from "@/integrations/supabase/types";
import { PAGE_TYPE_LABELS } from "@/features/admin/types";
import { toast } from "sonner";

type PageType = Tables<"invitation_pages">["page_type"];
type StyleVariant = "classic" | "modern" | "elegant" | "bold";

function FloatingShareButton({ slug, title }: { slug: string; title: string }) {
  const url = `${window.location.origin}/invite/${slug}`;
  const [showTooltip, setShowTooltip] = useState(false);
  
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `You're invited to ${title}!`, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      onClick={share}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all hover:scale-110 active:scale-95 shadow-lg"
      aria-label="Share invitation"
    >
      <Share2 className="w-5 h-5" />
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full"
          >
            Share this invitation
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Floating scroll-to-top button
function ScrollToTopButton() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  
  useMotionValueEvent(scrollY, "change", (v) => {
    setShow(v > 500);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all hover:scale-110 active:scale-95 shadow-lg"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Like/reaction floating button
function FloatingReactionButton() {
  const [hearts, setHearts] = useState<number[]>([]);
  const [count, setCount] = useState(0);

  const addHeart = () => {
    const id = Date.now();
    setHearts(prev => [...prev, id]);
    setCount(c => c + 1);
    setTimeout(() => setHearts(prev => prev.filter(h => h !== id)), 2000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative">
        {/* Floating hearts */}
        <AnimatePresence>
          {hearts.map(id => (
            <motion.div
              key={id}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -80, scale: 1.5, x: Math.random() * 40 - 20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          onClick={addHeart}
          className="p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all shadow-lg"
        >
          <Heart className={`w-5 h-5 transition-colors ${count > 0 ? "text-red-400 fill-red-400" : ""}`} />
        </motion.button>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </div>
    </div>
  );
}

// Progress indicator
function PageProgressBar() {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-white/20 z-[60] origin-left"
      style={{ scaleX: scrollYProgress }}
    >
      <div className="h-full bg-white/70 backdrop-blur" />
    </motion.div>
  );
}

export default function InvitationViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: invitation, isLoading, error } = usePublicInvitation(slug || "");
  const invId = invitation?.id ?? "";
  const useBlockMode = (invitation as any)?.use_blocks === true;
  const [unlocked, setUnlocked] = useState(false);

  useViewTracking(invitation?.id);

  const { data: theme } = usePublicTheme(invId);
  const { data: pages } = usePublicPages(invId);
  const { data: timeline } = usePublicTimeline(invId);
  const { data: roses } = usePublicRoses(invId);
  const { data: candles } = usePublicCandles(invId);
  const { data: treasures } = usePublicTreasures(invId);
  const { data: blueBills } = usePublicBlueBills(invId);
  const { data: gallery } = usePublicGallery(invId);
  const { data: dressCode } = usePublicDressCode(invId);
  const { data: giftItems } = usePublicGiftItems(invId);
  const { data: faqs } = usePublicFaqs(invId);
  const { data: publicBlocks } = usePublicBlocks(useBlockMode ? invId : "");

  if (isLoading) return <InvitationViewSkeleton />;

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4 px-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-2 mx-auto"
          >
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Invitation Not Found</h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-sm">This invitation may have been removed, is not yet published, or the link may be incorrect.</p>
          <motion.a
            href="/"
            whileHover={{ x: -3 }}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go to homepage
          </motion.a>
        </motion.div>
      </div>
    );
  }

  if (invitation.is_password_protected && invitation.password_hash && !unlocked) {
    return (
      <InvitationThemeProvider theme={theme}>
        <InvitationSEO title={invitation.title} celebrantName={invitation.celebrant_name} eventDate={invitation.event_date} coverImage={invitation.cover_image_url} slug={invitation.slug} />
        <PasswordGate invitation={invitation} onUnlock={() => setUnlocked(true)} />
      </InvitationThemeProvider>
    );
  }

  const buildSection = (pageType: PageType, variant: StyleVariant): React.ReactNode | null => {
    switch (pageType) {
      case "cover": return <CoverSection invitation={invitation} variant={variant} />;
      case "message": return <MessageSection invitation={invitation} variant={variant} />;
      case "countdown": return <CountdownSection invitation={invitation} variant={variant} />;
      case "location": return <LocationSection invitation={invitation} variant={variant} />;
      case "timeline": return timeline?.length ? <TimelineSection events={timeline} variant={variant} /> : null;
      case "roses": return roses?.length ? <EntourageSection title="18 Roses" icon={<Flower2 className="w-8 h-8 mx-auto" style={{ color: "var(--inv-accent)" }} />} people={roses} variant={variant} descKey="role_description" /> : null;
      case "candles": return candles?.length ? <EntourageSection title="18 Candles" icon={<Flame className="w-8 h-8 mx-auto" style={{ color: "var(--inv-accent)" }} />} people={candles} variant={variant} descKey="message" /> : null;
      case "treasures": return treasures?.length ? <EntourageSection title="18 Treasures" icon={<Crown className="w-8 h-8 mx-auto" style={{ color: "var(--inv-accent)" }} />} people={treasures} variant={variant} descKey="gift_description" /> : null;
      case "blue_bills": return blueBills?.length ? <EntourageSection title="18 Blue Bills" icon={<Banknote className="w-8 h-8 mx-auto" style={{ color: "var(--inv-accent)" }} />} people={blueBills} variant={variant} descKey="message" /> : null;
      case "dress_code": return dressCode?.length ? <DressCodeSection colors={dressCode} variant={variant} /> : null;
      case "gallery": return gallery?.length ? <GallerySection images={gallery} variant={variant} /> : null;
      case "gift_guide": return giftItems?.length ? <GiftGuideSection items={giftItems} variant={variant} /> : null;
      case "faq": return faqs?.length ? <FaqSection faqs={faqs} variant={variant} /> : null;
      case "rsvp": return <RsvpSection invitation={invitation} guest={null} variant={variant} />;
      default: return null;
    }
  };

  const enabledPages = pages ?? [];
  const sections: React.ReactNode[] = [];
  const labels: string[] = [];
  enabledPages.forEach(page => {
    const section = buildSection(page.page_type, page.style_variant as StyleVariant);
    if (section) {
      sections.push(section);
      labels.push(page.custom_title || PAGE_TYPE_LABELS[page.page_type as keyof typeof PAGE_TYPE_LABELS] || page.page_type);
    }
  });

  // Block-based rendering
  if (useBlockMode && publicBlocks) {
    return (
      <InvitationThemeProvider theme={theme}>
        <InvitationSEO title={invitation.title} celebrantName={invitation.celebrant_name} eventDate={invitation.event_date} coverImage={invitation.cover_image_url} slug={invitation.slug} />
        <PageProgressBar />
        <ParticleCanvas effect={theme?.particle_effect} />
        <FloatingShareButton slug={invitation.slug} title={invitation.title} />
        <FloatingReactionButton />
        <ScrollToTopButton />
        {theme?.music_url && (
          <MusicPlayer url={theme.music_url} autoplay={theme.music_autoplay ?? false} loop={theme.music_loop ?? true} volume={theme.music_volume ?? 0.5} />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full overflow-x-hidden"
        >
          <BlockViewRenderer blocks={publicBlocks} />
        </motion.div>
      </InvitationThemeProvider>
    );
  }

  return (
    <InvitationThemeProvider theme={theme}>
      <InvitationSEO title={invitation.title} celebrantName={invitation.celebrant_name} eventDate={invitation.event_date} coverImage={invitation.cover_image_url} slug={invitation.slug} />
      <PageProgressBar />
      <ParticleCanvas effect={theme?.particle_effect} />
      <FloatingShareButton slug={invitation.slug} title={invitation.title} />
      <FloatingReactionButton />
      <ScrollToTopButton />
      {theme?.music_url && (
        <MusicPlayer url={theme.music_url} autoplay={theme.music_autoplay ?? false} loop={theme.music_loop ?? true} volume={theme.music_volume ?? 0.5} />
      )}
      {sections.length > 0 ? (
        <StoryNavigation pageLabels={labels}>{sections}</StoryNavigation>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: "var(--inv-text-secondary)" }} />
            <p style={{ color: "var(--inv-text-secondary)" }}>This invitation has no pages configured yet.</p>
          </motion.div>
        </div>
      )}
    </InvitationThemeProvider>
  );
}
