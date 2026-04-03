import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Invitation, InvitationInsert, InvitationUpdate, EventType } from "../types";
import { BLOCK_REGISTRY } from "@/features/blocks/registry";
import type { BlockType } from "@/features/blocks/types";
import { toast } from "sonner";

// Default block templates per event type
const DEFAULT_BLOCKS_BY_EVENT: Record<string, { type: BlockType; contentOverrides?: Record<string, any>; styleOverrides?: Record<string, any> }[]> = {
  debut: [
    { type: "cover_hero", styleOverrides: { fullHeight: true, padding: "0" } },
    { type: "heading", contentOverrides: { text: "You're Invited", level: 1 }, styleOverrides: { padding: "3rem 1rem" } },
    { type: "text", styleOverrides: { padding: "2rem 1rem" } },
    { type: "countdown", styleOverrides: { padding: "3rem 1rem" } },
    { type: "timeline", styleOverrides: { padding: "3rem 1rem" } },
    { type: "entourage", contentOverrides: { entourageTitle: "18 Roses", entourageType: "roses" }, styleOverrides: { padding: "3rem 1rem" } },
    { type: "entourage", contentOverrides: { entourageTitle: "18 Candles", entourageType: "candles" }, styleOverrides: { padding: "3rem 1rem" } },
    { type: "entourage", contentOverrides: { entourageTitle: "18 Treasures", entourageType: "treasures" }, styleOverrides: { padding: "3rem 1rem" } },
    { type: "entourage", contentOverrides: { entourageTitle: "18 Blue Bills", entourageType: "blue_bills" }, styleOverrides: { padding: "3rem 1rem" } },
    { type: "location", styleOverrides: { padding: "3rem 1rem" } },
    { type: "dress_code", styleOverrides: { padding: "3rem 1rem" } },
    { type: "gallery", styleOverrides: { padding: "3rem 1rem" } },
    { type: "gift_registry", styleOverrides: { padding: "3rem 1rem" } },
    { type: "faq", styleOverrides: { padding: "3rem 1rem" } },
    { type: "rsvp", styleOverrides: { padding: "3rem 1rem" } },
  ],
  wedding: [
    { type: "cover_hero", styleOverrides: { fullHeight: true, padding: "0" } },
    { type: "heading", contentOverrides: { text: "We're Getting Married", level: 1 }, styleOverrides: { padding: "3rem 1rem" } },
    { type: "text", styleOverrides: { padding: "2rem 1rem" } },
    { type: "countdown", styleOverrides: { padding: "3rem 1rem" } },
    { type: "timeline", styleOverrides: { padding: "3rem 1rem" } },
    { type: "location", styleOverrides: { padding: "3rem 1rem" } },
    { type: "gallery", styleOverrides: { padding: "3rem 1rem" } },
    { type: "dress_code", styleOverrides: { padding: "3rem 1rem" } },
    { type: "gift_registry", styleOverrides: { padding: "3rem 1rem" } },
    { type: "faq", styleOverrides: { padding: "3rem 1rem" } },
    { type: "rsvp", styleOverrides: { padding: "3rem 1rem" } },
  ],
  birthday: [
    { type: "cover_hero", styleOverrides: { fullHeight: true, padding: "0" } },
    { type: "heading", contentOverrides: { text: "Let's Celebrate!", level: 1 }, styleOverrides: { padding: "3rem 1rem" } },
    { type: "text", styleOverrides: { padding: "2rem 1rem" } },
    { type: "countdown", styleOverrides: { padding: "3rem 1rem" } },
    { type: "timeline", styleOverrides: { padding: "3rem 1rem" } },
    { type: "location", styleOverrides: { padding: "3rem 1rem" } },
    { type: "gallery", styleOverrides: { padding: "3rem 1rem" } },
    { type: "gift_registry", styleOverrides: { padding: "3rem 1rem" } },
    { type: "rsvp", styleOverrides: { padding: "3rem 1rem" } },
  ],
  christening: [
    { type: "cover_hero", styleOverrides: { fullHeight: true, padding: "0" } },
    { type: "heading", contentOverrides: { text: "A Blessed Day", level: 1 }, styleOverrides: { padding: "3rem 1rem" } },
    { type: "text", styleOverrides: { padding: "2rem 1rem" } },
    { type: "countdown", styleOverrides: { padding: "3rem 1rem" } },
    { type: "location", styleOverrides: { padding: "3rem 1rem" } },
    { type: "gallery", styleOverrides: { padding: "3rem 1rem" } },
    { type: "rsvp", styleOverrides: { padding: "3rem 1rem" } },
  ],
  corporate: [
    { type: "cover_hero", styleOverrides: { fullHeight: true, padding: "0" } },
    { type: "heading", contentOverrides: { text: "You're Invited", level: 1 }, styleOverrides: { padding: "3rem 1rem" } },
    { type: "text", styleOverrides: { padding: "2rem 1rem" } },
    { type: "countdown", styleOverrides: { padding: "3rem 1rem" } },
    { type: "timeline", styleOverrides: { padding: "3rem 1rem" } },
    { type: "location", styleOverrides: { padding: "3rem 1rem" } },
    { type: "rsvp", styleOverrides: { padding: "3rem 1rem" } },
  ],
};

