"use client";

import { useState, type FormEvent } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { useTargetFieldsQuery } from "../api/useTargetFieldsQuery";
import { useCreateTargetField } from "../api/useCreateTargetField";
import { useUpdateTargetField } from "../api/useUpdateTargetField";
import { useDeleteTargetField } from "../api/useDeleteTargetField";
import type { TargetField } from "../types";

export function TargetFieldsSettings() {
  const { data: targetFields, isLoading } = useTargetFieldsQuery();
  const updateMutation = useUpdateTargetField();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const builtInFields = (targetFields ?? [])
    .filter((f) => f.isBuiltIn)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const customFields = (targetFields ?? [])
    .filter((f) => !f.isBuiltIn)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const saveLabel = (field: TargetField, label: string) => {
    if (!label.trim() || label.trim() === field.label) return;
    updateMutation.mutate({ id: field.id, input: { label: label.trim() } });
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-800">기본 항목</h3>
          <p className="mt-1 text-sm text-slate-500">
            정산 데이터의 고정 항목입니다. 이름은 바꿀 수 있지만, 필수 여부는 변경할 수 없습니다.
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-3.5 py-2.5">항목명</th>
                <th className="border-b border-slate-200 px-3.5 py-2.5">필수 여부</th>
              </tr>
            </thead>
            <tbody>
              {builtInFields.map((field) => (
                <tr key={field.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-3.5 py-2.5">
                    <input
                      key={`${field.id}-${field.updatedAt}`}
                      type="text"
                      defaultValue={field.label}
                      onBlur={(e) => saveLabel(field, e.target.value)}
                      className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        field.required ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {field.required ? "필수" : "선택"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CustomFieldsSection customFields={customFields} saveLabel={saveLabel} />
    </div>
  );
}

function CustomFieldsSection({
  customFields,
  saveLabel,
}: {
  customFields: TargetField[];
  saveLabel: (field: TargetField, label: string) => void;
}) {
  const updateMutation = useUpdateTargetField();
  const createMutation = useCreateTargetField();
  const deleteMutation = useDeleteTargetField();

  const [newLabel, setNewLabel] = useState("");
  const [newRequired, setNewRequired] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setAddError(null);
    if (!newLabel.trim()) {
      setAddError("항목 이름을 입력해 주세요.");
      return;
    }
    try {
      await createMutation.mutateAsync({ label: newLabel.trim(), required: newRequired });
      setNewLabel("");
      setNewRequired(false);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "매핑 항목 추가에 실패했습니다.");
    }
  };

  const toggleRequired = (field: TargetField) => {
    updateMutation.mutate({ id: field.id, input: { required: !field.required } });
  };

  const move = (index: number, direction: -1 | 1) => {
    const neighborIndex = index + direction;
    if (neighborIndex < 0 || neighborIndex >= customFields.length) return;
    const current = customFields[index];
    const neighbor = customFields[neighborIndex];
    updateMutation.mutate({ id: current.id, input: { sortOrder: neighbor.sortOrder } });
    updateMutation.mutate({ id: neighbor.id, input: { sortOrder: current.sortOrder } });
  };

  const handleDelete = (field: TargetField) => {
    if (!window.confirm(`'${field.label}' 항목을 삭제할까요? 이미 업로드된 데이터의 값은 남아있지만, 더 이상 매핑할 수 없습니다.`)) {
      return;
    }
    deleteMutation.mutate(field.id);
  };

  return (
    <section className="flex flex-col gap-2">
      <div>
        <h3 className="text-base font-semibold text-slate-800">커스텀 항목</h3>
        <p className="mt-1 text-sm text-slate-500">
          엑셀 업로드 시 매핑할 항목을 자유롭게 추가/삭제할 수 있습니다.
        </p>
      </div>

      {customFields.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-3.5 py-2.5">항목명</th>
                <th className="border-b border-slate-200 px-3.5 py-2.5">필수 여부</th>
                <th className="border-b border-slate-200 px-3.5 py-2.5">순서</th>
                <th className="border-b border-slate-200 px-3.5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {customFields.map((field, index) => (
                <tr key={field.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-3.5 py-2.5">
                    <input
                      key={`${field.id}-${field.updatedAt}`}
                      type="text"
                      defaultValue={field.label}
                      onBlur={(e) => saveLabel(field, e.target.value)}
                      className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </td>
                  <td className="px-3.5 py-2.5">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={() => toggleRequired(field)}
                        className="h-4 w-4"
                      />
                      필수
                    </label>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label="위로 이동"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === customFields.length - 1}
                        aria-label="아래로 이동"
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(field)}
                      className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      삭제
                    </button>
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
          <span className="font-medium text-slate-700">항목 이름</span>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="예: 배송 메모"
            className="w-56 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={newRequired}
            onChange={(e) => setNewRequired(e.target.checked)}
            className="h-4 w-4"
          />
          필수 항목
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {createMutation.isPending ? "추가 중..." : "+ 항목 추가"}
        </button>
      </form>
      {addError && <p className="text-sm text-red-600">{addError}</p>}
    </section>
  );
}
