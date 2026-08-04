"use client";

import { useMemo } from "react";
import { useAllSettlementsQuery } from "@/features/settlements/api/useSettlementsQuery";
import type { Settlement } from "@/features/settlements/types";

interface RelatedDataLookupModalProps {
  row: Settlement;
  onClose: () => void;
}

const STATUS_LABEL: Record<Settlement["paybackStatus"], string> = {
  PENDING: "대기",
  PAID: "지급완료",
  REJECTED: "반려",
};

export default function RelatedDataLookupModal({ row, onClose }: RelatedDataLookupModalProps) {
  const { data: allSettlements } = useAllSettlementsQuery();

  const relatedRows = useMemo(() => {
    return (allSettlements ?? []).filter(
      (s) => s.buyerName === row.buyerName && s.id !== row.id,
    );
  }, [allSettlements, row.buyerName, row.id]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">연관 데이터 조회</h2>
        <p className="text-sm text-slate-500">
          <span className="font-medium">{row.buyerName}</span>님의 다른 정산 내역
        </p>
      </div>

      {relatedRows.length === 0 ? (
        <p className="rounded-md bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
          연관된 다른 정산 내역이 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-slate-200 rounded-md border border-slate-200">
          {relatedRows.map((r) => (
            <li key={r.id} className="flex flex-col gap-1 px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">{r.campaignName}</span>
                <span className="text-xs text-slate-500">{STATUS_LABEL[r.paybackStatus]}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>주문번호 {r.orderNo}</span>
                <span>{r.paybackAmount.toLocaleString()}원</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
