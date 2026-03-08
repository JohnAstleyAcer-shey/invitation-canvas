import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Guest, Rsvp, TimelineEvent, Rose, Candle, Treasure, BlueBill, GalleryImage, DressCodeColor, GiftItem, Faq, InvitationTheme, InvitationPage, CustomerAdmin } from "../types";
import { toast } from "sonner";

// Generic CRUD hook factory
function useEntityList<T>(table: string, invitationId: string, orderBy = "sort_order") {
  return useQuery({
    queryKey: [table, invitationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("invitation_id", invitationId)
        .order(orderBy);
      if (error) throw error;
      return data as T[];
    },
    enabled: !!invitationId,
  });
}

function useEntityMutations<T extends Record<string, any>>(table: string, invitationId: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: [table, invitationId] });

  const create = useMutation({
    mutationFn: async (data: Partial<T>) => {
      const { data: result, error } = await supabase
        .from(table)
        .insert({ ...data, invitation_id: invitationId })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...data }: Partial<T> & { id: string }) => {
      const { error } = await supabase.from(table).update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkCreate = useMutation({
    mutationFn: async (items: Partial<T>[]) => {
      const { error } = await supabase
        .from(table)
        .insert(items.map(item => ({ ...item, invitation_id: invitationId })));
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  return { create, update, remove, bulkCreate };
}

// Specific hooks
export function useGuests(invitationId: string) {
  const list = useEntityList<Guest>("guests", invitationId, "created_at");
  const mutations = useEntityMutations<Guest>("guests", invitationId);
  return { ...list, ...mutations };
}

export function useRsvps(invitationId: string) {
  const list = useEntityList<Rsvp>("rsvps", invitationId, "created_at");
  const mutations = useEntityMutations<Rsvp>("rsvps", invitationId);
  return { ...list, ...mutations };
}

export function useTimelineEvents(invitationId: string) {
  const list = useEntityList<TimelineEvent>("timeline_events", invitationId);
  const mutations = useEntityMutations<TimelineEvent>("timeline_events", invitationId);
  return { ...list, ...mutations };
}

export function useRoses(invitationId: string) {
  const list = useEntityList<Rose>("roses", invitationId);
  const mutations = useEntityMutations<Rose>("roses", invitationId);
  return { ...list, ...mutations };
}

export function useCandles(invitationId: string) {
  const list = useEntityList<Candle>("candles", invitationId);
  const mutations = useEntityMutations<Candle>("candles", invitationId);
  return { ...list, ...mutations };
}

export function useTreasures(invitationId: string) {
  const list = useEntityList<Treasure>("treasures", invitationId);
  const mutations = useEntityMutations<Treasure>("treasures", invitationId);
  return { ...list, ...mutations };
}

export function useBlueBills(invitationId: string) {
  const list = useEntityList<BlueBill>("blue_bills", invitationId);
  const mutations = useEntityMutations<BlueBill>("blue_bills", invitationId);
  return { ...list, ...mutations };
}

export function useGalleryImages(invitationId: string) {
  const list = useEntityList<GalleryImage>("gallery_images", invitationId);
  const mutations = useEntityMutations<GalleryImage>("gallery_images", invitationId);
  return { ...list, ...mutations };
}

export function useDressCodeColors(invitationId: string) {
  const list = useEntityList<DressCodeColor>("dress_code_colors", invitationId);
  const mutations = useEntityMutations<DressCodeColor>("dress_code_colors", invitationId);
  return { ...list, ...mutations };
}

export function useGiftItems(invitationId: string) {
  const list = useEntityList<GiftItem>("gift_items", invitationId);
  const mutations = useEntityMutations<GiftItem>("gift_items", invitationId);
  return { ...list, ...mutations };
}

export function useFaqs(invitationId: string) {
  const list = useEntityList<Faq>("faqs", invitationId);
  const mutations = useEntityMutations<Faq>("faqs", invitationId);
  return { ...list, ...mutations };
}

export function useInvitationTheme(invitationId: string) {
  const query = useQuery({
    queryKey: ["invitation_themes", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitation_themes")
        .select("*")
        .eq("invitation_id", invitationId)
        .maybeSingle();
      if (error) throw error;
      return data as InvitationTheme | null;
    },
    enabled: !!invitationId,
  });

  const qc = useQueryClient();
  const updateTheme = useMutation({
    mutationFn: async (data: Partial<InvitationTheme>) => {
      const { error } = await supabase
        .from("invitation_themes")
        .update(data)
        .eq("invitation_id", invitationId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invitation_themes", invitationId] });
      toast.success("Theme updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { ...query, updateTheme };
}

export function useInvitationPages(invitationId: string) {
  const list = useEntityList<InvitationPage>("invitation_pages", invitationId);
  const qc = useQueryClient();

  const togglePage = useMutation({
    mutationFn: async ({ id, is_enabled }: { id: string; is_enabled: boolean }) => {
      const { error } = await supabase
        .from("invitation_pages")
        .update({ is_enabled })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invitation_pages", invitationId] }),
  });

  const updateVariant = useMutation({
    mutationFn: async ({ id, style_variant }: { id: string; style_variant: string }) => {
      const { error } = await supabase
        .from("invitation_pages")
        .update({ style_variant })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invitation_pages", invitationId] }),
  });

  const reorderPages = useMutation({
    mutationFn: async (pages: { id: string; sort_order: number }[]) => {
      for (const p of pages) {
        await supabase.from("invitation_pages").update({ sort_order: p.sort_order }).eq("id", p.id);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invitation_pages", invitationId] }),
  });

  return { ...list, togglePage, updateVariant, reorderPages };
}

export function useCustomerAdmins(invitationId: string) {
  const list = useEntityList<CustomerAdmin>("customer_admins", invitationId, "created_at");
  const mutations = useEntityMutations<CustomerAdmin>("customer_admins", invitationId);
  return { ...list, ...mutations };
}

// Analytics hooks
export function useRsvpStats(invitationId?: string) {
  return useQuery({
    queryKey: ["rsvp-stats", invitationId],
    queryFn: async () => {
      let query = supabase.from("rsvps").select("status, invitation_id");
      if (invitationId) query = query.eq("invitation_id", invitationId);
      const { data, error } = await query;
      if (error) throw error;

      const stats = { attending: 0, not_attending: 0, maybe: 0, pending: 0 };
      data?.forEach(r => {
        if (r.status in stats) stats[r.status as keyof typeof stats]++;
      });
      return stats;
    },
  });
}

export function useGuestsPerInvitation() {
  return useQuery({
    queryKey: ["guests-per-invitation"],
    queryFn: async () => {
      const { data: invitations } = await supabase
        .from("invitations")
        .select("id, title")
        .is("deleted_at", null);
      
      if (!invitations?.length) return [];

      const results = await Promise.all(
        invitations.map(async (inv) => {
          const { count } = await supabase
            .from("guests")
            .select("*", { count: "exact", head: true })
            .eq("invitation_id", inv.id);
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
      const { data, error } = await supabase
        .from("rsvps")
        .select("responded_at, status")
        .not("responded_at", "is", null)
        .order("responded_at");
      if (error) throw error;

      // Group by date
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

// File upload helper
export async function uploadFile(
  bucket: string,
  file: File,
  folder: string
): Promise<string> {
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
  if (path) {
    await supabase.storage.from(bucket).remove([path]);
  }
}
