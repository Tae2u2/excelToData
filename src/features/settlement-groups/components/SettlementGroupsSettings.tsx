"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { useSettlementGroupsQuery } from "../api/useSettlementGroupsQuery";
import { useCreateSettlementGroup } from "../api/useCreateSettlementGroup";
import { useUpdateSettlementGroup } from "../api/useUpdateSettlementGroup";
import { useDeleteSettlementGroup } from "../api/useDeleteSettlementGroup";
import type { SettlementGroup } from "../types";

export function SettlementGroupsSettings() {
  const { data: groups, isLoading } = useSettlementGroupsQuery();
  const updateMutation = useUpdateSettlementGroup();
  const deleteMutation = useDeleteSettlementGroup();
  const createMutation = useCreateSettlementGroup();

  const [newName, setNewName] = useState("");
  const [newMemo, setNewMemo] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const saveName = (group: SettlementGroup, name: string) => {
    if (!name.trim() || name.trim() === group.name) return;
    updateMutation.mutate({ id: group.id, input: { name: name.trim() } });
  };

  const saveMemo = (group: SettlementGroup, memo: string) => {
    if (memo === (group.memo ?? "")) return;
    updateMutation.mutate({ id: group.id, input: { memo } });
  };

  const handleDelete = (group: SettlementGroup) => {
    if (
      !window.confirm(
        `'${group.name}' 그룹을 삭제할까요? 그룹에 속한 정산 ${group.settlementCount}건은 삭제되지 않고 그룹 지정만 해제됩니다.`,
      )
    ) {
      return;
    }
    deleteMutation.mutate(group.id);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setAddError(null);
    if (!newName.trim()) {
      setAddError("그룹 이름을 입력해 주세요.");
      return;
    }
    try {
      await createMutation.mutateAsync({ name: newName.trim(), memo: newMemo.trim() || null });
      setNewName("");
      setNewMemo("");
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "그룹 생성에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {(groups?.length ?? 0) > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-3.5 py-2.5">그룹명</th>
                <th className="border-b border-slate-200 px-3.5 py-2.5">메모</th>
                <th className="border-b border-slate-200 px-3.5 py-2.5">정산 건수</th>
                <th className="border-b border-slate-200 px-3.5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {groups?.map((group) => (
                <tr key={group.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-3.5 py-2.5">
                    <input
                      key={`${group.id}-${group.updatedAt}-name`}
                      type="text"
                      defaultValue={group.name}
                      onBlur={(e) => saveName(group, e.target.value)}
                      className="w-full max-w-[12rem] rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </td>
                  <td className="px-3.5 py-2.5">
                    <input
                      key={`${group.id}-${group.updatedAt}-memo`}
                      type="text"
                      defaultValue={group.memo ?? ""}
                      placeholder="메모 없음"
                      onBlur={(e) => saveMemo(group, e.target.value)}
                      className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600">{group.settlementCount}건</td>
                  <td className="px-3.5 py-2.5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/groups/${group.id}`}
                        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        상세보기
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(group)}
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3.5"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">그룹 이름</span>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="예: A소속사"
            className="w-56 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">메모 (선택)</span>
          <input
            type="text"
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
            placeholder="예: 매월 말일 일괄 정산"
            className="w-56 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {createMutation.isPending ? "추가 중..." : "+ 그룹 추가"}
        </button>
      </form>
      {addError && <p className="text-sm text-red-600">{addError}</p>}
    </div>
  );
}
