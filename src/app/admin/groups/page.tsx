"use client";

import { SettlementGroupsSettings } from "@/features/settlement-groups/components/SettlementGroupsSettings";

export default function SettlementGroupsPage() {
  return (
    <div className="mx-auto flex max-w-8xl flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">그룹 관리</h2>
        <p className="mt-1 text-sm text-slate-500">
          같은 소속사·회사 등으로 묶어 정산을 함께 관리할 그룹을 만들고
          관리합니다.
        </p>
      </div>
      <SettlementGroupsSettings />
    </div>
  );
}
