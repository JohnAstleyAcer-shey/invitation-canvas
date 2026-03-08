import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, Copy, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkPublish?: () => void;
  onBulkUnpublish?: () => void;
  onBulkDuplicate?: () => void;
}

export function BulkActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkPublish,
  onBulkUnpublish,
  onBulkDuplicate,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10 animate-fade-in">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={selectedCount === totalCount}
          onCheckedChange={(checked) => checked ? onSelectAll() : onClearSelection()}
        />
        <span className="text-sm font-medium text-foreground">
          {selectedCount} selected
        </span>
        <button onClick={onClearSelection} className="text-xs text-muted-foreground hover:text-foreground">
          Clear
        </button>
      </div>
      <div className="flex items-center gap-2">
        {onBulkPublish && (
          <Button variant="outline" size="sm" onClick={onBulkPublish} className="rounded-lg text-xs">
            <Eye className="w-3 h-3 mr-1" /> Publish
          </Button>
        )}
        {onBulkUnpublish && (
          <Button variant="outline" size="sm" onClick={onBulkUnpublish} className="rounded-lg text-xs">
            <EyeOff className="w-3 h-3 mr-1" /> Unpublish
          </Button>
        )}
        {onBulkDuplicate && (
          <Button variant="outline" size="sm" onClick={onBulkDuplicate} className="rounded-lg text-xs">
            <Copy className="w-3 h-3 mr-1" /> Duplicate
          </Button>
        )}
        <Button variant="destructive" size="sm" onClick={onBulkDelete} className="rounded-lg text-xs">
          <Trash2 className="w-3 h-3 mr-1" /> Delete ({selectedCount})
        </Button>
      </div>
    </div>
  );
}
