"use client";

import { useEffect, useRef, useState } from "react";
import { useUploadFlow } from "../uploadContext";
import { useImportMappingsQuery } from "../api/useImportMappingsQuery";
import { useCreateImportMapping } from "../api/useCreateImportMapping";
import { useTargetFieldsQuery } from "@/features/target-fields/api/useTargetFieldsQuery";
import { useAllSettlementsQuery } from "@/features/settlements/api/useSettlementsQuery";
import { applyMapping } from "../parseExcelFile";
import { runValidation } from "../validation/runValidation";
import {
  applyProfile,
  getDuplicateFieldAssignments,
  getMissingRequiredFields,
  suggestMapping,
  type HeaderFieldMapping,
} from "../fieldMapping";

export function UploadMappingStep() {
  const { state, dispatch } = useUploadFlow();
  const { data: savedProfiles, isLoading: profilesLoading } = useImportMappingsQuery();
  const { data: targetFields, isLoading: targetFieldsLoading } = useTargetFieldsQuery();
  const { data: allSettlements, isLoading: settlementsLoading } = useAllSettlementsQuery();
  const createMapping = useCreateImportMapping();

  const [mapping, setMapping] = useState<HeaderFieldMapping>({});
  const [matchedProfileName, setMatchedProfileName] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [saveAsProfile, setSaveAsProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const initializedForHeaders = useRef<string | null>(null);

  useEffect(() => {
    if (profilesLoading) return;
    const headerKey = state.rawHeaders.join("|");
    if (initializedForHeaders.current === headerKey) return;
    const result = suggestMapping(state.rawHeaders, savedProfiles ?? []);
    setMapping(result.mapping);
    setMatchedProfileName(result.matchedProfileName);
    initializedForHeaders.current = headerKey;
  }, [profilesLoading, savedProfiles, state.rawHeaders]);

  const handleFieldChange = (header: string, value: string) => {
    setMapping((prev) => ({ ...prev, [header]: value === "" ? null : (value as HeaderFieldMapping[string]) }));
    setMatchedProfileName(null);
  };

  const handleProfileSelect = (id: string) => {
    setSelectedProfileId(id);
    if (!id) return;
    const profile = savedProfiles?.find((p) => p.id === Number(id));
    if (!profile) return;
    setMapping(applyProfile(state.rawHeaders, profile));
    setMatchedProfileName(profile.name);
  };

  const missingFields = getMissingRequiredFields(mapping, targetFields ?? []);
  const duplicateFields = getDuplicateFieldAssignments(mapping);
  const canProceed =
    missingFields.length === 0 && duplicateFields.length === 0 && !settlementsLoading && !targetFieldsLoading;

  const handleBack = () => dispatch({ type: "RESET" });

  const handleNext = async () => {
    if (!canProceed || !targetFields) return;
    setSaveError(null);

    if (saveAsProfile) {
      if (!profileName.trim()) {
        setSaveError("저장할 매핑 프로필의 이름을 입력해 주세요.");
        return;
      }
      const mappingToSave: Record<string, string> = {};
      for (const [header, field] of Object.entries(mapping)) {
        if (field) mappingToSave[header] = field;
      }
      try {
        await createMapping.mutateAsync({ name: profileName.trim(), mapping: mappingToSave });
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "매핑 프로필 저장에 실패했습니다.");
        return;
      }
    }

    const existingOrderKeys = new Set(
      (allSettlements ?? []).map((s) => `${s.orderNo}|${s.campaignName}`),
    );

    const fieldKeys = targetFields.map((f) => f.key);
    const parsed = applyMapping(state.rawRows, mapping, fieldKeys);
    const rows = parsed.map(({ rowNumber, data }) => {
      const { cellResults, rowStatus } = runValidation(data, { existingOrderKeys }, targetFields);
      return { rowNumber, data, cellResults, rowStatus };
    });

    dispatch({ type: "PARSED", rows });
  };

  if (profilesLoading || targetFieldsLoading) {
    return <p className="text-sm text-slate-500">매핑 프로필을 불러오는 중...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">열 매핑 확인</h2>
        <p className="mt-1 text-sm text-slate-500">
          {state.fileName}에서 찾은 열을 어떤 항목으로 저장할지 확인해 주세요.
        </p>
      </div>

      {matchedProfileName && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          저장된 매핑 프로필 &apos;{matchedProfileName}&apos;을(를) 자동 적용했습니다.
        </p>
      )}

      {(savedProfiles?.length ?? 0) > 0 && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">다른 저장된 프로필 적용</span>
          <select
            value={selectedProfileId}
            onChange={(e) => handleProfileSelect(e.target.value)}
            className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          >
            <option value="">직접 선택 안 함</option>
            {savedProfiles?.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="border-b border-slate-200 px-3.5 py-2.5">엑셀 열</th>
              <th className="border-b border-slate-200 px-3.5 py-2.5">매핑될 항목</th>
            </tr>
          </thead>
          <tbody>
            {state.rawHeaders.map((header) => (
              <tr key={header} className="border-b border-slate-100 last:border-0">
                <td className="px-3.5 py-2.5 text-slate-700">{header}</td>
                <td className="px-3.5 py-2.5">
                  <select
                    value={mapping[header] ?? ""}
                    onChange={(e) => handleFieldChange(header, e.target.value)}
                    className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="">매핑 안 함</option>
                    {(targetFields ?? []).map((config) => (
                      <option key={config.key} value={config.key}>
                        {config.label}
                        {config.required ? " *" : ""}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {missingFields.length > 0 && (
        <p className="text-sm text-red-600">
          다음 필수 항목이 매핑되지 않았습니다: {missingFields.map((f) => f.label).join(", ")}
        </p>
      )}
      {duplicateFields.length > 0 && (
        <p className="text-sm text-red-600">
          같은 항목에 여러 열이 매핑되어 있습니다:{" "}
          {duplicateFields
            .map(
              (d) =>
                `${(targetFields ?? []).find((f) => f.key === d.field)?.label ?? d.field} (${d.headers.join(", ")})`
            )
            .join(" / ")}
        </p>
      )}

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={saveAsProfile}
          onChange={(e) => setSaveAsProfile(e.target.checked)}
          className="h-4 w-4"
        />
        이 매핑을 이름 붙여 저장해서 다음에 재사용
      </label>
      {saveAsProfile && (
        <input
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          placeholder="예: A업체 정산 양식"
          className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
      )}
      {saveError && <p className="text-sm text-red-600">{saveError}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          뒤로
        </button>
        <button
          type="button"
          disabled={!canProceed || createMapping.isPending}
          onClick={handleNext}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {createMapping.isPending ? "저장 중..." : "다음"}
        </button>
      </div>
    </div>
  );
}
