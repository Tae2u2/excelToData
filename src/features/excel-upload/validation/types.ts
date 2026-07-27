import type { CellValidationResult } from "@/components/table/EditableCellTable/types";

export type { CellValidationResult };

export type RawSettlementRow = Record<string, string>;

export interface ValidationRuleContext {
  existingOrderKeys: Set<string>;
}

export interface FieldRule {
  field: string;
  validate: (row: RawSettlementRow, ctx: ValidationRuleContext) => CellValidationResult;
}
