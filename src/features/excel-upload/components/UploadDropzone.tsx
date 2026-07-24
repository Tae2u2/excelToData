"use client";

import { useRef, useState } from "react";
import { readExcelSheet } from "../parseExcelFile";
import { useUploadFlow } from "../uploadContext";

export function UploadDropzone() {
  const { dispatch } = useUploadFlow();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const { headers, rows } = await readExcelSheet(file);
      if (headers.length === 0 || rows.length === 0) {
        setError("엑셀 파일에서 데이터를 찾을 수 없습니다.");
        return;
      }

      dispatch({ type: "RAW_PARSED", fileName: file.name, headers, rows });
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
      <p className="text-xs text-slate-400">엑셀을 올리면 다음 단계에서 열 매핑을 확인합니다.</p>
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
        onClick={() => inputRef.current?.click()}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        파일 선택
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
