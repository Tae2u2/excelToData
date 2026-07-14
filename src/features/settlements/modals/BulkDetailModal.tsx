import type { Settlement } from "@/features/settlements/types";

interface BulkDetailModalProps {
  rows: Settlement[];
  onClose: () => void;
}

const STATUS_LABEL: Record<Settlement["paybackStatus"], string> = {
  PENDING: "대기",
  PAID: "지급완료",
  REJECTED: "반려",
};

export default function BulkDetailModal({ rows, onClose }: BulkDetailModalProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">선택한 정산 상세 ({rows.length}건)</h2>

      <ul className="flex max-h-[60vh] flex-col divide-y divide-slate-200 overflow-y-auto rounded-md border border-slate-200">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-col gap-1 px-3 py-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-800">
                {row.orderNo} · {row.campaignName}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {STATUS_LABEL[row.paybackStatus]}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>{row.buyerName}</span>
              <span>{row.paybackAmount.toLocaleString()}원</span>
            </div>
          </li>
        ))}
      </ul>

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
