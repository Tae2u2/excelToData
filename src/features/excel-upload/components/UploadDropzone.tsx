"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { parseExcelFile, EXCEL_TEMPLATE_HEADERS } from "../parseExcelFile";
import { runValidation } from "../validation/runValidation";
import { settlementKeys } from "@/features/settlements/settlementKeys";
import { useSettlementsQuery } from "@/features/settlements/api/useSettlementsQuery";
import type { Settlement } from "@/features/settlements/types";
import { useUploadFlow, type AnnotatedRow } from "../uploadContext";

export function UploadDropzone() {
  const { dispatch } = useUploadFlow();
  const queryClient = useQueryClient();
  // Calling the same hook/queryKey as the list page guarantees the cache used for the
  // duplicate-diff rule below is actually populated, without a bespoke API call.
  const { isLoading: isCacheLoading } = useSettlementsQuery();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const parsed = await parseExcelFile(file);
      if (parsed.length === 0) {
        setError("엑셀 파일에서 데이터를 찾을 수 없습니다.");
        return;
      }

      const cached = queryClient.getQueryData<Settlement[]>(settlementKeys.list()) ?? [];
      const existingOrderKeys = new Set(cached.map((s) => `${s.orderNo}|${s.campaignName}`));

      const rows: AnnotatedRow[] = parsed.map(({ rowNumber, data }) => {
        const { cellResults, rowStatus } = runValidation(data, { existingOrderKeys });
        return { rowNumber, data, cellResults, rowStatus };
      });

      dispatch({ type: "PARSED", fileName: file.name, rows });
    } catch (err) {
      setError(err instanceof Error ? err.message : "엑셀 파일을 읽는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={`flex flex-col items-center gap-3 rounded-lg border-2 border-dashed px-6 py-12 text-center ${
        isDragging ? "border-slate-500 bg-slate-50" : "border-slate-300"
      }`}
    >
      <p className="text-sm text-slate-600">엑셀 파일을 여기로 드래그하거나 아래 버튼으로 선택하세요.</p>
      <p className="text-xs text-slate-400">필수 열: {EXCEL_TEMPLATE_HEADERS.join(", ")}</p>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={isCacheLoading}
        onClick={() => inputRef.current?.click()}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {isCacheLoading ? "기존 데이터 확인 중..." : "파일 선택"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
