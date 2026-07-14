import { useEffect, useLayoutEffect, useRef, type Dispatch } from "react";
import type { UploadAction, UploadState } from "./uploadContext";

const STORAGE_KEY = "excel-upload-flow:v1";

export function useUploadSessionStorage(state: UploadState, dispatch: Dispatch<UploadAction>) {
  const hydratedRef = useRef(false);

  // Runs once on mount, before paint, so a refresh doesn't flash the empty "idle" stage.
  useLayoutEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UploadState;
        dispatch({ type: "HYDRATE", state: parsed });
      }
    } catch {
      // Corrupt sessionStorage payload — ignore and continue with the fresh initial state.
    } finally {
      hydratedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Skip writes until hydration has run, otherwise the initial idle state
    // would overwrite a session saved from a previous visit before HYDRATE lands.
    if (!hydratedRef.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable/full — non-fatal, in-memory state still works for this session.
    }
  }, [state]);
}
