"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Link2, Trash2, Users, UserMinus } from "lucide-react";
import { useSettlementsQuery } from "@/features/settlements/api/useSettlementsQuery";
import { useCreateSettlement } from "@/features/settlements/api/useCreateSettlement";
import { useUpdateSettlement } from "@/features/settlements/api/useUpdateSettlement";
import { useDeleteSettlement } from "@/features/settlements/api/useDeleteSettlement";
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
  const actions: RowAction[] = [
    { key: "detail", label: "상세보기", icon: Eye, color: "#2563eb" },
    { key: "edit", label: "수정", icon: Pencil, color: "#d97706" },
    { key: "related", label: "연관 데이터 조회", icon: Link2, color: "#4f46e5" },
    { key: "assign-group", label: "그룹 지정", icon: Users, color: "#0891b2" },
  ];
  if (row.group) {
    actions.push({ key: "remove-from-group", label: "그룹에서 제외", icon: UserMinus, color: "#64748b" });
  }
  actions.push({ key: "delete", label: "삭제", danger: true, icon: Trash2, color: "#dc2626" });
  return actions;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { key: "detail", label: "상세보기", icon: Eye, color: "#2563eb" },
  {
    key: "edit",
    label: "수정",
    requiresExactlyOne: true,
    icon: Pencil,
    color: "#d97706",
  },
  {
    key: "related",
    label: "연관 데이터 조회",
    requiresExactlyOne: true,
    icon: Link2,
    color: "#4f46e5",
  },
  { key: "assign-group", label: "그룹 지정", icon: Users, color: "#0891b2" },
  { key: "remove-from-group", label: "그룹에서 제외", icon: UserMinus, color: "#64748b" },
  { key: "delete", label: "삭제", danger: true, icon: Trash2 },
];

export default function AdminSettlementsPage() {
  return (
    <SelectionProvider>
      <AdminSettlementsContent />
    </SelectionProvider>
  );
}

function AdminSettlementsContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSettlementsQuery({ page, pageSize: PAGE_SIZE });
  const createMutation = useCreateSettlement();
  const updateMutation = useUpdateSettlement();
  const deleteMutation = useDeleteSettlement();
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
      case "edit":
        open("settlement/edit", {
          row,
          onSubmit: (input) =>
            updateMutation.mutateAsync({ id: row.id, input }),
        });
        break;
      case "related":
        open("settlement/related-data", { row });
        break;
      case "assign-group":
        open("settlement/assign-group", {
          rows: [row],
          onSubmit: (groupId) => updateMutation.mutateAsync({ id: row.id, input: { groupId } }),
        });
        break;
      case "remove-from-group":
        open("settlement/remove-from-group", {
          rows: [row],
          onConfirm: () => updateMutation.mutateAsync({ id: row.id, input: { groupId: null } }),
        });
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
            onSubmit: (input) =>
              updateMutation.mutateAsync({ id: row.id, input }),
          });
        }
        break;
      case "related":
        if (selectedRows.length === 1) {
          open("settlement/related-data", { row: selectedRows[0] });
        }
        break;
      case "assign-group":
        open("settlement/assign-group", {
          rows: selectedRows,
          onSubmit: async (groupId) => {
            await Promise.all(
              selectedRows.map((row) =>
                updateMutation.mutateAsync({ id: row.id, input: { groupId } }),
              ),
            );
            clear();
          },
        });
        break;
      case "remove-from-group":
        open("settlement/remove-from-group", {
          rows: selectedRows,
          onConfirm: async () => {
            await Promise.all(
              selectedRows
                .filter((row) => row.groupId !== null)
                .map((row) => updateMutation.mutateAsync({ id: row.id, input: { groupId: null } })),
            );
            clear();
          },
        });
        break;
      case "delete":
        open("settlement/bulk-delete", {
          rows: selectedRows,
          onConfirm: async () => {
            await Promise.all(
              selectedRows.map((row) => deleteMutation.mutateAsync(row.id)),
            );
            clear();
          },
        });
        break;
    }
  };

  return (
    <div className="mx-auto flex max-w-8xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">정산 목록</h2>
        <div className="flex gap-2">
          <Link
            href="/admin/settlements/upload"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            엑셀 업로드
          </Link>
          <button
            type="button"
            onClick={() =>
              open("settlement/register", {
                onSubmit: createMutation.mutateAsync,
              })
            }
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + 새 정산 등록
          </button>
        </div>
      </div>

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
