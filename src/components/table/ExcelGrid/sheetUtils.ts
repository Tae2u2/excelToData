import type { ExcelGridColumn, ExcelSheet } from "./types";

export function getColumnLetter(index: number): string {
  let result = "";
  let n = index;

  while (n >= 0) {
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26) - 1;
  }

  return result;
}

export function buildSheetFromData(
  data: Record<string, unknown>[],
  columns: ExcelGridColumn[]
): ExcelSheet {
  const sheet: ExcelSheet = {};

  columns.forEach((col, colIndex) => {
    const cellId = `${getColumnLetter(colIndex)}1`;
    sheet[cellId] = { value: col.title };
  });

  data.forEach((row, rowIndex) => {
    columns.forEach((col, colIndex) => {
      const cellId = `${getColumnLetter(colIndex)}${rowIndex + 2}`;
      sheet[cellId] = { value: String(row[col.dataIndex] ?? "") };
    });
  });

  return sheet;
}
