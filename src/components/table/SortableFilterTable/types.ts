import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface SortableFilterColumn<TRow> {
  field: keyof TRow;
  header: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  width?: string;
  cell?: (row: TRow) => ReactNode;
}

export interface SortState<TRow> {
  field: keyof TRow | null;
  direction: SortDirection;
}

export type FilterState<TRow> = Partial<Record<keyof TRow, unknown[]>>;

export interface SortableFilterTableProps<TRow> {
  columns: SortableFilterColumn<TRow>[];
  rows: TRow[];
  getRowId: (row: TRow) => string | number;
}
