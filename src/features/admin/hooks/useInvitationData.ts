import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Guest, Rsvp, InvitationTheme, InvitationPage, CustomerAdmin, StyleVariant } from "../types";
import { toast } from "sonner";

// --- Guests ---
export function useGuests(invitationId: string) {
  const qc = useQueryClient();
  const key = ["guests", invitationId];

  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("guests").select("*").eq("invitation_id", invitationId).order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });

  const create = useMutation({
    mutationFn: async (d: { full_name: string; email?: string; phone?: string; max_companions?: number; personal_message?: string }) => {
      const { error } = await supabase.from("guests").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Guest added"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...d }: { id: string; full_name?: string; email?: string; phone?: string; max_companions?: number }) => {
      const { error } = await supabase.from("guests").update(d).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Guest removed"); },
  });

  const bulkCreate = useMutation({
    mutationFn: async (names: string[]) => {
      const { error } = await supabase.from("guests").insert(
        names.map(n => ({ full_name: n.trim(), invitation_id: invitationId }))
      );
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Guests imported"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { ...list, create, update, remove, bulkCreate };
}

// --- RSVPs ---
export function useRsvps(invitationId: string) {
  return useQuery({
    queryKey: ["rsvps", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("rsvps").select("*, guests(full_name)").eq("invitation_id", invitationId).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
}

// --- Timeline Events ---
export function useTimelineEvents(invitationId: string) {
  const qc = useQueryClient();
  const key = ["timeline_events", invitationId];

  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("timeline_events").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });

  const create = useMutation({
    mutationFn: async (d: { title: string; event_time?: string; description?: string; icon?: string; sort_order?: number }) => {
      const { error } = await supabase.from("timeline_events").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...d }: { id: string; title?: string; event_time?: string; description?: string }) => {
      const { error } = await supabase.from("timeline_events").update(d).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("timeline_events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...list, create, update, remove };
}

// --- Roses ---
export function useRoses(invitationId: string) {
  const qc = useQueryClient();
  const key = ["roses", invitationId];
  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("roses").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
  const create = useMutation({
    mutationFn: async (d: { person_name: string; role_description?: string; image_url?: string; sort_order?: number }) => {
      const { error } = await supabase.from("roses").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("roses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return { ...list, create, remove };
}

// --- Candles ---
export function useCandles(invitationId: string) {
  const qc = useQueryClient();
  const key = ["candles", invitationId];
  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("candles").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
  const create = useMutation({
    mutationFn: async (d: { person_name: string; message?: string; image_url?: string; sort_order?: number }) => {
      const { error } = await supabase.from("candles").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("candles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return { ...list, create, remove };
}

// --- Treasures ---
export function useTreasures(invitationId: string) {
  const qc = useQueryClient();
  const key = ["treasures", invitationId];
  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("treasures").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
  const create = useMutation({
    mutationFn: async (d: { person_name: string; gift_description?: string; image_url?: string; sort_order?: number }) => {
      const { error } = await supabase.from("treasures").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("treasures").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return { ...list, create, remove };
}

// --- Blue Bills ---
export function useBlueBills(invitationId: string) {
  const qc = useQueryClient();
  const key = ["blue_bills", invitationId];
  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("blue_bills").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
  const create = useMutation({
    mutationFn: async (d: { person_name: string; message?: string; image_url?: string; sort_order?: number }) => {
      const { error } = await supabase.from("blue_bills").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blue_bills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return { ...list, create, remove };
}

// --- Gallery Images ---
export function useGalleryImages(invitationId: string) {
  const qc = useQueryClient();
  const key = ["gallery_images", invitationId];
  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
  const create = useMutation({
    mutationFn: async (d: { image_url: string; caption?: string; sort_order?: number }) => {
      const { error } = await supabase.from("gallery_images").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return { ...list, create, remove };
}

// --- Dress Code Colors ---
export function useDressCodeColors(invitationId: string) {
  const qc = useQueryClient();
  const key = ["dress_code_colors", invitationId];
  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("dress_code_colors").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
  const create = useMutation({
    mutationFn: async (d: { color_hex: string; color_name?: string; description?: string; sort_order?: number }) => {
      const { error } = await supabase.from("dress_code_colors").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("dress_code_colors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return { ...list, create, remove };
}

// --- Gift Items ---
export function useGiftItems(invitationId: string) {
  const qc = useQueryClient();
  const key = ["gift_items", invitationId];
  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("gift_items").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
  const create = useMutation({
    mutationFn: async (d: { item_name: string; description?: string; category?: string; link_url?: string; link_label?: string; sort_order?: number }) => {
      const { error } = await supabase.from("gift_items").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gift_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return { ...list, create, remove };
}

// --- FAQs ---
export function useFaqs(invitationId: string) {
  const qc = useQueryClient();
  const key = ["faqs", invitationId];
  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
  const create = useMutation({
    mutationFn: async (d: { question: string; answer: string; category?: string; sort_order?: number }) => {
      const { error } = await supabase.from("faqs").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return { ...list, create, remove };
}

// --- Invitation Theme ---
export function useInvitationTheme(invitationId: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["invitation_themes", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase.from("invitation_themes").select("*").eq("invitation_id", invitationId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });

  const updateTheme = useMutation({
    mutationFn: async (d: Partial<InvitationTheme>) => {
      const { id, invitation_id, created_at, updated_at, ...rest } = d as any;
      const { error } = await supabase.from("invitation_themes").update(rest).eq("invitation_id", invitationId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invitation_themes", invitationId] }); toast.success("Theme updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { ...query, updateTheme };
}

// --- Invitation Pages ---
export function useInvitationPages(invitationId: string) {
  const qc = useQueryClient();
  const key = ["invitation_pages", invitationId];

  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("invitation_pages").select("*").eq("invitation_id", invitationId).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });

  const togglePage = useMutation({
    mutationFn: async ({ id, is_enabled }: { id: string; is_enabled: boolean }) => {
      const { error } = await supabase.from("invitation_pages").update({ is_enabled }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const updateVariant = useMutation({
    mutationFn: async ({ id, style_variant }: { id: string; style_variant: StyleVariant }) => {
      const { error } = await supabase.from("invitation_pages").update({ style_variant }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const reorderPages = useMutation({
    mutationFn: async (pages: { id: string; sort_order: number }[]) => {
      for (const p of pages) {
        await supabase.from("invitation_pages").update({ sort_order: p.sort_order }).eq("id", p.id);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...list, togglePage, updateVariant, reorderPages };
}

// --- Customer Admins ---
export function useCustomerAdmins(invitationId: string) {
  const qc = useQueryClient();
  const key = ["customer_admins", invitationId];
  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("customer_admins").select("*").eq("invitation_id", invitationId).order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!invitationId,
  });
  const create = useMutation({
    mutationFn: async (d: { username: string; password_hash: string; display_name?: string }) => {
      const { error } = await supabase.from("customer_admins").insert({ ...d, invitation_id: invitationId });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Customer admin created"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customer_admins").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return { ...list, create, remove };
}

// --- Analytics ---
export function useRsvpStats(invitationId?: string) {
  return useQuery({
    queryKey: ["rsvp-stats", invitationId],
    queryFn: async () => {
      let query = supabase.from("rsvps").select("status");
      if (invitationId) query = query.eq("invitation_id", invitationId);
      const { data, error } = await query;
      if (error) throw error;
      const stats = { attending: 0, not_attending: 0, maybe: 0, pending: 0 };
      data?.forEach(r => { if (r.status in stats) stats[r.status as keyof typeof stats]++; });
      return stats;
    },
  });
}

export function useGuestsPerInvitation() {
  return useQuery({
    queryKey: ["guests-per-invitation"],
    queryFn: async () => {
      const { data: invitations } = await supabase.from("invitations").select("id, title").is("deleted_at", null);
      if (!invitations?.length) return [];
      const results = await Promise.all(
        invitations.map(async (inv) => {
          const { count } = await supabase.from("guests").select("*", { count: "exact", head: true }).eq("invitation_id", inv.id);
          return { name: inv.title, guests: count || 0 };
        })
      );
      return results;
    },
  });
}

export function useRsvpTimeline() {
  return useQuery({
    queryKey: ["rsvp-timeline"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rsvps").select("responded_at, status").not("responded_at", "is", null).order("responded_at");
      if (error) throw error;
      const grouped: Record<string, number> = {};
      data?.forEach(r => {
        if (r.responded_at) {
          const date = r.responded_at.split("T")[0];
          grouped[date] = (grouped[date] || 0) + 1;
        }
      });
      return Object.entries(grouped).map(([date, count]) => ({ date, count }));
    },
  });
}

// File upload helpers
export async function uploadFile(bucket: string, file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket: string, url: string) {
  const parts = url.split(`/${bucket}/`);
  const path = parts[1];
  if (path) await supabase.storage.from(bucket).remove([path]);
}
