import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settlementKeys } from "@/features/settlements/settlementKeys";

async function deleteSettlement(id: number): Promise<void> {
  const res = await fetch(`/api/settlements/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "정산 삭제에 실패했습니다.");
  }
}

export function useDeleteSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSettlement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settlementKeys.all });
    },
  });
}
