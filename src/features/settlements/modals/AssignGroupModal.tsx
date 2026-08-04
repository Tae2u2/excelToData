"use client";

import { useState, type FormEvent } from "react";
import { useSettlementGroupsQuery } from "@/features/settlement-groups/api/useSettlementGroupsQuery";
import { useCreateSettlementGroup } from "@/features/settlement-groups/api/useCreateSettlementGroup";
import type { Settlement } from "@/features/settlements/types";

interface AssignGroupModalProps {
  rows: Settlement[];
  onSubmit: (groupId: number) => Promise<unknown>;
  onClose: () => void;
}

export default function AssignGroupModal({ rows, onSubmit, onClose }: AssignGroupModalProps) {
  const { data: groups, isLoading: groupsLoading } = useSettlementGroupsQuery();
  const createGroup = useCreateSettlementGroup();

  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    let groupId: number;
    try {
      if (mode === "new") {
        if (!newGroupName.trim()) {
          setError("그룹 이름을 입력해 주세요.");
          return;
        }
        setSubmitting(true);
        const group = await createGroup.mutateAsync({ name: newGroupName.trim() });
        groupId = group.id;
      } else {
        if (!selectedGroupId) {
          setError("지정할 그룹을 선택해 주세요.");
          return;
        }
        groupId = Number(selectedGroupId);
        setSubmitting(true);
      }
      await onSubmit(groupId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "그룹 지정에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">그룹 지정 ({rows.length}건)</h2>

      <ul className="flex max-h-[30vh] flex-col divide-y divide-slate-200 overflow-y-auto rounded-md border border-slate-200 text-sm">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between px-3 py-2">
            <span className="font-medium text-slate-800">
              {row.buyerName} · {row.orderNo}
            </span>
            <span className="text-slate-500">{row.group?.name ?? "그룹 없음"}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={mode === "existing"}
            onChange={() => setMode("existing")}
          />
          기존 그룹 선택
        </label>
        <label className="flex items-center gap-1.5">
          <input type="radio" checked={mode === "new"} onChange={() => setMode("new")} />
          새 그룹 만들기
        </label>
      </div>

      {mode === "existing" ? (
        groupsLoading ? (
          <p className="text-sm text-slate-500">그룹 목록을 불러오는 중...</p>
        ) : (groups?.length ?? 0) === 0 ? (
          <p className="rounded-md bg-slate-50 px-3 py-3 text-sm text-slate-500">
            생성된 그룹이 없습니다. &apos;새 그룹 만들기&apos;를 선택해 주세요.
          </p>
        ) : (
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          >
            <option value="">그룹 선택</option>
            {groups?.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.settlementCount}건)
              </option>
            ))}
          </select>
        )
      ) : (
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="예: A소속사"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
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
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "지정 중..." : "그룹 지정"}
        </button>
      </div>
    </form>
  );
}
