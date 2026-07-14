"use client";

import { useState, type FormEvent } from "react";
import type { CreateSettlementInput } from "@/features/settlements/types";

interface RegisterSettlementModalProps {
  onSubmit: (input: CreateSettlementInput) => Promise<unknown>;
  onClose: () => void;
}

const EMPTY_FORM: CreateSettlementInput = {
  orderNo: "",
  campaignName: "",
  buyerName: "",
  buyerPhone: "",
  purchaseAmount: 0,
  paybackAmount: 0,
  bankName: "",
  bankAccountNumber: "",
  bankAccountHolder: "",
  memo: "",
};

export default function RegisterSettlementModal({ onSubmit, onClose }: RegisterSettlementModalProps) {
  const [form, setForm] = useState<CreateSettlementInput>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof CreateSettlementInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "purchaseAmount" || field === "paybackAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "정산 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">정산 등록</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="주문번호" required value={form.orderNo} onChange={(v) => handleChange("orderNo", v)} />
        <Field label="캠페인명" required value={form.campaignName} onChange={(v) => handleChange("campaignName", v)} />
        <Field label="구매자명" required value={form.buyerName} onChange={(v) => handleChange("buyerName", v)} />
        <Field label="구매자 연락처" value={form.buyerPhone ?? ""} onChange={(v) => handleChange("buyerPhone", v)} />
        <Field
          label="구매금액"
          required
          type="number"
          value={String(form.purchaseAmount)}
          onChange={(v) => handleChange("purchaseAmount", v)}
        />
        <Field
          label="페이백 금액"
          required
          type="number"
          value={String(form.paybackAmount)}
          onChange={(v) => handleChange("paybackAmount", v)}
        />
        <Field label="은행명" required value={form.bankName} onChange={(v) => handleChange("bankName", v)} />
        <Field
          label="계좌번호"
          required
          value={form.bankAccountNumber}
          onChange={(v) => handleChange("bankAccountNumber", v)}
        />
        <Field
          label="예금주"
          required
          value={form.bankAccountHolder}
          onChange={(v) => handleChange("bankAccountHolder", v)}
        />
      </div>

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
          {submitting ? "등록 중..." : "등록"}
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
