import * as XLSX from "xlsx";
import type { RawSettlementRow } from "./validation/types";
import type { HeaderFieldMapping } from "./fieldMapping";

export interface RawExcelSheet {
  headers: string[];
  rows: Record<string, unknown>[];
}

export async function readExcelSheet(file: File): Promise<RawExcelSheet> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const table = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });

  if (table.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = table[0].map((cell) => String(cell ?? "").trim()).filter((header) => header.length > 0);
  const rows = table.slice(1).map((row) => {
    const entry: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      entry[header] = row[index];
    });
    return entry;
  });

  return { headers, rows };
}

function emptyRawRow(fieldKeys: string[]): RawSettlementRow {
  const row: RawSettlementRow = {};
  for (const key of fieldKeys) {
    row[key] = "";
  }
  return row;
}

export interface ParsedExcelRow {
  rowNumber: number;
  data: RawSettlementRow;
}

export function applyMapping(
  rows: Record<string, unknown>[],
  mapping: HeaderFieldMapping,
  fieldKeys: string[]
): ParsedExcelRow[] {
  return rows.map((entry, index) => {
    const data = emptyRawRow(fieldKeys);
    for (const [header, field] of Object.entries(mapping)) {
      if (!field) continue;
      const value = entry[header];
      data[field] = value === undefined || value === null ? "" : String(value).trim();
    }
    // Row 1 is the header, so the first data row is excel row 2.
    return { rowNumber: index + 2, data };
  });
}
