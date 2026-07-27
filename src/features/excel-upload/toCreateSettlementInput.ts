import type { CreateSettlementInput } from "@/features/settlements/types";
import type { TargetField } from "@/features/target-fields/types";
import type { RawSettlementRow } from "./validation/types";

export function toCreateSettlementInput(
  row: RawSettlementRow,
  sourceFile: string,
  targetFields: TargetField[]
): CreateSettlementInput {
  const extraFields: Record<string, string> = {};
  for (const field of targetFields) {
    if (field.isBuiltIn) continue;
    const value = row[field.key]?.trim();
    if (value) extraFields[field.key] = value;
  }

  return {
    orderNo: row.orderNo.trim(),
    campaignName: row.campaignName.trim(),
    buyerName: row.buyerName.trim(),
    buyerPhone: row.buyerPhone.trim() || null,
    purchaseAmount: Number(row.purchaseAmount),
    paybackAmount: Number(row.paybackAmount),
    bankName: row.bankName.trim(),
    bankAccountNumber: row.bankAccountNumber.trim(),
    bankAccountHolder: row.bankAccountHolder.trim(),
    memo: row.memo.trim() || null,
    extraFields: Object.keys(extraFields).length > 0 ? extraFields : null,
    sourceFile,
  };
}
