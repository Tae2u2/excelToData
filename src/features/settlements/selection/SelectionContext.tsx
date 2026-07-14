"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Settlement } from "@/features/settlements/types";

interface SelectionContextValue {
  selectedRows: Settlement[];
  isSelected: (id: number) => boolean;
  toggle: (row: Settlement) => void;
  toggleAll: (rows: Settlement[]) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Map<number, Settlement>>(new Map());

  const toggle = (row: Settlement) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(row.id)) {
        next.delete(row.id);
      } else {
        next.set(row.id, row);
      }
      return next;
    });
  };

  const toggleAll = (rows: Settlement[]) => {
    setSelected((prev) => {
      const allSelected = rows.length > 0 && rows.every((row) => prev.has(row.id));
      const next = new Map(prev);
      rows.forEach((row) => (allSelected ? next.delete(row.id) : next.set(row.id, row)));
      return next;
    });
  };

  const clear = () => setSelected(new Map());

  const value = useMemo<SelectionContextValue>(
    () => ({
      selectedRows: Array.from(selected.values()),
      isSelected: (id) => selected.has(id),
      toggle,
      toggleAll,
      clear,
    }),
    [selected]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}
