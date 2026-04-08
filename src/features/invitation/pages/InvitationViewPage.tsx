import { useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { MessageCircle, ArrowLeft, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicInvitation, usePublicTheme } from "../hooks/usePublicInvitation";
import { usePublicBlocks } from "@/features/blocks/hooks/useBlocks";
import { BlockViewRenderer } from "@/features/blocks/components/BlockViewRenderer";
import { useViewTracking } from "../hooks/useViewTracking";
import { InvitationThemeProvider } from "../components/ThemeProvider";
import { StoryNavigation } from "../components/StoryNavigation";
import { MusicPlayer } from "../components/MusicPlayer";
import { ParticleCanvas } from "../components/ParticleCanvas";
import { SocialShareSheet } from "../components/SocialShareSheet";
import { PasswordGate } from "../components/sections/PasswordGate";
import { InvitationSEO } from "@/components/SEOHead";
import { InvitationViewSkeleton } from "@/components/LoadingSkeletons";
import { supabase } from "@/integrations/supabase/client";

// Generate a stable session ID for anonymous reaction tracking
function getSessionId(): string {
  const key = "inv_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// Like/reaction floating button — persists to database
function FloatingReactionButton({ invitationId }: { invitationId: string }) {
  const [hearts, setHearts] = useState<number[]>([]);
  const [count, setCount] = useState(0);
  const throttle = useRef(false);

  const addHeart = useCallback(async () => {
    // Visual animation always fires
    const id = Date.now();
    setHearts(prev => [...prev, id]);
    setCount(c => c + 1);
    setTimeout(() => setHearts(prev => prev.filter(h => h !== id)), 2000);

    // Persist to DB (throttle: max 1 insert per second)
    if (throttle.current || !invitationId) return;
    throttle.current = true;
    setTimeout(() => { throttle.current = false; }, 1000);

    try {
      await supabase.from("invitation_reactions" as any).insert({
        invitation_id: invitationId,
        reaction_type: "heart",
        session_id: getSessionId(),
      });
    } catch {
      // Silently fail — reaction is cosmetic
    }
  }, [invitationId]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative">
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

// Block label helper
function getBlockLabel(block: any): string {
  const c = block.content as any;
  switch (block.block_type) {
    case "cover_hero": return c?.overlayText || "Cover";
    case "heading": return c?.text?.substring(0, 20) || "Heading";
    case "text": return "Message";
    case "message_card": return "Message";
    case "countdown":
    case "countdown_flip": return "Countdown";
    case "rsvp": return c?.rsvpTitle || "RSVP";
    case "location": return c?.venueName || "Location";
    case "map_embed": return "Map";
    case "timeline": return "Schedule";
    case "entourage": return c?.entourageTitle || "Entourage";
    case "gallery": return "Gallery";
    case "photo_collage": return "Photos";
    case "dress_code": return "Dress Code";
    case "gift_registry": return c?.registryTitle || "Gift Guide";
    case "faq": return c?.faqTitle || "FAQ";
    case "guestbook": return "Guestbook";
    case "social_links": return "Social";
    case "contact_card": return "Contact";
    case "video":
    case "hero_video": return "Video";
    case "quote": return "Quote";
    case "testimonial": return "Testimonials";
    case "seating_chart": return "Seating";
    case "weather_widget": return "Weather";
    case "qr_code": return "QR Code";
    case "music_player":
    case "audio_player": return "Music";
    case "photo_upload_wall": return "Photo Wall";
    case "pricing_table": return "Packages";
    case "embed": return "Media";
    case "accordion": return "Info";
    case "icon_text": return c?.title || "Info";
    case "marquee_text": return "Banner";
    case "separator_fancy":
    case "divider": return "Divider";
    case "spacer": return "—";
    case "button": return c?.label || "Button";
    case "image": return "Image";
    case "two_column":
    case "three_column": return "Columns";
    default: return block.block_type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
  }
}

export default function InvitationViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: invitation, isLoading, error } = usePublicInvitation(slug || "");
  const invId = invitation?.id ?? "";
  const [unlocked, setUnlocked] = useState(false);

  useViewTracking(invitation?.id);

  const { data: theme } = usePublicTheme(invId);
  const { data: publicBlocks } = usePublicBlocks(invId);

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

  const blocks = publicBlocks ?? [];

  if (!blocks.length) {
    return (
      <InvitationThemeProvider theme={theme}>
        <InvitationSEO title={invitation.title} celebrantName={invitation.celebrant_name} eventDate={invitation.event_date} coverImage={invitation.cover_image_url} slug={invitation.slug} />
        <div className="min-h-screen flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: "var(--inv-text-secondary)" }} />
            <p style={{ color: "var(--inv-text-secondary)" }}>This invitation is being prepared. Check back soon!</p>
          </motion.div>
        </div>
      </InvitationThemeProvider>
    );
  }

  const blockSections = blocks.map((block) => (
    <div key={block.id} className="w-full">
      <BlockViewRenderer blocks={[block]} invitationId={invId} />
    </div>
  ));

  const blockLabels = blocks.map(getBlockLabel);

  return (
    <InvitationThemeProvider theme={theme}>
      <InvitationSEO title={invitation.title} celebrantName={invitation.celebrant_name} eventDate={invitation.event_date} coverImage={invitation.cover_image_url} slug={invitation.slug} />
      <ParticleCanvas effect={theme?.particle_effect} />
      <SocialShareSheet slug={invitation.slug} title={invitation.title} />
      <FloatingReactionButton invitationId={invId} />
      {theme?.music_url && (
        <MusicPlayer url={theme.music_url} autoplay={theme.music_autoplay ?? false} loop={theme.music_loop ?? true} volume={theme.music_volume ?? 0.5} />
      )}
      <StoryNavigation pageLabels={blockLabels}>{blockSections}</StoryNavigation>
    </InvitationThemeProvider>
  );
}
