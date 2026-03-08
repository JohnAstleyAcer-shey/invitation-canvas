import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InvitationBlock, BlockType, BlockContent, BlockStyle } from "../types";
import { BLOCK_REGISTRY } from "../registry";

// Undo/redo history for block editor
interface HistoryEntry {
  blocks: InvitationBlock[];
  description: string;
  timestamp: number;
}

export function useBlockHistory(blocks: InvitationBlock[]) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  // Push to history when blocks change (not from undo/redo)
  useEffect(() => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }
    if (!blocks.length) return;
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      const entry: HistoryEntry = { blocks: structuredClone(blocks), description: "Edit", timestamp: Date.now() };
      // Debounce: skip if same as last entry within 500ms
      const last = trimmed[trimmed.length - 1];
      if (last && Date.now() - last.timestamp < 500) {
        return [...trimmed.slice(0, -1), entry];
      }
      return [...trimmed, entry].slice(-50); // Keep max 50 entries
    });
    setHistoryIndex(prev => prev + 1);
  }, [blocks]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (!canUndo) return null;
    isUndoRedo.current = true;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    return history[idx]?.blocks ?? null;
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (!canRedo) return null;
    isUndoRedo.current = true;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    return history[idx]?.blocks ?? null;
  }, [canRedo, historyIndex, history]);

  return { canUndo, canRedo, undo, redo, historyCount: history.length };
}

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

  // Real-time subscription for live collaboration
  useEffect(() => {
    if (!invitationId) return;
    const channel = supabase
      .channel(`blocks-${invitationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "invitation_blocks",
          filter: `invitation_id=eq.${invitationId}`,
        },
        () => {
          // Invalidate and refetch on any change
          qc.invalidateQueries({ queryKey: key });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationId, qc]);

  const addBlock = useMutation({
    mutationFn: async ({ blockType, insertAt }: { blockType: BlockType; insertAt?: number }) => {
      const def = BLOCK_REGISTRY[blockType];
      const currentBlocks = query.data ?? [];
      const sortOrder = insertAt ?? currentBlocks.length;

      // If inserting in the middle, shift subsequent blocks
      if (insertAt !== undefined && insertAt < currentBlocks.length) {
        const updates = currentBlocks
          .filter(b => b.sort_order >= insertAt)
          .map(b => supabase.from("invitation_blocks").update({ sort_order: b.sort_order + 1 }).eq("id", b.id));
        await Promise.all(updates);
      }

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
    // Optimistic update for snappy UI
    onMutate: async ({ id, content, style, is_visible }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<InvitationBlock[]>(key);
      qc.setQueryData<InvitationBlock[]>(key, old =>
        old?.map(b => {
          if (b.id !== id) return b;
          return {
            ...b,
            ...(content !== undefined ? { content: content as any } : {}),
            ...(style !== undefined ? { style: style as any } : {}),
            ...(is_visible !== undefined ? { is_visible } : {}),
          };
        }) ?? []
      );
      return { prev };
    },
    onError: (e: Error, _, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
      toast.error(e.message);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });

  const removeBlock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invitation_blocks").delete().eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<InvitationBlock[]>(key);
      qc.setQueryData<InvitationBlock[]>(key, old => old?.filter(b => b.id !== id) ?? []);
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
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
    onMutate: async (orderedIds) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<InvitationBlock[]>(key);
      qc.setQueryData<InvitationBlock[]>(key, old => {
        if (!old) return [];
        const map = new Map(old.map(b => [b.id, b]));
        return orderedIds.map((id, i) => {
          const b = map.get(id)!;
          return { ...b, sort_order: i };
        });
      });
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
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

  // Batch update for undo/redo
  const batchUpdateBlocks = useMutation({
    mutationFn: async (blocks: InvitationBlock[]) => {
      // Delete current and re-insert (simplified approach for undo/redo)
      const { error: delError } = await supabase
        .from("invitation_blocks")
        .delete()
        .eq("invitation_id", invitationId);
      if (delError) throw delError;
      
      if (blocks.length > 0) {
        const { error } = await supabase.from("invitation_blocks").insert(
          blocks.map(b => ({
            invitation_id: invitationId,
            block_type: b.block_type,
            content: b.content as any,
            style: b.style as any,
            sort_order: b.sort_order,
            is_visible: b.is_visible,
          }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
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
    batchUpdateBlocks,
  };
}

export function usePublicBlocks(invitationId: string) {
  const qc = useQueryClient();
  const key = ["public-blocks", invitationId];

  const query = useQuery({
    queryKey: key,
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

  // Real-time for public view too - live updates
  useEffect(() => {
    if (!invitationId) return;
    const channel = supabase
      .channel(`public-blocks-${invitationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "invitation_blocks",
          filter: `invitation_id=eq.${invitationId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: key });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationId, qc]);

  return query;
}
