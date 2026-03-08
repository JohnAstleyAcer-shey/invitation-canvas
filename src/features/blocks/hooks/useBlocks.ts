import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InvitationBlock, BlockType, BlockContent, BlockStyle } from "../types";
import { BLOCK_REGISTRY } from "../registry";

export function useBlocks(invitationId: string) {
  const qc = useQueryClient();
  const key = ["invitation_blocks", invitationId];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitation_blocks")
        .select("*")
        .eq("invitation_id", invitationId)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as InvitationBlock[];
    },
    enabled: !!invitationId,
  });

  const addBlock = useMutation({
    mutationFn: async ({ blockType, insertAt }: { blockType: BlockType; insertAt?: number }) => {
      const def = BLOCK_REGISTRY[blockType];
      const sortOrder = insertAt ?? (query.data?.length ?? 0);
      const { error } = await supabase.from("invitation_blocks").insert({
        invitation_id: invitationId,
        block_type: blockType,
        content: def.defaultContent as any,
        style: def.defaultStyle as any,
        sort_order: sortOrder,
        is_visible: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      toast.success("Block added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateBlock = useMutation({
    mutationFn: async ({ id, content, style, is_visible }: {
      id: string; content?: BlockContent; style?: BlockStyle; is_visible?: boolean;
    }) => {
      const updates: Record<string, any> = {};
      if (content !== undefined) updates.content = content;
      if (style !== undefined) updates.style = style;
      if (is_visible !== undefined) updates.is_visible = is_visible;
      const { error } = await supabase.from("invitation_blocks").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });

  const removeBlock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invitation_blocks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      toast.success("Block removed");
    },
  });

  const duplicateBlock = useMutation({
    mutationFn: async (id: string) => {
      const block = query.data?.find(b => b.id === id);
      if (!block) throw new Error("Block not found");
      const { error } = await supabase.from("invitation_blocks").insert({
        invitation_id: invitationId,
        block_type: block.block_type,
        content: block.content as any,
        style: block.style as any,
        sort_order: block.sort_order + 1,
        is_visible: block.is_visible,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      toast.success("Block duplicated");
    },
  });

  const reorderBlocks = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const updates = orderedIds.map((id, i) =>
        supabase.from("invitation_blocks").update({ sort_order: i }).eq("id", id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const addBlocksFromTemplate = useMutation({
    mutationFn: async (blocks: { block_type: BlockType; content: BlockContent; style: BlockStyle }[]) => {
      const startOrder = query.data?.length ?? 0;
      const { error } = await supabase.from("invitation_blocks").insert(
        blocks.map((b, i) => ({
          invitation_id: invitationId,
          block_type: b.block_type,
          content: b.content as any,
          style: b.style as any,
          sort_order: startOrder + i,
          is_visible: true,
        }))
      );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      toast.success("Template blocks added");
    },
  });

  return {
    blocks: query.data ?? [],
    isLoading: query.isLoading,
    addBlock,
    updateBlock,
    removeBlock,
    duplicateBlock,
    reorderBlocks,
    addBlocksFromTemplate,
  };
}

export function usePublicBlocks(invitationId: string) {
  return useQuery({
    queryKey: ["public-blocks", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitation_blocks")
        .select("*")
        .eq("invitation_id", invitationId)
        .eq("is_visible", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as InvitationBlock[];
    },
    enabled: !!invitationId,
  });
}
