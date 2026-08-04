import { useQuery } from "@tanstack/react-query";
import { settlementKeys } from "@/features/settlements/settlementKeys";
import type {
  PaginatedSettlements,
  Settlement,
} from "@/features/settlements/types";

interface UseSettlementsQueryParams {
  page: number;
  pageSize: number;
  groupId?: number;
}

async function fetchSettlements({
  page,
  pageSize,
  groupId,
}: UseSettlementsQueryParams): Promise<PaginatedSettlements> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (groupId !== undefined) params.set("groupId", String(groupId));
  const res = await fetch(`/api/settlements?${params.toString()}`);
  if (!res.ok) throw new Error("정산 목록을 불러오지 못했습니다.");
  return res.json();
}

export function useSettlementsQuery({
  page,
  pageSize,
  groupId,
}: UseSettlementsQueryParams) {
  return useQuery({
    queryKey: settlementKeys.list({ page, pageSize, groupId }),
    queryFn: () => fetchSettlements({ page, pageSize, groupId }),
    placeholderData: (previousData) => previousData,
  });
}

// 전체 목록이 필요한 곳(중복 검증, 연관 데이터 조회)에서 사용.
const ALL_SETTLEMENTS_PAGE_SIZE = 100000;

async function fetchAllSettlements(): Promise<Settlement[]> {
  const res = await fetch(
    `/api/settlements?page=1&pageSize=${ALL_SETTLEMENTS_PAGE_SIZE}`,
  );
  if (!res.ok) throw new Error("정산 목록을 불러오지 못했습니다.");
  const body: PaginatedSettlements = await res.json();
  return body.data;
}

export function useAllSettlementsQuery() {
  return useQuery({
    queryKey: settlementKeys.allList(),
    queryFn: fetchAllSettlements,
  });
}
