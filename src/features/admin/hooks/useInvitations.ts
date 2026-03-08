import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Invitation, InvitationInsert, InvitationUpdate, EventType } from "../types";
import { DEFAULT_PAGES_BY_EVENT } from "../types";
import { toast } from "sonner";

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
      const { data: inv, error } = await supabase
        .from("invitations")
        .insert(data)
        .select()
        .single();
      if (error) throw error;

      // Create default theme
      await supabase.from("invitation_themes").insert({ invitation_id: inv.id });

      // Create default pages based on event type
      const pages = DEFAULT_PAGES_BY_EVENT[inv.event_type as keyof typeof DEFAULT_PAGES_BY_EVENT] || DEFAULT_PAGES_BY_EVENT.wedding;
      await supabase.from("invitation_pages").insert(
        pages.map((pt, i) => ({
          invitation_id: inv.id,
          page_type: pt,
          sort_order: i,
          is_enabled: true,
        }))
      );

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
