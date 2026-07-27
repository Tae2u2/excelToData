import { describe, expect, it } from "vitest";
import { runValidation } from "./runValidation";
import type { RawSettlementRow, ValidationRuleContext } from "./types";

function buildRow(overrides: Partial<RawSettlementRow> = {}): RawSettlementRow {
  return {
    orderNo: "ORD-1000",
    campaignName: "2026년 3월 공동구매",
    buyerName: "홍길동",
    buyerPhone: "010-0000-0000",
    purchaseAmount: "100000",
    paybackAmount: "10000",
    bankName: "국민은행",
    bankAccountNumber: "123456-01-123456",
    bankAccountHolder: "홍길동",
    memo: "",
    ...overrides,
  };
}

function emptyContext(): ValidationRuleContext {
  return { existingOrderKeys: new Set() };
}

describe("runValidation", () => {
  it("marks a fully valid row as valid", () => {
    const result = runValidation(buildRow(), emptyContext());
    expect(result.rowStatus).toBe("valid");
    expect(Object.values(result.cellResults).every((r) => r?.ok)).toBe(true);
  });

  it("flags a missing orderNo as required", () => {
    const result = runValidation(buildRow({ orderNo: "" }), emptyContext());
    expect(result.rowStatus).toBe("invalid");
    expect(result.cellResults.orderNo).toEqual({ ok: false, message: "주문번호는 필수입니다." });
  });

  it("flags a missing campaignName as required", () => {
    const result = runValidation(buildRow({ campaignName: "  " }), emptyContext());
    expect(result.cellResults.campaignName?.ok).toBe(false);
  });

  it("flags a missing buyerName as required", () => {
    const result = runValidation(buildRow({ buyerName: "" }), emptyContext());
    expect(result.cellResults.buyerName?.ok).toBe(false);
  });

  it("flags a non-numeric purchaseAmount", () => {
    const result = runValidation(buildRow({ purchaseAmount: "abc" }), emptyContext());
    expect(result.cellResults.purchaseAmount).toEqual({
      ok: false,
      message: "구매금액은 0보다 큰 숫자여야 합니다.",
    });
  });

  it("flags a zero purchaseAmount", () => {
    const result = runValidation(buildRow({ purchaseAmount: "0" }), emptyContext());
    expect(result.cellResults.purchaseAmount?.ok).toBe(false);
  });

  it("flags a non-numeric paybackAmount", () => {
    const result = runValidation(buildRow({ paybackAmount: "xyz" }), emptyContext());
    expect(result.cellResults.paybackAmount).toEqual({
      ok: false,
      message: "페이백 금액은 0보다 큰 숫자여야 합니다.",
    });
  });

  it("flags paybackAmount exceeding purchaseAmount", () => {
    const result = runValidation(
      buildRow({ purchaseAmount: "10000", paybackAmount: "20000" }),
      emptyContext()
    );
    expect(result.cellResults.paybackAmount).toEqual({
      ok: false,
      message: "페이백 금액이 구매금액을 초과할 수 없습니다.",
    });
  });

  it("flags an invalid bank account number format", () => {
    const result = runValidation(buildRow({ bankAccountNumber: "abc!!" }), emptyContext());
    expect(result.cellResults.bankAccountNumber?.ok).toBe(false);
  });

  it("accepts a well-formed bank account number", () => {
    const result = runValidation(buildRow({ bankAccountNumber: "110-222-333444" }), emptyContext());
    expect(result.cellResults.bankAccountNumber?.ok).toBe(true);
  });

  it("flags a missing bankName as required regardless of the target field's required flag", () => {
    const result = runValidation(buildRow({ bankName: "" }), emptyContext());
    expect(result.cellResults.bankName).toEqual({ ok: false, message: "은행명은 필수입니다." });
  });

  it("flags a missing bankAccountHolder as required regardless of the target field's required flag", () => {
    const result = runValidation(buildRow({ bankAccountHolder: "" }), emptyContext());
    expect(result.cellResults.bankAccountHolder).toEqual({ ok: false, message: "예금주는 필수입니다." });
  });

  it("flags a duplicate orderNo/campaignName pair found in the query cache", () => {
    const ctx: ValidationRuleContext = {
      existingOrderKeys: new Set(["ORD-1000|2026년 3월 공동구매"]),
    };
    const result = runValidation(buildRow(), ctx);
    expect(result.rowStatus).toBe("invalid");
    expect(result.cellResults.orderNo).toEqual({
      ok: false,
      message: "이미 등록된 주문번호입니다 (중복).",
    });
  });

  it("does not flag the same orderNo when the campaignName differs", () => {
    const ctx: ValidationRuleContext = {
      existingOrderKeys: new Set(["ORD-1000|다른 캠페인"]),
    };
    const result = runValidation(buildRow(), ctx);
    expect(result.cellResults.orderNo?.ok).toBe(true);
  });

  it("prioritizes the required-field message over the duplicate message when both would apply", () => {
    const ctx: ValidationRuleContext = {
      existingOrderKeys: new Set(["|2026년 3월 공동구매"]),
    };
    const result = runValidation(buildRow({ orderNo: "" }), ctx);
    expect(result.cellResults.orderNo).toEqual({ ok: false, message: "주문번호는 필수입니다." });
  });

  it("marks a row invalid when multiple fields fail simultaneously", () => {
    const result = runValidation(
      buildRow({ orderNo: "", purchaseAmount: "abc", bankAccountNumber: "!!" }),
      emptyContext()
    );
    expect(result.rowStatus).toBe("invalid");
    expect(result.cellResults.orderNo?.ok).toBe(false);
    expect(result.cellResults.purchaseAmount?.ok).toBe(false);
    expect(result.cellResults.bankAccountNumber?.ok).toBe(false);
  });
});
