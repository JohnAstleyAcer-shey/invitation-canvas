import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function normalizeBaseUrl(value: string | null) {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

function buildDescription(title: string, eventDate: string | null) {
  if (!eventDate) return `You're invited to ${title}`;
  const parsedDate = new Date(eventDate);
  if (Number.isNaN(parsedDate.getTime())) return `You're invited to ${title}`;
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
  return `You're invited to ${title} on ${formatted}`;
}

function htmlResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

function renderPage({
  title,
  description,
  image,
  targetUrl,
}: {
  title: string;
  description: string;
  image: string | null;
  targetUrl: string;
}) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeTarget = escapeHtml(targetUrl);
  const safeImage = image ? escapeHtml(image) : null;

  const imageMeta = safeImage
    ? `
    <meta property="og:image" content="${safeImage}" />
    <meta name="twitter:image" content="${safeImage}" />
    `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeTarget}" />
    ${imageMeta}
    <meta name="twitter:card" content="${safeImage ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta http-equiv="refresh" content="0;url=${safeTarget}" />
    <style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb;color:#333}a{color:#6366f1;text-decoration:none}</style>
  </head>
  <body>
    <p>Redirecting to invitation...</p>
    <noscript><a href="${safeTarget}">Continue</a></noscript>
  </body>
</html>`;
}

Deno.serve(async (req) => {
  const requestUrl = new URL(req.url);
  const slug = requestUrl.searchParams.get("slug")?.trim() ?? "";
  const targetParam = requestUrl.searchParams.get("target");
  const publicBase = normalizeBaseUrl(Deno.env.get("PUBLIC_INVITATION_BASE_URL") ?? null);

  if (!slug) {
    return htmlResponse("<p>Missing slug</p>", 400);
  }

  const fallbackTarget = publicBase
    ? `${publicBase}/invite/${encodeURIComponent(slug)}`
    : null;
  const targetUrl = normalizeBaseUrl(targetParam) ?? fallbackTarget;

  if (!targetUrl) {
    return htmlResponse("<p>Missing target URL</p>", 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return htmlResponse("<p>Function configuration error</p>", 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("slug, title, celebrant_name, event_date, cover_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !invitation) {
    const page = renderPage({
      title: "Invitation",
      description: "Invitation link",
      image: null,
      targetUrl,
    });
    return htmlResponse(page, 404);
  }

  const displayTitle = invitation.celebrant_name
    ? `${invitation.celebrant_name}'s ${invitation.title}`
    : invitation.title;

  const page = renderPage({
    title: displayTitle,
    description: buildDescription(displayTitle, invitation.event_date),
    image: invitation.cover_image_url,
    targetUrl,
  });

  return htmlResponse(page);
});
