import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRealtimeRsvps(invitationId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!invitationId) return;

    const channel = supabase
      .channel(`rsvps-${invitationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rsvps",
          filter: `invitation_id=eq.${invitationId}`,
        },
        () => {
          // Invalidate all RSVP-related queries
          queryClient.invalidateQueries({ queryKey: ["cp-rsvp-stats", invitationId] });
          queryClient.invalidateQueries({ queryKey: ["cp-recent-rsvps", invitationId] });
          queryClient.invalidateQueries({ queryKey: ["cp-guest-count", invitationId] });
          queryClient.invalidateQueries({ queryKey: ["cp-dietary", invitationId] });
          queryClient.invalidateQueries({ queryKey: ["rsvps", invitationId] });
          queryClient.invalidateQueries({ queryKey: ["rsvp-stats"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationId, queryClient]);
}
