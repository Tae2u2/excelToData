"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useOutsideClick } from "./useOutsideClick";

interface ColumnFilterDropdownProps {
  values: unknown[];
  selected: unknown[];
  onChange: (values: unknown[]) => void;
}

export function ColumnFilterDropdown({ values, selected, onChange }: ColumnFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => setOpen(false));

  const toggleValue = (value: unknown) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const visibleValues = values.filter((value) =>
    search === "" ? true : String(value).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        aria-label="필터"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={cn(
          "ml-1 inline-flex size-5 items-center justify-center rounded hover:bg-slate-200",
          selected.length > 0 && "text-blue-600"
        )}
      >
        <svg viewBox="0 0 16 16" className="size-3" fill="currentColor">
          <path d="M1 2h14l-5.5 6.5V14l-3-1.5V8.5z" />
        </svg>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-50 mt-1 w-48 rounded-md border border-slate-200 bg-white p-2 shadow-lg"
        >
          <input
            type="text"
            placeholder="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 w-full rounded border border-slate-200 px-2 py-1 text-xs outline-none focus:border-slate-400"
          />
          <div className="max-h-48 overflow-y-auto">
            {visibleValues.length === 0 && <p className="px-1 py-1 text-xs text-slate-400">항목 없음</p>}
            {visibleValues.map((value) => (
              <label
                key={String(value)}
                className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  className="size-3.5"
                  checked={selected.includes(value)}
                  onChange={() => toggleValue(value)}
                />
                <span className="truncate">{String(value)}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
