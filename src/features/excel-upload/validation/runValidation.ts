import { rules } from "./rules";
import type { CellValidationResult, RawSettlementRow, ValidationRuleContext } from "./types";

export interface RowValidationResult {
  cellResults: Partial<Record<keyof RawSettlementRow, CellValidationResult>>;
  rowStatus: "valid" | "invalid";
}

export function runValidation(row: RawSettlementRow, ctx: ValidationRuleContext): RowValidationResult {
  const rulesByField = new Map<keyof RawSettlementRow, typeof rules>();
  const fieldOrder: (keyof RawSettlementRow)[] = [];

  for (const rule of rules) {
    if (!rulesByField.has(rule.field)) {
      rulesByField.set(rule.field, []);
      fieldOrder.push(rule.field);
    }
    rulesByField.get(rule.field)!.push(rule);
  }

  const cellResults: Partial<Record<keyof RawSettlementRow, CellValidationResult>> = {};

  for (const field of fieldOrder) {
    let result: CellValidationResult = { ok: true };
    for (const rule of rulesByField.get(field)!) {
      const ruleResult = rule.validate(row, ctx);
      if (!ruleResult.ok) {
        result = ruleResult;
        break;
      }
    }
    cellResults[field] = result;
  }

  const rowStatus = Object.values(cellResults).every((result) => result?.ok) ? "valid" : "invalid";

  return { cellResults, rowStatus };
}
