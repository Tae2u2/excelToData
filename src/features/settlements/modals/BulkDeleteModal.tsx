"use client";

import { useState } from "react";
import type { Settlement } from "@/features/settlements/types";

interface BulkDeleteModalProps {
  rows: Settlement[];
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}

export default function BulkDeleteModal({ rows, onConfirm, onClose }: BulkDeleteModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "정산 삭제에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">정산 삭제 ({rows.length}건)</h2>

      <ul className="flex max-h-[50vh] flex-col divide-y divide-slate-200 overflow-y-auto rounded-md border border-slate-200 text-sm">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between px-3 py-2">
            <span className="font-medium text-slate-800">
              {row.buyerName} · {row.orderNo}
            </span>
            <span className="text-slate-500">{row.campaignName}</span>
          </li>
        ))}
      </ul>

      <p className="text-sm text-slate-600">
        선택한 {rows.length}건의 정산을 삭제할까요? 이 작업은 되돌릴 수 없습니다.
      </p>

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
          onClick={handleDelete}
          disabled={submitting}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
        >
          {submitting ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </div>
  );
}
