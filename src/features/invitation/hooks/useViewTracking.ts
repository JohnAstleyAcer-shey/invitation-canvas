import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

function getDeviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function useViewTracking(invitationId: string | undefined) {
  useEffect(() => {
    if (!invitationId) return;

    const track = async () => {
      try {
        await supabase.from("invitation_views" as any).insert({
          invitation_id: invitationId,
          user_agent: navigator.userAgent.slice(0, 500),
          referrer: document.referrer?.slice(0, 500) || null,
          device_type: getDeviceType(),
        });
      } catch {
        // silently fail - view tracking is non-critical
      }
    };

    // Debounce to avoid duplicate tracking
    const timer = setTimeout(track, 1000);
    return () => clearTimeout(timer);
  }, [invitationId]);
}
