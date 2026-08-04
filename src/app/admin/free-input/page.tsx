"use client";

import { ExcelGrid } from "@/components/table/ExcelGrid/ExcelGrid";

export default function FreeInputPage() {
  return (
    <div className="mx-auto flex max-w-8xl flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">자유 입력</h2>
        <p className="mt-1 text-sm text-slate-500">
          정해진 항목 없이 자유롭게 입력하는 표입니다. 마지막 행/열에서 방향키를
          누르면 행과 열이 늘어납니다.
        </p>
      </div>
      <ExcelGrid initialRowCount={1} />
    </div>
  );
}
