import { useQuery } from "@tanstack/react-query";
import { settlementKeys } from "@/features/settlements/settlementKeys";
import type { Settlement } from "@/features/settlements/types";

async function fetchSettlements(): Promise<Settlement[]> {
  const res = await fetch("/api/settlements");
  if (!res.ok) throw new Error("정산 목록을 불러오지 못했습니다.");
  return res.json();
}

export function useSettlementsQuery() {
  return useQuery({
    queryKey: settlementKeys.list(),
    queryFn: fetchSettlements,
  });
}
