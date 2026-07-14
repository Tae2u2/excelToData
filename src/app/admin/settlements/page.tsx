"use client";

import Link from "next/link";
import { useSettlementsQuery } from "@/features/settlements/api/useSettlementsQuery";
import { useCreateSettlement } from "@/features/settlements/api/useCreateSettlement";
import { useUpdateSettlement } from "@/features/settlements/api/useUpdateSettlement";
import { useDeleteSettlement } from "@/features/settlements/api/useDeleteSettlement";
import { useModal } from "@/features/modal/ModalContext";
import { SettlementTable } from "@/components/table/SettlementTable";
import { SelectionProvider, useSelection } from "@/features/settlements/selection/SelectionContext";
import { SelectionToolbar, type ToolbarAction } from "@/features/settlements/components/SelectionToolbar";
import type { RowAction } from "@/components/ui/ContextMenu";
import type { Settlement } from "@/features/settlements/types";
import { Spinner } from "@/components/ui/Spinner";

const ROW_ACTIONS: RowAction[] = [
  { key: "detail", label: "상세보기" },
  { key: "edit", label: "수정" },
  { key: "related", label: "연관 데이터 조회" },
  { key: "delete", label: "삭제", danger: true },
];

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { key: "detail", label: "상세보기" },
  { key: "edit", label: "수정", requiresExactlyOne: true },
  { key: "related", label: "연관 데이터 조회", requiresExactlyOne: true },
  { key: "delete", label: "삭제", danger: true },
];

export default function AdminSettlementsPage() {
  return (
    <SelectionProvider>
      <AdminSettlementsContent />
    </SelectionProvider>
  );
}

function AdminSettlementsContent() {
  const { data: rows, isLoading } = useSettlementsQuery();
  const createMutation = useCreateSettlement();
  const updateMutation = useUpdateSettlement();
  const deleteMutation = useDeleteSettlement();
  const { open } = useModal();
  const { selectedRows, clear } = useSelection();

  const handleRowAction = (actionKey: string, row: Settlement) => {
    switch (actionKey) {
      case "detail":
        open("settlement/detail", { row });
        break;
      case "edit":
        open("settlement/edit", {
          row,
          onSubmit: (input) => updateMutation.mutateAsync({ id: row.id, input }),
        });
        break;
      case "related":
        open("settlement/related-data", { row });
        break;
      case "delete":
        open("settlement/delete", {
          row,
          onConfirm: () => deleteMutation.mutateAsync(row.id),
        });
        break;
    }
  };

  const handleToolbarAction = (actionKey: string) => {
    switch (actionKey) {
      case "detail":
        open("settlement/bulk-detail", { rows: selectedRows });
        break;
      case "edit":
        if (selectedRows.length === 1) {
          const row = selectedRows[0];
          open("settlement/edit", {
            row,
            onSubmit: (input) => updateMutation.mutateAsync({ id: row.id, input }),
          });
        }
        break;
      case "related":
        if (selectedRows.length === 1) {
          open("settlement/related-data", { row: selectedRows[0] });
        }
        break;
      case "delete":
        open("settlement/bulk-delete", {
          rows: selectedRows,
          onConfirm: async () => {
            await Promise.all(selectedRows.map((row) => deleteMutation.mutateAsync(row.id)));
            clear();
          },
        });
        break;
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">정산 목록</h2>
        <div className="flex gap-2">
          <Link
            href="/admin/settlements/upload"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            엑셀 업로드
          </Link>
          <button
            type="button"
            onClick={() => open("settlement/register", { onSubmit: createMutation.mutateAsync })}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + 새 정산 등록
          </button>
        </div>
      </div>

      <SelectionToolbar actions={TOOLBAR_ACTIONS} onAction={handleToolbarAction} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <SettlementTable rows={rows ?? []} actions={ROW_ACTIONS} onRowAction={handleRowAction} />
      )}
    </div>
  );
}
