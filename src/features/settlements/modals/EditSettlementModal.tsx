"use client";

import { useState, type FormEvent } from "react";
import type { PaybackStatus, Settlement, UpdateSettlementInput } from "@/features/settlements/types";

interface EditSettlementModalProps {
  row: Settlement;
  onSubmit: (input: UpdateSettlementInput) => Promise<unknown>;
  onClose: () => void;
}

const STATUS_LABEL: Record<PaybackStatus, string> = {
  PENDING: "대기",
  PAID: "지급완료",
  REJECTED: "반려",
};

export default function EditSettlementModal({ row, onSubmit, onClose }: EditSettlementModalProps) {
  const [form, setForm] = useState<UpdateSettlementInput>({
    orderNo: row.orderNo,
    campaignName: row.campaignName,
    buyerName: row.buyerName,
    buyerPhone: row.buyerPhone ?? "",
    purchaseAmount: row.purchaseAmount,
    paybackAmount: row.paybackAmount,
    paybackStatus: row.paybackStatus,
    bankName: row.bankName,
    bankAccountNumber: row.bankAccountNumber,
    bankAccountHolder: row.bankAccountHolder,
    memo: row.memo ?? "",
    rejectedReason: row.rejectedReason ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof UpdateSettlementInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "purchaseAmount" || field === "paybackAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.paybackStatus === "REJECTED" && !form.rejectedReason?.trim()) {
      setError("반려 처리 시 반려 사유는 필수입니다.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        paidAt: form.paybackStatus === "PAID" ? row.paidAt ?? new Date().toISOString() : null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "정산 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">정산 수정 · #{row.id}</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="주문번호" value={form.orderNo ?? ""} onChange={(v) => handleChange("orderNo", v)} />
        <Field label="캠페인명" value={form.campaignName ?? ""} onChange={(v) => handleChange("campaignName", v)} />
        <Field label="구매자명" value={form.buyerName ?? ""} onChange={(v) => handleChange("buyerName", v)} />
        <Field label="구매자 연락처" value={form.buyerPhone ?? ""} onChange={(v) => handleChange("buyerPhone", v)} />
        <Field
          label="구매금액"
          type="number"
          value={String(form.purchaseAmount ?? 0)}
          onChange={(v) => handleChange("purchaseAmount", v)}
        />
        <Field
          label="페이백 금액"
          type="number"
          value={String(form.paybackAmount ?? 0)}
          onChange={(v) => handleChange("paybackAmount", v)}
        />
        <Field label="은행명" value={form.bankName ?? ""} onChange={(v) => handleChange("bankName", v)} />
        <Field
          label="계좌번호"
          value={form.bankAccountNumber ?? ""}
          onChange={(v) => handleChange("bankAccountNumber", v)}
        />
        <Field
          label="예금주"
          value={form.bankAccountHolder ?? ""}
          onChange={(v) => handleChange("bankAccountHolder", v)}
        />
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">페이백 상태</span>
          <select
            value={form.paybackStatus}
            onChange={(e) => handleChange("paybackStatus", e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          >
            {(Object.keys(STATUS_LABEL) as PaybackStatus[]).map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {form.paybackStatus === "REJECTED" && (
        <Field
          label="반려 사유"
          required
          value={form.rejectedReason ?? ""}
          onChange={(v) => handleChange("rejectedReason", v)}
        />
      )}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">메모</span>
        <textarea
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          rows={2}
          value={form.memo ?? ""}
          onChange={(e) => handleChange("memo", e.target.value)}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
      />
    </label>
  );
}
