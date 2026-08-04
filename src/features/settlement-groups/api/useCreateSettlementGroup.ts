import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settlementGroupKeys } from "../settlementGroupKeys";
import type { CreateSettlementGroupInput, SettlementGroup } from "../types";

async function createSettlementGroup(input: CreateSettlementGroupInput): Promise<SettlementGroup> {
  const res = await fetch("/api/settlement-groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "그룹 생성에 실패했습니다.");
  }
  return res.json();
}

export function useCreateSettlementGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSettlementGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settlementGroupKeys.list() });
    },
  });
}