export function useInvitations(filters?: {
  search?: string;
  eventType?: EventType | "all";
  status?: "all" | "published" | "draft" | "trash";
  sort?: "newest" | "oldest" | "alpha";
}) {
  return useQuery({
    queryKey: ["invitations", filters],
    queryFn: async () => {
      let query = supabase.from("invitations").select("*");

      if (filters?.status === "trash") {
        query = query.not("deleted_at", "is", null);
      } else {
        query = query.is("deleted_at", null);
        if (filters?.status === "published") query = query.eq("is_published", true);
        if (filters?.status === "draft") query = query.eq("is_published", false);
      }

      if (filters?.eventType && filters.eventType !== "all") {
        query = query.eq("event_type", filters.eventType);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,celebrant_name.ilike.%${filters.search}%`);
      }

      if (filters?.sort === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else if (filters?.sort === "alpha") {
        query = query.order("title", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Invitation[];
    },
  });
}

export function useInvitation(id: string) {
  return useQuery({
    queryKey: ["invitation", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Invitation | null;
    },
    enabled: !!id,
  });
}

export function useCreateInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: InvitationInsert) => {
      // Always create with use_blocks = true
      const { data: inv, error } = await supabase
        .from("invitations")
        .insert({ ...data, use_blocks: true })
        .select()
        .single();
      if (error) throw error;

      // Create default theme
      await supabase.from("invitation_themes").insert({ invitation_id: inv.id });

      // Auto-seed blocks from invitation data
      const blockTemplates = DEFAULT_BLOCKS_BY_EVENT[inv.event_type] || DEFAULT_BLOCKS_BY_EVENT.wedding;
      const blockInserts = blockTemplates.map((bt, i) => {
        const def = BLOCK_REGISTRY[bt.type];
        const content = { ...def.defaultContent };
        const style = { ...def.defaultStyle };

        // Populate content from invitation data
        if (bt.type === "cover_hero") {
          content.overlayText = data.celebrant_name || data.title || "You're Invited";
          content.overlaySubtext = data.event_date ? new Date(data.event_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";
          content.overlay = true;
          if (data.cover_image_url) content.imageUrl = data.cover_image_url;
        }
        if (bt.type === "text" && data.invitation_message) {
          content.body = data.invitation_message;
        }
        if (bt.type === "countdown" && data.event_date) {
          content.targetDate = data.event_date;
        }
        if (bt.type === "location") {
          if (data.venue_name) content.venueName = data.venue_name;
          if (data.venue_address) content.venueAddress = data.venue_address;
          if (data.venue_map_url) content.mapUrl = data.venue_map_url;
          content.showDirections = true;
        }

        // Apply overrides
        if (bt.contentOverrides) Object.assign(content, bt.contentOverrides);
        if (bt.styleOverrides) Object.assign(style, bt.styleOverrides);

        return {
          invitation_id: inv.id,
          block_type: bt.type,
          content: content as any,
          style: style as any,
          sort_order: i,
          is_visible: true,
        };
      });

      await supabase.from("invitation_blocks").insert(blockInserts);

      return inv;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Invitation created successfully!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: InvitationUpdate & { id: string }) => {
      const { data: inv, error } = await supabase
        .from("invitations")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return inv;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["invitations"] });
      qc.invalidateQueries({ queryKey: ["invitation", vars.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSoftDeleteInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("invitations")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Moved to trash");
    },
  });
}

export function useRestoreInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("invitations")
        .update({ deleted_at: null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Invitation restored");
    },
  });
}

export function usePermanentDeleteInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Clean up storage files
      const { data: images } = await supabase
        .from("gallery_images")
        .select("image_url")
        .eq("invitation_id", id);
      
      if (images?.length) {
        const paths = images
          .map(i => i.image_url)
          .filter(Boolean)
          .map(url => {
            const parts = url!.split("/invitation-assets/");
            return parts[1] || "";
          })
          .filter(Boolean);
        if (paths.length) {
          await supabase.storage.from("invitation-assets").remove(paths);
        }
      }

      const { error } = await supabase
        .from("invitations")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Permanently deleted");
    },
  });
}

export function useDuplicateInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: original } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", id)
        .single();
      if (!original) throw new Error("Not found");

      const { id: _, created_at, updated_at, slug, ...rest } = original;
      const newSlug = `${slug}-copy-${Date.now().toString(36)}`;

      const { data: newInv, error } = await supabase
        .from("invitations")
        .insert({ ...rest, slug: newSlug, title: `${rest.title} (Copy)`, is_published: false })
        .select()
        .single();
      if (error) throw error;

      // Copy pages
      const { data: pages } = await supabase
        .from("invitation_pages")
        .select("*")
        .eq("invitation_id", id);
      if (pages?.length) {
        await supabase.from("invitation_pages").insert(
          pages.map(({ id: _, invitation_id, created_at, updated_at, ...p }) => ({
            ...p,
            invitation_id: newInv.id,
          }))
        );
      }

      // Copy theme
      const { data: theme } = await supabase
        .from("invitation_themes")
        .select("*")
        .eq("invitation_id", id)
        .maybeSingle();
      if (theme) {
        const { id: _, invitation_id, created_at, updated_at, ...t } = theme;
        await supabase.from("invitation_themes").insert({ ...t, invitation_id: newInv.id });
      }

      return newInv;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Invitation duplicated!");
    },
  });
}

export function useTogglePublish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from("invitations")
        .update({ is_published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["invitations"] });
      qc.invalidateQueries({ queryKey: ["invitation", vars.id] });
      toast.success(vars.is_published ? "Published!" : "Unpublished");
    },
  });
}

export function useInvitationStats() {
  return useQuery({
    queryKey: ["invitation-stats"],
    queryFn: async () => {
      const { data: invitations } = await supabase
        .from("invitations")
        .select("id, is_published, deleted_at");
      
      const active = invitations?.filter(i => !i.deleted_at) || [];
      const { count: guestCount } = await supabase
        .from("guests")
        .select("*", { count: "exact", head: true });
      const { count: pendingRsvps } = await supabase
        .from("rsvps")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      return {
        total: active.length,
        published: active.filter(i => i.is_published).length,
        totalGuests: guestCount || 0,
        pendingRsvps: pendingRsvps || 0,
      };
    },
  });
}
