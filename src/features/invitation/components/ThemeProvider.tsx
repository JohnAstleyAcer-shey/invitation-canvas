import { useMemo, useEffect } from "react";
import type { Tables } from "@/integrations/supabase/types";

type Theme = Tables<"invitation_themes">;

const FONT_LOADED = new Set<string>();

function loadGoogleFont(family: string) {
  if (!family || FONT_LOADED.has(family)) return;
  FONT_LOADED.add(family);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

export function InvitationThemeProvider({ theme, children }: { theme: Theme | null | undefined; children: React.ReactNode }) {
  // Inject Google Fonts into <head> so they apply globally (including portals/dialogs)
  useEffect(() => {
    if (theme?.font_title) loadGoogleFont(theme.font_title);
    if (theme?.font_body) loadGoogleFont(theme.font_body);
  }, [theme?.font_title, theme?.font_body]);

  const style = useMemo(() => {
    if (!theme) return {};
    const titleFont = theme.font_title || "Playfair Display";
    const bodyFont = theme.font_body || "Lato";
    return {
      "--inv-primary": theme.color_primary ?? "#000000",
      "--inv-secondary": theme.color_secondary ?? "#ffffff",
      "--inv-accent": theme.color_accent ?? "#666666",
      "--inv-text": theme.color_text_primary ?? "#000000",
      "--inv-text-secondary": theme.color_text_secondary ?? "#666666",
      "--inv-bg-type": theme.background_type ?? "solid",
      "--inv-bg-value": theme.background_value ?? "#ffffff",
      "--inv-bg-opacity": theme.background_opacity ?? 1,
      "--inv-font-title": `'${titleFont}', serif`,
      "--inv-font-body": `'${bodyFont}', sans-serif`,
      "--inv-page-transition": theme.page_transition ?? "fade",
      "--inv-glass": theme.glassmorphism_enabled ? "1" : "0",
    } as React.CSSProperties;
  }, [theme]);

  const titleFont = theme?.font_title || "Playfair Display";
  const bodyFont = theme?.font_body || "Lato";

  return (
    <div
      data-glass={theme?.glassmorphism_enabled ? "true" : "false"}
      data-transition={theme?.page_transition || "fade"}
      className="min-h-screen w-full inv-theme-root"
      style={{
        ...style,
        fontFamily: `'${bodyFont}', sans-serif`,
        color: "var(--inv-text)",
        background: theme?.background_type === "gradient"
          ? theme?.background_value
          : theme?.background_type === "image"
          ? `url(${theme?.background_value}) center/cover fixed`
          : theme?.background_value ?? "#ffffff",
      }}
    >
      {/* Apply title font to all elements that opt-in via .font-display or h1-h6 inside theme */}
      <style>{`
        .inv-theme-root .font-display,
        .inv-theme-root h1, .inv-theme-root h2, .inv-theme-root h3, .inv-theme-root h4 {
          font-family: '${titleFont}', serif !important;
        }
        .inv-theme-root[data-glass="true"] .glass-surface {
          background: rgba(255,255,255,0.08) !important;
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 1.25rem;
        }
      `}</style>
      {children}
    </div>
  );
}
