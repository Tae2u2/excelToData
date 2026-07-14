import type { CellValidationResult } from "@/components/table/EditableCellTable/types";

export type { CellValidationResult };

export interface RawSettlementRow {
  orderNo: string;
  campaignName: string;
  buyerName: string;
  buyerPhone: string;
  purchaseAmount: string;
  paybackAmount: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  memo: string;
}

export interface ValidationRuleContext {
  existingOrderKeys: Set<string>;
}

export interface FieldRule {
  field: keyof RawSettlementRow;
  validate: (row: RawSettlementRow, ctx: ValidationRuleContext) => CellValidationResult;
}
