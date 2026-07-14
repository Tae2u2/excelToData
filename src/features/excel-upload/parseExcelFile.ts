import * as XLSX from "xlsx";
import type { RawSettlementRow } from "./validation/types";

const HEADER_MAP: Record<string, keyof RawSettlementRow> = {
  주문번호: "orderNo",
  캠페인명: "campaignName",
  구매자명: "buyerName",
  "구매자 연락처": "buyerPhone",
  구매금액: "purchaseAmount",
  "페이백 금액": "paybackAmount",
  은행명: "bankName",
  계좌번호: "bankAccountNumber",
  예금주: "bankAccountHolder",
  메모: "memo",
};

export const EXCEL_TEMPLATE_HEADERS = Object.keys(HEADER_MAP);

export interface ParsedExcelRow {
  rowNumber: number;
  data: RawSettlementRow;
}

export async function parseExcelFile(file: File): Promise<ParsedExcelRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const entries = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  return entries.map((entry, index) => {
    const data = {} as RawSettlementRow;
    for (const [koreanHeader, field] of Object.entries(HEADER_MAP)) {
      const value = entry[koreanHeader];
      data[field] = value === undefined || value === null ? "" : String(value).trim();
    }
    // Row 1 is the header, so the first data row is excel row 2.
    return { rowNumber: index + 2, data };
  });
}
