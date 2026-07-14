"use client";

import Link from "next/link";

interface UploadResultPanelProps {
  createdCount: number;
  onUploadAnother: () => void;
}

export function UploadResultPanel({ createdCount, onUploadAnother }: UploadResultPanelProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
      <p className="text-lg font-semibold text-emerald-700">{createdCount}건의 정산이 등록되었습니다.</p>
      <div className="flex gap-2">
        <Link
          href="/admin/settlements"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          목록으로 이동
        </Link>
        <button
          type="button"
          onClick={onUploadAnother}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          다른 파일 업로드
        </button>
      </div>
    </div>
  );
}
