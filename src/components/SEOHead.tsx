import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEOHead({ title, description, image, url, type = "website" }: SEOProps) {
  const fullTitle = title ? `${title} | LynxInvitation` : "LynxInvitation — Premium Digital Invitations";
  const desc = description || "Create stunning digital invitations for Debuts, Weddings, Birthdays, Christenings, and Corporate events.";

  return (
    <>
      {/* Use document.title directly since we don't have react-helmet */}
      <DocumentTitle title={fullTitle} />
      {/* Meta tags are set in index.html, dynamic OG tags would need SSR */}
    </>
  );
}

function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
    return () => { document.title = "LynxInvitation — Premium Digital Invitations"; };
  }, [title]);
  return null;
}

export function InvitationSEO({ title, celebrantName, eventDate, coverImage, slug }: {
  title: string;
  celebrantName?: string | null;
  eventDate?: string | null;
  coverImage?: string | null;
  slug: string;
}) {
  const displayTitle = celebrantName ? `${celebrantName}'s ${title}` : title;
  const desc = eventDate
    ? `You're invited to ${displayTitle} on ${new Date(eventDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
    : `You're invited to ${displayTitle}`;

  useEffect(() => {
    document.title = `${displayTitle} | LynxInvitation`;

    // Update OG tags dynamically
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        (el as HTMLMetaElement).setAttribute(property.startsWith("og:") || property.startsWith("twitter:") ? "property" : "name", property);
        document.head.appendChild(el);
      }
      (el as HTMLMetaElement).content = content;
    };

    setMeta("og:title", displayTitle);
    setMeta("og:description", desc);
    setMeta("og:type", "website");
    setMeta("og:url", `${window.location.origin}/invite/${slug}`);
    if (coverImage) setMeta("og:image", coverImage);
    setMeta("twitter:card", coverImage ? "summary_large_image" : "summary");
    setMeta("twitter:title", displayTitle);
    setMeta("twitter:description", desc);

    return () => { document.title = "LynxInvitation — Premium Digital Invitations"; };
  }, [displayTitle, desc, coverImage, slug]);

  return null;
}
