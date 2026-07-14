"use client";

interface UploadSummaryBarProps {
  totalCount: number;
  validCount: number;
  invalidCount: number;
  submitting: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

export function UploadSummaryBar({
  totalCount,
  validCount,
  invalidCount,
  submitting,
  onSubmit,
  onReset,
}: UploadSummaryBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="flex gap-4 text-sm">
        <span className="text-slate-600">총 {totalCount}행</span>
        <span className="text-emerald-600">유효 {validCount}행</span>
        <span className="text-red-600">오류 {invalidCount}행</span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || validCount === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "제출 중..." : `유효한 ${validCount}행 제출`}
        </button>
      </div>
    </div>
  );
}
