import { useEffect, useRef, useState } from "react";
import { Keyboard, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Shortcut {
  keys: string[];
  label: string;
  action?: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      for (const shortcut of shortcuts) {
        const match = shortcut.keys.every(k => {
          if (k === "Meta" || k === "Ctrl") return e.metaKey || e.ctrlKey;
          if (k === "Shift") return e.shiftKey;
          if (k === "Alt") return e.altKey;
          return e.key.toLowerCase() === k.toLowerCase();
        });
        if (match && shortcut.action) {
          e.preventDefault();
          shortcut.action();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}

export function KeyboardShortcutsDialog({ open, onOpenChange, shortcuts }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: Shortcut[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Keyboard className="w-5 h-5" /> Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-1 text-sm">
              <span className="text-muted-foreground">{s.label}</span>
              <div className="flex gap-1">
                {s.keys.map(k => (
                  <kbd key={k} className="px-2 py-0.5 rounded bg-muted border border-border text-xs font-mono text-foreground">
                    {k === "Meta" ? "⌘" : k === "Ctrl" ? "Ctrl" : k === "Shift" ? "⇧" : k === "Alt" ? "⌥" : k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
