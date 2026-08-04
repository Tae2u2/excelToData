import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settlementGroupKeys } from "../settlementGroupKeys";
import type { SettlementGroup, UpdateSettlementGroupInput } from "../types";

interface UpdateSettlementGroupArgs {
  id: number;
  input: UpdateSettlementGroupInput;
}

async function updateSettlementGroup({ id, input }: UpdateSettlementGroupArgs): Promise<SettlementGroup> {
  const res = await fetch(`/api/settlement-groups/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "그룹 수정에 실패했습니다.");
  }
  return res.json();
}

export function useUpdateSettlementGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettlementGroup,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: settlementGroupKeys.list() });
      queryClient.invalidateQueries({ queryKey: settlementGroupKeys.detail(id) });
    },
  });
}
