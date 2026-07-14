"use client";

import { useState } from "react";
import type { Settlement } from "@/features/settlements/types";

interface BulkMarkPaidModalProps {
  rows: Settlement[];
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}

export default function BulkMarkPaidModal({ rows, onConfirm, onClose }: BulkMarkPaidModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pendingRows = rows.filter((row) => row.paybackStatus === "PENDING");
  const skippedRows = rows.filter((row) => row.paybackStatus !== "PENDING");

  const handleConfirm = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "지급완료 처리에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">지급완료 처리 ({pendingRows.length}건)</h2>

      <ul className="flex max-h-[50vh] flex-col divide-y divide-slate-200 overflow-y-auto rounded-md border border-slate-200 text-sm">
        {pendingRows.map((row) => (
          <li key={row.id} className="flex items-center justify-between px-3 py-2">
            <span className="font-medium text-slate-800">
              {row.buyerName} · {row.orderNo}
            </span>
            <span className="text-slate-500">{row.paybackAmount.toLocaleString()}원</span>
          </li>
        ))}
      </ul>

      {skippedRows.length > 0 && (
        <p className="text-xs text-slate-500">
          이미 대기 상태가 아닌 {skippedRows.length}건은 제외되고 처리됩니다.
        </p>
      )}

      {pendingRows.length === 0 ? (
        <p className="rounded-md bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
          지급완료 처리할 수 있는 대기 상태 정산이 없습니다.
        </p>
      ) : (
        <p className="text-sm text-slate-600">선택한 {pendingRows.length}건을 지급완료 처리할까요?</p>
      )}

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
          type="button"
          onClick={handleConfirm}
          disabled={submitting || pendingRows.length === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "처리 중..." : "지급완료 처리"}
        </button>
      </div>
    </div>
  );
}
