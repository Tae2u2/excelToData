"use client";

import { createPortal } from "react-dom";
import type { Settlement } from "@/features/settlements/types";
import { useSelection } from "@/features/settlements/selection/SelectionContext";
import { ContextMenu, type RowAction } from "@/components/ui/ContextMenu";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useRowActionsMenu } from "./useRowActionsMenu";

const STATUS_LABEL: Record<Settlement["paybackStatus"], string> = {
  PENDING: "대기",
  PAID: "지급완료",
  REJECTED: "반려",
};

const STATUS_BADGE: Record<Settlement["paybackStatus"], string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

interface SettlementTableProps {
  rows: Settlement[];
  actions: RowAction[] | ((row: Settlement) => RowAction[]);
  onRowAction: (actionKey: string, row: Settlement) => void;
}

export function SettlementTable({ rows, actions, onRowAction }: SettlementTableProps) {
  const { isSelected, toggleAll } = useSelection();
  const allSelected = rows.length > 0 && rows.every((row) => isSelected(row.id));

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
        표시할 정산 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                aria-label="전체 선택"
                checked={allSelected}
                onChange={() => toggleAll(rows)}
                className="h-4 w-4 rounded border-slate-300"
              />
            </th>
            <th className="px-4 py-3">주문번호</th>
            <th className="px-4 py-3">캠페인</th>
            <th className="px-4 py-3">구매자</th>
            <th className="px-4 py-3 text-right">구매금액</th>
            <th className="px-4 py-3 text-right">페이백</th>
            <th className="px-4 py-3">상태</th>
            <th className="w-10 px-2 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <SettlementTableRow
              key={row.id}
              row={row}
              actions={typeof actions === "function" ? actions(row) : actions}
              onAction={onRowAction}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SettlementTableRow({
  row,
  actions,
  onAction,
}: {
  row: Settlement;
  actions: RowAction[];
  onAction: (actionKey: string, row: Settlement) => void;
}) {
  const { menu, openContextMenu, openSheet, close, select } = useRowActionsMenu(row, onAction);
  const { isSelected, toggle } = useSelection();

  return (
    <>
      <tr onContextMenu={openContextMenu} className="hover:bg-slate-50">
        <td className="px-4 py-3">
          <input
            type="checkbox"
            aria-label={`${row.buyerName} · ${row.orderNo} 선택`}
            checked={isSelected(row.id)}
            onChange={() => toggle(row)}
            className="h-4 w-4 rounded border-slate-300"
          />
        </td>
        <td className="px-4 py-3 font-medium text-slate-800">{row.orderNo}</td>
        <td className="px-4 py-3 text-slate-600">{row.campaignName}</td>
        <td className="px-4 py-3 text-slate-600">{row.buyerName}</td>
        <td className="px-4 py-3 text-right text-slate-600">{row.purchaseAmount.toLocaleString()}원</td>
        <td className="px-4 py-3 text-right text-slate-600">{row.paybackAmount.toLocaleString()}원</td>
        <td className="px-4 py-3">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[row.paybackStatus]}`}>
            {STATUS_LABEL[row.paybackStatus]}
          </span>
        </td>
        <td className="px-2 py-3 text-right">
          <button
            type="button"
            onClick={openSheet}
            aria-label="더보기"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          >
            ⋮
          </button>
        </td>
      </tr>

      {menu.open &&
        menu.variant === "context" &&
        typeof document !== "undefined" &&
        createPortal(
          <ContextMenu x={menu.x ?? 0} y={menu.y ?? 0} actions={actions} onSelect={select} onClose={close} />,
          document.body
        )}

      {menu.open &&
        menu.variant === "sheet" &&
        typeof document !== "undefined" &&
        createPortal(
          <BottomSheet
            isOpen
            title={`${row.buyerName} · ${row.orderNo}`}
            actions={actions}
            onSelect={select}
            onClose={close}
          />,
          document.body
        )}
    </>
  );
}
