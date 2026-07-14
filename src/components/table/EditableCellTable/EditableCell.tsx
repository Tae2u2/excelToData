"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { CellValidationResult } from "./types";

interface EditableCellProps {
  value: string;
  result?: CellValidationResult;
  onCommit: (value: string) => void;
}

export function EditableCell({ value, result, onCommit }: EditableCellProps) {
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  // Re-sync the draft when the committed value changes from outside (e.g. after
  // revalidation). Adjusting state during render (not in an effect) avoids an extra pass.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const isInvalid = result?.ok === false;

  return (
    <td className={cn("min-w-[140px] border border-slate-200 p-1 align-top", isInvalid && "bg-red-50")}>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== value) onCommit(draft);
        }}
        className={cn(
          "w-full rounded border bg-transparent px-2 py-1 text-sm outline-none",
          isInvalid ? "border-red-400 text-red-700" : "border-transparent focus:border-slate-300"
        )}
      />
      {isInvalid && <p className="px-2 pb-1 text-xs text-red-600">{result!.message}</p>}
    </td>
  );
}
