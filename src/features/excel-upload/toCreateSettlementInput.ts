import type { CreateSettlementInput } from "@/features/settlements/types";
import type { RawSettlementRow } from "./validation/types";

export function toCreateSettlementInput(row: RawSettlementRow, sourceFile: string): CreateSettlementInput {
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
    sourceFile,
  };
}
