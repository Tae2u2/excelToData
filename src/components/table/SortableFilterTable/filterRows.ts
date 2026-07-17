import type { FilterState } from "./types";

export function filterRows<TRow>(rows: TRow[], filters: FilterState<TRow>): TRow[] {
  const activeFilters = Object.entries(filters).filter(
    ([, values]) => Array.isArray(values) && values.length > 0
  ) as [keyof TRow, unknown[]][];

  if (activeFilters.length === 0) return rows;

  return rows.filter((row) => activeFilters.every(([field, values]) => values.includes(row[field])));
}

export function uniqueColumnValues<TRow>(rows: TRow[], field: keyof TRow): unknown[] {
  return Array.from(new Set(rows.map((row) => row[field]))).filter(
    (value) => value !== undefined && value !== null && value !== ""
  );
}
