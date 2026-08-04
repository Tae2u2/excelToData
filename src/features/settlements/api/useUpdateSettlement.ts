import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settlementKeys } from "@/features/settlements/settlementKeys";
import { settlementGroupKeys } from "@/features/settlement-groups/settlementGroupKeys";
import type { Settlement, UpdateSettlementInput } from "@/features/settlements/types";

async function updateSettlement({
  id,
  input,
}: {
  id: number;
  input: UpdateSettlementInput;
}): Promise<Settlement> {
  const res = await fetch(`/api/settlements/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "정산 수정에 실패했습니다.");
  }
  return res.json();
}

export function useUpdateSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettlement,
    onSuccess: (_data, { input }) => {
      queryClient.invalidateQueries({ queryKey: settlementKeys.all });
      if (input.groupId !== undefined) {
        queryClient.invalidateQueries({ queryKey: settlementGroupKeys.all });
      }
    },
  });
}
