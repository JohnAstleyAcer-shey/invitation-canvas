import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePublicInvitation(slug: string) {
  return useQuery({
    queryKey: ["public-invitation", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .is("deleted_at", null)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Invitation not found");
      return data;
    },
    enabled: !!slug,
  });
}

export function usePublicTheme(invitationId: string) {
  return useQuery({
    queryKey: ["public-theme", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitation_themes")
        .select("*")
        .eq("invitation_id", invitationId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
}

export function usePublicPages(invitationId: string) {
  return useQuery({
    queryKey: ["public-pages", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitation_pages")
        .select("*")
        .eq("invitation_id", invitationId)
        .eq("is_enabled", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicTimeline(invitationId: string) {
  return useQuery({
    queryKey: ["public-timeline", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("timeline_events").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicRoses(invitationId: string) {
  return useQuery({
    queryKey: ["public-roses", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("roses").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicCandles(invitationId: string) {
  return useQuery({
    queryKey: ["public-candles", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("candles").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicTreasures(invitationId: string) {
  return useQuery({
    queryKey: ["public-treasures", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("treasures").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicBlueBills(invitationId: string) {
  return useQuery({
    queryKey: ["public-blue-bills", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("blue_bills").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicGallery(invitationId: string) {
  return useQuery({
    queryKey: ["public-gallery", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicDressCode(invitationId: string) {
  return useQuery({
    queryKey: ["public-dress-code", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("dress_code_colors").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicGiftItems(invitationId: string) {
  return useQuery({
    queryKey: ["public-gift-items", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("gift_items").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicFaqs(invitationId: string) {
  return useQuery({
    queryKey: ["public-faqs", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!invitationId,
  });
}

export function usePublicGuest(invitationId: string, code: string) {
  return useQuery({
    queryKey: ["public-guest", invitationId, code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("invitation_id", invitationId)
        .eq("invitation_code", code)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId && !!code,
  });
}
