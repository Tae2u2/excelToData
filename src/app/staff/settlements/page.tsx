"use client";

import { useState } from "react";
import { useSettlementsQuery } from "@/features/settlements/api/useSettlementsQuery";
import { useUpdateSettlement } from "@/features/settlements/api/useUpdateSettlement";
import { useModal } from "@/features/modal/ModalContext";
import { SettlementTable } from "@/components/table/SettlementTable";
import {
  SelectionProvider,
  useSelection,
} from "@/features/settlements/selection/SelectionContext";
import {
  SelectionToolbar,
  type ToolbarAction,
} from "@/features/settlements/components/SelectionToolbar";
import type { RowAction } from "@/components/ui/ContextMenu";
import type { Settlement } from "@/features/settlements/types";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

function rowActionsFor(row: Settlement): RowAction[] {
  const actions: RowAction[] = [{ key: "detail", label: "상세보기" }];
  if (row.paybackStatus === "PENDING") {
    actions.push({ key: "mark-paid", label: "지급완료 처리" });
  }
  return actions;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { key: "detail", label: "상세보기" },
  { key: "mark-paid", label: "지급완료 처리" },
];

export default function StaffSettlementsPage() {
  return (
    <SelectionProvider>
      <StaffSettlementsContent />
    </SelectionProvider>
  );
}

function StaffSettlementsContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSettlementsQuery({
    page,
    pageSize: PAGE_SIZE,
  });
  const updateMutation = useUpdateSettlement();
  const { open } = useModal();
  const { selectedRows, clear } = useSelection();

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    clear();
  };

  const handleRowAction = (actionKey: string, row: Settlement) => {
    switch (actionKey) {
      case "detail":
        open("settlement/detail", { row });
        break;
      case "mark-paid":
        updateMutation.mutate({
          id: row.id,
          input: { paybackStatus: "PAID", paidAt: new Date().toISOString() },
        });
        break;
    }
  };

  const handleToolbarAction = (actionKey: string) => {
    switch (actionKey) {
      case "detail":
        open("settlement/bulk-detail", { rows: selectedRows });
        break;
      case "mark-paid":
        open("settlement/bulk-mark-paid", {
          rows: selectedRows,
          onConfirm: async () => {
            const pending = selectedRows.filter(
              (row) => row.paybackStatus === "PENDING",
            );
            await Promise.all(
              pending.map((row) =>
                updateMutation.mutateAsync({
                  id: row.id,
                  input: {
                    paybackStatus: "PAID",
                    paidAt: new Date().toISOString(),
                  },
                }),
              ),
            );
            clear();
          },
        });
        break;
    }
  };

  return (
    <div className="mx-auto flex max-w-8xl flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-800">정산 목록 (조회)</h2>

      <SelectionToolbar
        actions={TOOLBAR_ACTIONS}
        onAction={handleToolbarAction}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <SettlementTable
            rows={data?.data ?? []}
            actions={rowActionsFor}
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
