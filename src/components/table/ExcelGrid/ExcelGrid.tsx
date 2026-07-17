"use client";

import { useState } from "react";
import { ExcelGridCell } from "./ExcelGridCell";
import { getColumnLetter } from "./sheetUtils";
import { useExcelGridState } from "./useExcelGridState";
import type { ExcelGridColumn } from "./types";

interface ExcelGridProps {
  data?: Record<string, unknown>[];
  columns?: ExcelGridColumn[];
  initialRowCount?: number;
  initialColCount?: number;
}

export function ExcelGrid({
  data,
  columns,
  initialRowCount = 10,
  initialColCount = 8,
}: ExcelGridProps) {
  const { sheet, updateCell, setSheetFromData } = useExcelGridState();
  const [rowCount, setRowCount] = useState(initialRowCount);
  const [colCount, setColCount] = useState(initialColCount);
  const [seededData, setSeededData] = useState<typeof data>(undefined);

  // Re-seed the sheet when a new `data` array arrives (e.g. a fresh upload),
  // mirroring EditableCell's render-time sync instead of an effect + setState.
  if (data && columns && data.length > 0 && data !== seededData) {
    setSeededData(data);
    setRowCount(data.length);
    setColCount(columns.length);
    setSheetFromData({ data, columns });
  }

  const colLetters = Array.from({ length: colCount }, (_, c) => getColumnLetter(c));
  const rowIndexes = Array.from({ length: rowCount }, (_, r) => r);

  return (
    <div className="w-full overflow-auto rounded-lg border border-slate-200">
      <table className="table-fixed border-collapse">
        <thead>
          <tr>
            <th className="h-8 w-10 border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
              #
            </th>
            {colLetters.map((letter) => (
              <th
                key={letter}
                className="h-8 min-w-[90px] border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500"
              >
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowIndexes.map((row) => (
            <tr key={row}>
              <td className="w-10 border border-slate-200 bg-slate-100 text-center align-top text-xs text-slate-500">
                {row + 1}
              </td>
              {colLetters.map((letter, col) => {
                const id = `${letter}${row + 1}`;
                const cell = sheet[id];
                if (cell?.merged) return null;

                return (
                  <ExcelGridCell
                    key={id}
                    id={id}
                    row={row}
                    col={col}
                    value={cell?.value ?? ""}
                    rowSpan={cell?.merge?.rowspan ?? 1}
                    colSpan={cell?.merge?.colspan ?? 1}
                    rowCount={rowCount}
                    colCount={colCount}
                    onCommit={updateCell}
                    onGrowRows={() => setRowCount((prev) => prev + 1)}
                    onGrowCols={() => setColCount((prev) => prev + 1)}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
