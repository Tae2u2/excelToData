"use client";

import { useRef, useState } from "react";
import { useOutsideClick } from "./useOutsideClick";

interface ColumnVisibilityMenuProps<TRow> {
  fields: (keyof TRow)[];
  headers: Record<string, string>;
  hiddenFields: Set<keyof TRow>;
  onToggleField: (field: keyof TRow) => void;
  onToggleAll: () => void;
}

export function ColumnVisibilityMenu<TRow>({
  fields,
  headers,
  hiddenFields,
  onToggleField,
  onToggleAll,
}: ColumnVisibilityMenuProps<TRow>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => setOpen(false));

  const allVisible = hiddenFields.size === 0;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="1.5" y="2.5" width="13" height="11" rx="1" />
          <path d="M6 2.5v11M11 2.5v11" />
        </svg>
        테이블 편집
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[10rem] rounded-md border border-slate-200 bg-white py-2 shadow-lg">
          <label className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-slate-50">
            <input type="checkbox" checked={allVisible} onChange={onToggleAll} className="size-3.5" />
            전체 선택
          </label>
          <div className="my-1 border-t border-slate-100" />
          {fields.map((field) => (
            <label
              key={String(field)}
              className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={!hiddenFields.has(field)}
                onChange={() => onToggleField(field)}
                className="size-3.5"
              />
              {headers[String(field)]}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
