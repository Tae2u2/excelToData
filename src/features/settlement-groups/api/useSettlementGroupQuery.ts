import { useQuery } from "@tanstack/react-query";
import { settlementGroupKeys } from "../settlementGroupKeys";
import type { SettlementGroupDetail } from "../types";

async function fetchSettlementGroup(id: number): Promise<SettlementGroupDetail> {
  const res = await fetch(`/api/settlement-groups/${id}`);
  if (!res.ok) throw new Error("그룹 정보를 불러오지 못했습니다.");
  return res.json();
}

export function useSettlementGroupQuery(id: number) {
  return useQuery({
    queryKey: settlementGroupKeys.detail(id),
    queryFn: () => fetchSettlementGroup(id),
  });
}
