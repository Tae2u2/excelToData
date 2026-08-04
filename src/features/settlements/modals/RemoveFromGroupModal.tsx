"use client";

import { useState } from "react";
import type { Settlement } from "@/features/settlements/types";

interface RemoveFromGroupModalProps {
  rows: Settlement[];
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}

export default function RemoveFromGroupModal({ rows, onConfirm, onClose }: RemoveFromGroupModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const grouped = rows.filter((row) => row.groupId !== null);

  const handleConfirm = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "그룹 해제에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">그룹에서 제외 ({grouped.length}건)</h2>

      <ul className="flex max-h-[50vh] flex-col divide-y divide-slate-200 overflow-y-auto rounded-md border border-slate-200 text-sm">
        {grouped.map((row) => (
          <li key={row.id} className="flex items-center justify-between px-3 py-2">
            <span className="font-medium text-slate-800">
              {row.buyerName} · {row.orderNo}
            </span>
            <span className="text-slate-500">{row.group?.name}</span>
          </li>
        ))}
      </ul>

      {rows.length > grouped.length && (
        <p className="text-xs text-slate-500">
          그룹이 지정되지 않은 {rows.length - grouped.length}건은 제외되고 처리됩니다.
        </p>
      )}

      {grouped.length === 0 ? (
        <p className="rounded-md bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
          그룹에서 제외할 수 있는 정산이 없습니다.
        </p>
      ) : (
        <p className="text-sm text-slate-600">선택한 {grouped.length}건을 그룹에서 제외할까요?</p>
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
          disabled={submitting || grouped.length === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "처리 중..." : "그룹에서 제외"}
        </button>
      </div>
    </div>
  );
}
