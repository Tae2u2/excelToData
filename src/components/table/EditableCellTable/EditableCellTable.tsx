"use client";

import { EditableCell } from "./EditableCell";
import { getColumnLetter } from "@/components/table/ExcelGrid/sheetUtils";
import { cn } from "@/lib/cn";
import type { EditableCellTableProps } from "./types";

export function EditableCellTable<TRow extends Record<string, unknown>>({
  columns,
  rows,
  onCellChange,
}: EditableCellTableProps<TRow>) {
  const editableColumns = columns.filter((col) => col.editable !== false);
  const colCount = editableColumns.length;
  const gutterColumn = columns.find((col) => col.editable === false);

  return (
    <div className="max-h-[70vh] overflow-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            {gutterColumn && (
              <th
                rowSpan={2}
                className="sticky left-0 top-0 z-30 h-7 border border-slate-200 bg-slate-50 px-2"
              />
            )}
            {editableColumns.map((col, colIndex) => (
              <th
                key={String(col.field)}
                className="sticky top-0 z-20 h-7 border border-slate-200 bg-slate-50 px-2 text-center text-[11px] font-normal normal-case text-slate-400"
              >
                {getColumnLetter(colIndex)}
              </th>
            ))}
          </tr>
          <tr>
            {editableColumns.map((col) => (
              <th key={String(col.field)} className="sticky top-7 z-20 border border-slate-200 bg-slate-50 px-2 py-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id}>
              {gutterColumn &&
                (() => {
                  const value = row.data[gutterColumn.field];
                  return (
                    <td
                      className={cn(
                        "sticky left-0 z-10 min-w-[56px] border border-slate-200 bg-white p-1 text-center align-top text-slate-500",
                        row.cellResults?.[gutterColumn.field]?.ok === false && "bg-red-50"
                      )}
                    >
                      {String(value ?? "")}
                    </td>
                  );
                })()}
              {editableColumns.map((col, colIndex) => (
                <EditableCell
                  key={String(col.field)}
                  value={String(row.data[col.field] ?? "")}
                  result={row.cellResults?.[col.field]}
                  onCommit={(value) => onCellChange(row.id, col.field, value)}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  rowCount={rows.length}
                  colCount={colCount}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
