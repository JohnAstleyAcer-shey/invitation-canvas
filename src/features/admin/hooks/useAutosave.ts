import { useEffect, useRef, useCallback, useState } from "react";

export function useAutosave(
  saveFn: () => Promise<void>,
  hasChanges: boolean,
  delay = 3000
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback(async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      await saveFn();
      setLastSaved(new Date());
    } catch {
      // error handled by saveFn
    } finally {
      setIsSaving(false);
    }
  }, [saveFn, hasChanges]);

  useEffect(() => {
    if (!hasChanges) return;
    timerRef.current = setTimeout(save, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hasChanges, save, delay]);

  // Save on unmount if there are changes
  useEffect(() => {
    return () => {
      if (hasChanges) save();
    };
  }, []);

  return { lastSaved, isSaving };
}
