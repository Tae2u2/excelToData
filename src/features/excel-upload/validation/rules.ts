import type { FieldRule } from "./types";

function isPositiveInteger(value: string): boolean {
  return /^[0-9]+$/.test(value.trim()) && Number(value) > 0;
}

export const rules: FieldRule[] = [
  {
    field: "orderNo",
    validate: (row) =>
      row.orderNo.trim() ? { ok: true } : { ok: false, message: "주문번호는 필수입니다." },
  },
  {
    field: "campaignName",
    validate: (row) =>
      row.campaignName.trim() ? { ok: true } : { ok: false, message: "캠페인명은 필수입니다." },
  },
  {
    field: "buyerName",
    validate: (row) =>
      row.buyerName.trim() ? { ok: true } : { ok: false, message: "구매자명은 필수입니다." },
  },
  {
    field: "purchaseAmount",
    validate: (row) =>
      isPositiveInteger(row.purchaseAmount)
        ? { ok: true }
        : { ok: false, message: "구매금액은 0보다 큰 숫자여야 합니다." },
  },
  {
    field: "paybackAmount",
    validate: (row) => {
      if (!isPositiveInteger(row.paybackAmount)) {
        return { ok: false, message: "페이백 금액은 0보다 큰 숫자여야 합니다." };
      }
      if (Number(row.paybackAmount) > Number(row.purchaseAmount)) {
        return { ok: false, message: "페이백 금액이 구매금액을 초과할 수 없습니다." };
      }
      return { ok: true };
    },
  },
  {
    field: "bankName",
    validate: (row) =>
      row.bankName.trim() ? { ok: true } : { ok: false, message: "은행명은 필수입니다." },
  },
  {
    field: "bankAccountNumber",
    validate: (row) =>
      /^[0-9-]{6,20}$/.test(row.bankAccountNumber.trim())
        ? { ok: true }
        : { ok: false, message: "계좌번호 형식이 올바르지 않습니다." },
  },
  {
    field: "bankAccountHolder",
    validate: (row) =>
      row.bankAccountHolder.trim() ? { ok: true } : { ok: false, message: "예금주는 필수입니다." },
  },
  {
    field: "orderNo",
    validate: (row, ctx) => {
      const key = `${row.orderNo}|${row.campaignName}`;
      return ctx.existingOrderKeys.has(key)
        ? { ok: false, message: "이미 등록된 주문번호입니다 (중복)." }
        : { ok: true };
    },
  },
];
