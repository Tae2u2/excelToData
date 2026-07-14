import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settlementKeys } from "@/features/settlements/settlementKeys";
import type { CreateSettlementInput, Settlement } from "@/features/settlements/types";

async function createSettlement(input: CreateSettlementInput): Promise<Settlement> {
  const res = await fetch("/api/settlements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "정산 등록에 실패했습니다.");
  }
  return res.json();
}

export function useCreateSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSettlement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settlementKeys.list() });
    },
  });
}
