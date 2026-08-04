import { useQuery } from "@tanstack/react-query";
import { settlementGroupKeys } from "../settlementGroupKeys";
import type { SettlementGroup } from "../types";

async function fetchSettlementGroups(): Promise<SettlementGroup[]> {
  const res = await fetch("/api/settlement-groups");
  if (!res.ok) throw new Error("그룹 목록을 불러오지 못했습니다.");
  return res.json();
}

export function useSettlementGroupsQuery() {
  return useQuery({
    queryKey: settlementGroupKeys.list(),
    queryFn: fetchSettlementGroups,
  });
}
