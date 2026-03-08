import { useMemo } from "react";
import type { Tables } from "@/integrations/supabase/types";

type Theme = Tables<"invitation_themes">;

export function InvitationThemeProvider({ theme, children }: { theme: Theme | null | undefined; children: React.ReactNode }) {
  const style = useMemo(() => {
    if (!theme) return {};
    return {
      "--inv-primary": theme.color_primary ?? "#000000",
      "--inv-secondary": theme.color_secondary ?? "#ffffff",
      "--inv-accent": theme.color_accent ?? "#666666",
      "--inv-text": theme.color_text_primary ?? "#000000",
      "--inv-text-secondary": theme.color_text_secondary ?? "#666666",
      "--inv-bg-type": theme.background_type ?? "solid",
      "--inv-bg-value": theme.background_value ?? "#ffffff",
      "--inv-bg-opacity": theme.background_opacity ?? 1,
      "--inv-font-title": theme.font_title ?? "Playfair Display",
      "--inv-font-body": theme.font_body ?? "Lato",
    } as React.CSSProperties;
  }, [theme]);

  const fontLink = useMemo(() => {
    const fonts = [theme?.font_title, theme?.font_body].filter(Boolean).map(f => f!.replace(/ /g, "+")).join("&family=");
    return fonts ? `https://fonts.googleapis.com/css2?family=${fonts}:wght@300;400;500;600;700&display=swap` : null;
  }, [theme?.font_title, theme?.font_body]);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        ...style,
        fontFamily: `var(--inv-font-body), sans-serif`,
        color: "var(--inv-text)",
        background: theme?.background_type === "gradient"
          ? theme?.background_value
          : theme?.background_type === "image"
          ? `url(${theme?.background_value}) center/cover fixed`
          : theme?.background_value ?? "#ffffff",
      }}
    >
      {fontLink && <link rel="stylesheet" href={fontLink} />}
      {children}
    </div>
  );
}
