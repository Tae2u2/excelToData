"use client";

import { useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { CellValidationResult } from "./types";

interface EditableCellProps {
  value: string;
  result?: CellValidationResult;
  onCommit: (value: string) => void;
  rowIndex: number;
  colIndex: number;
  rowCount: number;
  colCount: number;
}

export function EditableCell({
  value,
  result,
  onCommit,
  rowIndex,
  colIndex,
  rowCount,
  colCount,
}: EditableCellProps) {
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  // Re-sync the draft when the committed value changes from outside (e.g. after
  // revalidation). Adjusting state during render (not in an effect) avoids an extra pass.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const isInvalid = result?.ok === false;

  const focusCell = (table: HTMLTableElement | null, row: number, col: number) => {
    if (!table || row < 0 || row >= rowCount || col < 0 || col >= colCount) return;
    table.querySelector<HTMLInputElement>(`input[data-row="${row}"][data-col="${col}"]`)?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const table = e.currentTarget.closest("table");

    if (e.key === "Escape") {
      e.preventDefault();
      setDraft(value);
      e.currentTarget.blur();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (draft !== value) onCommit(draft);
      focusCell(table, rowIndex + 1, colIndex);
      return;
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      focusCell(table, rowIndex + (e.key === "ArrowDown" ? 1 : -1), colIndex);
      return;
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const input = e.currentTarget;
      const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
      const atEnd = input.selectionStart === input.value.length && input.selectionEnd === input.value.length;
      if (e.key === "ArrowLeft" && atStart) {
        e.preventDefault();
        focusCell(table, rowIndex, colIndex - 1);
      } else if (e.key === "ArrowRight" && atEnd) {
        e.preventDefault();
        focusCell(table, rowIndex, colIndex + 1);
      }
    }
  };

  return (
    <td className={cn("min-w-[140px] border border-slate-200 p-1 align-top", isInvalid && "bg-red-50")}>
      <input
        data-row={rowIndex}
        data-col={colIndex}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== value) onCommit(draft);
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full rounded border bg-transparent px-2 py-1 text-sm outline-none",
          isInvalid ? "border-red-400 text-red-700" : "border-transparent focus:border-slate-300"
        )}
      />
      {isInvalid && <p className="px-2 pb-1 text-xs text-red-600">{result!.message}</p>}
    </td>
  );
}
