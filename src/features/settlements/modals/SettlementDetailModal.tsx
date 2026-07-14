import type { Settlement } from "@/features/settlements/types";

interface SettlementDetailModalProps {
  row: Settlement;
  onClose: () => void;
}

const STATUS_LABEL: Record<Settlement["paybackStatus"], string> = {
  PENDING: "대기",
  PAID: "지급완료",
  REJECTED: "반려",
};

export default function SettlementDetailModal({ row, onClose }: SettlementDetailModalProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">정산 상세 · #{row.id}</h2>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
        <Row label="주문번호" value={row.orderNo} />
        <Row label="캠페인명" value={row.campaignName} />
        <Row label="구매자명" value={row.buyerName} />
        <Row label="구매자 연락처" value={row.buyerPhone ?? "-"} />
        <Row label="구매금액" value={`${row.purchaseAmount.toLocaleString()}원`} />
        <Row label="페이백 금액" value={`${row.paybackAmount.toLocaleString()}원`} />
        <Row label="페이백 상태" value={STATUS_LABEL[row.paybackStatus]} />
        <Row label="은행명" value={row.bankName} />
        <Row label="계좌번호" value={row.bankAccountNumber} />
        <Row label="예금주" value={row.bankAccountHolder} />
        {row.rejectedReason && <Row label="반려 사유" value={row.rejectedReason} />}
        <Row label="메모" value={row.memo || "-"} />
        <Row label="등록 파일" value={row.sourceFile || "직접 등록"} />
        <Row label="지급일" value={row.paidAt ? new Date(row.paidAt).toLocaleDateString("ko-KR") : "-"} />
        <Row label="등록일" value={new Date(row.createdAt).toLocaleString("ko-KR")} />
      </dl>

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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
