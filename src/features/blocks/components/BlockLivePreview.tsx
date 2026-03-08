import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockViewRenderer } from "./BlockViewRenderer";
import type { InvitationBlock } from "../types";

interface BlockLivePreviewProps {
  blocks: InvitationBlock[];
}

export function BlockLivePreview({ blocks }: BlockLivePreviewProps) {
  const visibleBlocks = blocks.filter(b => b.is_visible);

  if (!visibleBlocks.length) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-xs text-muted-foreground text-center">
          Add blocks to see the live preview
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <BlockViewRenderer blocks={visibleBlocks} />
    </div>
  );
}
