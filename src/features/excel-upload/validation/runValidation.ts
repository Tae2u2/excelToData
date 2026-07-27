import type { TargetFieldConfig } from "../fieldMapping";
import { rules } from "./rules";
import type { CellValidationResult, FieldRule, RawSettlementRow, ValidationRuleContext } from "./types";

export interface RowValidationResult {
  cellResults: Partial<Record<string, CellValidationResult>>;
  rowStatus: "valid" | "invalid";
}

export function runValidation(
  row: RawSettlementRow,
  ctx: ValidationRuleContext,
  targetFields: TargetFieldConfig[] = []
): RowValidationResult {
  const rulesByField = new Map<string, FieldRule[]>();
  const fieldOrder: string[] = [];

  for (const rule of rules) {
    if (!rulesByField.has(rule.field)) {
      rulesByField.set(rule.field, []);
      fieldOrder.push(rule.field);
    }
    rulesByField.get(rule.field)!.push(rule);
  }

  // Fields with no explicit rule (custom target fields) only get a generic
  // required-value check when marked required — built-in fields keep their
  // hand-written messages above and are never duplicated here.
  for (const config of targetFields) {
    if (config.required && !rulesByField.has(config.key)) {
      rulesByField.set(config.key, [
        {
          field: config.key,
          validate: (r) =>
            r[config.key]?.trim() ? { ok: true } : { ok: false, message: `${config.label}은(는) 필수입니다.` },
        },
      ]);
      fieldOrder.push(config.key);
    }
  }

  const cellResults: Partial<Record<string, CellValidationResult>> = {};

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
