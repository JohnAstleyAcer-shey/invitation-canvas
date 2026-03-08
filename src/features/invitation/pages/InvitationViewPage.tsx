import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Flower2, Flame, Crown, Banknote } from "lucide-react";
import {
  usePublicInvitation, usePublicTheme, usePublicPages,
  usePublicTimeline, usePublicRoses, usePublicCandles, usePublicTreasures,
  usePublicBlueBills, usePublicGallery, usePublicDressCode, usePublicGiftItems, usePublicFaqs,
} from "../hooks/usePublicInvitation";
import { InvitationThemeProvider } from "../components/ThemeProvider";
import { StoryNavigation } from "../components/StoryNavigation";
import { MusicPlayer } from "../components/MusicPlayer";
import { ParticleCanvas } from "../components/ParticleCanvas";
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
import type { Tables } from "@/integrations/supabase/types";
import { PAGE_TYPE_LABELS } from "@/features/admin/types";

type PageType = Tables<"invitation_pages">["page_type"];
type StyleVariant = "classic" | "modern" | "elegant" | "bold";

export default function InvitationViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: invitation, isLoading, error } = usePublicInvitation(slug || "");
  const invId = invitation?.id ?? "";

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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <h1 className="text-4xl font-bold">Invitation Not Found</h1>
        <p className="text-muted-foreground">This invitation may have been removed or is not yet published.</p>
      </div>
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

  return (
    <InvitationThemeProvider theme={theme}>
      <ParticleCanvas effect={theme?.particle_effect} />
      {theme?.music_url && (
        <MusicPlayer
          url={theme.music_url}
          autoplay={theme.music_autoplay ?? false}
          loop={theme.music_loop ?? true}
          volume={theme.music_volume ?? 0.5}
        />
      )}
      {sections.length > 0 ? (
        <StoryNavigation pageLabels={labels}>
          {sections}
        </StoryNavigation>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <p style={{ color: "var(--inv-text-secondary)" }}>This invitation has no pages configured yet.</p>
        </div>
      )}
    </InvitationThemeProvider>
  );
}
