"use client";

import { TargetFieldsSettings } from "@/features/target-fields/components/TargetFieldsSettings";

export default function TargetFieldsPage() {
  return (
    <div className="mx-auto flex max-w-8xl flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">매핑 항목 설정</h2>
        <p className="mt-1 text-sm text-slate-500">
          엑셀 업로드 시 매핑될 항목을 관리합니다.
        </p>
      </div>
      <TargetFieldsSettings />
    </div>
  );
}
