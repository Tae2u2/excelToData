import type { SortDirection } from "./types";

function compareValues(a: unknown, b: unknown): number {
  const aNum = typeof a === "number" ? a : Number(a);
  const bNum = typeof b === "number" ? b : Number(b);
  if (a !== "" && b !== "" && a != null && b != null && !Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    return aNum - bNum;
  }
  return String(a ?? "").localeCompare(String(b ?? ""));
}

export function sortRows<TRow>(
  rows: TRow[],
  field: keyof TRow | null,
  direction: SortDirection
): TRow[] {
  if (!field || !direction) return rows;

  const sorted = [...rows].sort((a, b) => compareValues(a[field], b[field]));
  return direction === "asc" ? sorted : sorted.reverse();
}

export function nextSortDirection(direction: SortDirection): SortDirection {
  const order: SortDirection[] = ["asc", "desc", null];
  return order[(order.indexOf(direction) + 1) % order.length];
}
