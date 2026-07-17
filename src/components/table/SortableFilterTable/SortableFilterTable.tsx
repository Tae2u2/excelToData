"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { ColumnFilterDropdown } from "./ColumnFilterDropdown";
import { ColumnVisibilityMenu } from "./ColumnVisibilityMenu";
import { filterRows, uniqueColumnValues } from "./filterRows";
import { nextSortDirection, sortRows } from "./sortRows";
import type { FilterState, SortState, SortableFilterTableProps } from "./types";

export function SortableFilterTable<TRow extends Record<string, unknown>>({
  columns,
  rows,
  getRowId,
}: SortableFilterTableProps<TRow>) {
  const [sort, setSort] = useState<SortState<TRow>>({ field: null, direction: null });
  const [filters, setFilters] = useState<FilterState<TRow>>({});
  const [hiddenFields, setHiddenFields] = useState<Set<keyof TRow>>(new Set());

  const visibleColumns = columns.filter((col) => !hiddenFields.has(col.field));

  const displayedRows = useMemo(() => {
    const filtered = filterRows(rows, filters);
    return sortRows(filtered, sort.field, sort.direction);
  }, [rows, filters, sort]);

  const headers = Object.fromEntries(columns.map((col) => [String(col.field), col.header]));

  const toggleSort = (field: keyof TRow) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: nextSortDirection(prev.direction) }
        : { field, direction: "asc" }
    );
  };

  const toggleField = (field: keyof TRow) => {
    setHiddenFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  const toggleAllFields = () => {
    setHiddenFields((prev) => (prev.size > 0 ? new Set() : new Set(columns.map((col) => col.field))));
  };

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <ColumnVisibilityMenu
          fields={columns.map((col) => col.field)}
          headers={headers}
          hiddenFields={hiddenFields}
          onToggleField={toggleField}
          onToggleAll={toggleAllFields}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-max text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={String(col.field)}
                  style={{ width: col.width }}
                  className={cn(
                    "border-b border-slate-200 px-3.5 py-2.5",
                    col.enableSorting !== false && "cursor-pointer select-none"
                  )}
                  onClick={() => col.enableSorting !== false && toggleSort(col.field)}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {sort.field === col.field && sort.direction && (
                      <span className="ml-1 text-slate-400">{sort.direction === "asc" ? "▲" : "▼"}</span>
                    )}
                    {col.enableFiltering !== false && (
                      <span onClick={(e) => e.stopPropagation()}>
                        <ColumnFilterDropdown
                          values={uniqueColumnValues(rows, col.field)}
                          selected={filters[col.field] ?? []}
                          onChange={(values) =>
                            setFilters((prev) => ({ ...prev, [col.field]: values }))
                          }
                        />
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-3.5 py-8 text-center text-slate-400">
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              displayedRows.map((row) => (
                <tr key={getRowId(row)} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  {visibleColumns.map((col) => (
                    <td key={String(col.field)} className="px-3.5 py-3 text-slate-700">
                      {col.cell ? col.cell(row) : String(row[col.field] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
