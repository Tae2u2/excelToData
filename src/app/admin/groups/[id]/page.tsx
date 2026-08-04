"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, UserMinus } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { SettlementTable } from "@/components/table/SettlementTable";
import { useModal } from "@/features/modal/ModalContext";
import {
  SelectionProvider,
  useSelection,
} from "@/features/settlements/selection/SelectionContext";
import {
  SelectionToolbar,
  type ToolbarAction,
} from "@/features/settlements/components/SelectionToolbar";
import type { RowAction } from "@/components/ui/ContextMenu";
import { useSettlementsQuery } from "@/features/settlements/api/useSettlementsQuery";
import { useUpdateSettlement } from "@/features/settlements/api/useUpdateSettlement";
import type { Settlement } from "@/features/settlements/types";
import { useSettlementGroupQuery } from "@/features/settlement-groups/api/useSettlementGroupQuery";
import { useUpdateSettlementGroup } from "@/features/settlement-groups/api/useUpdateSettlementGroup";
import { useDeleteSettlementGroup } from "@/features/settlement-groups/api/useDeleteSettlementGroup";

const PAGE_SIZE = 20;

const ROW_ACTIONS: RowAction[] = [
  { key: "detail", label: "상세보기", icon: Eye, color: "#2563eb" },
  { key: "remove-from-group", label: "그룹에서 제외", icon: UserMinus, color: "#64748b" },
];

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { key: "remove-from-group", label: "그룹에서 제외", icon: UserMinus, color: "#64748b" },
];

export default function SettlementGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const groupId = Number(id);

  return (
    <SelectionProvider>
      <SettlementGroupDetailContent groupId={groupId} />
    </SelectionProvider>
  );
}

function SettlementGroupDetailContent({ groupId }: { groupId: number }) {
  const router = useRouter();
  const { open } = useModal();
  const { selectedRows, clear } = useSelection();
  const [page, setPage] = useState(1);

  const { data: group, isLoading: groupLoading } = useSettlementGroupQuery(groupId);
  const { data, isLoading: settlementsLoading } = useSettlementsQuery({
    page,
    pageSize: PAGE_SIZE,
    groupId,
  });
  const updateGroup = useUpdateSettlementGroup();
  const deleteGroup = useDeleteSettlementGroup();
  const updateSettlement = useUpdateSettlement();

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    clear();
  };

  const saveName = (name: string) => {
    if (!group || !name.trim() || name.trim() === group.name) return;
    updateGroup.mutate({ id: groupId, input: { name: name.trim() } });
  };

  const saveMemo = (memo: string) => {
    if (!group || memo === (group.memo ?? "")) return;
    updateGroup.mutate({ id: groupId, input: { memo } });
  };

  const handleDeleteGroup = () => {
    if (!group) return;
    if (
      !window.confirm(
        `'${group.name}' 그룹을 삭제할까요? 그룹에 속한 정산 ${group.settlementCount}건은 삭제되지 않고 그룹 지정만 해제됩니다.`,
      )
    ) {
      return;
    }
    deleteGroup.mutate(groupId, { onSuccess: () => router.push("/admin/groups") });
  };

  const handleRowAction = (actionKey: string, row: Settlement) => {
    if (actionKey === "detail") {
      open("settlement/detail", { row });
    } else if (actionKey === "remove-from-group") {
      open("settlement/remove-from-group", {
        rows: [row],
        onConfirm: () => updateSettlement.mutateAsync({ id: row.id, input: { groupId: null } }),
      });
    }
  };

  const handleToolbarAction = (actionKey: string) => {
    if (actionKey === "remove-from-group") {
      open("settlement/remove-from-group", {
        rows: selectedRows,
        onConfirm: async () => {
          await Promise.all(
            selectedRows
              .filter((row) => row.groupId !== null)
              .map((row) => updateSettlement.mutateAsync({ id: row.id, input: { groupId: null } })),
          );
          clear();
        },
      });
    }
  };

  if (groupLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!group) {
    return <p className="text-sm text-slate-500">그룹을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="mx-auto flex max-w-8xl flex-col gap-4">
      <Link href="/admin/groups" className="text-sm text-slate-500 hover:text-slate-700">
        ← 그룹 목록으로
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <input
            key={`${group.id}-${group.updatedAt}-name`}
            type="text"
            defaultValue={group.name}
            onBlur={(e) => saveName(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-lg font-semibold text-slate-800 outline-none focus:border-slate-500"
          />
          <input
            key={`${group.id}-${group.updatedAt}-memo`}
            type="text"
            defaultValue={group.memo ?? ""}
            placeholder="메모 없음"
            onBlur={(e) => saveMemo(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 outline-none focus:border-slate-500"
          />
        </div>
        <button
          type="button"
          onClick={handleDeleteGroup}
          className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          그룹 삭제
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="정산 건수" value={`${group.settlementCount}건`} />
        <SummaryCard label="구매금액 합계" value={`${group.totalPurchaseAmount.toLocaleString()}원`} />
        <SummaryCard label="페이백 합계" value={`${group.totalPaybackAmount.toLocaleString()}원`} />
      </div>

      <SelectionToolbar actions={TOOLBAR_ACTIONS} onAction={handleToolbarAction} />

      {settlementsLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <SettlementTable
            rows={data?.data ?? []}
            actions={ROW_ACTIONS}
            onRowAction={handleRowAction}
          />
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-800">{value}</p>
    </div>
  );
}
