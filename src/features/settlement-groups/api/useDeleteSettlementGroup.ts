import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settlementGroupKeys } from "../settlementGroupKeys";
import { settlementKeys } from "@/features/settlements/settlementKeys";

async function deleteSettlementGroup(id: number): Promise<void> {
  const res = await fetch(`/api/settlement-groups/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "그룹 삭제에 실패했습니다.");
  }
}

export function useDeleteSettlementGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSettlementGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settlementGroupKeys.list() });
      // 그룹이 삭제되면 소속 정산의 groupId가 null로 바뀌므로 정산 목록도 갱신
      queryClient.invalidateQueries({ queryKey: settlementKeys.all });
    },
  });
}
