"use client";

import { EditableCell } from "./EditableCell";
import type { EditableCellTableProps } from "./types";

export function EditableCellTable<TRow extends Record<string, unknown>>({
  columns,
  rows,
  onCellChange,
}: EditableCellTableProps<TRow>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={String(col.field)} className="border border-slate-200 px-2 py-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <EditableCell
                  key={String(col.field)}
                  value={String(row.data[col.field] ?? "")}
                  result={row.cellResults?.[col.field]}
                  onCommit={(value) => onCellChange(row.id, col.field, value)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
