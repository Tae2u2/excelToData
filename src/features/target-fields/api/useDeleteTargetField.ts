import { useMutation, useQueryClient } from "@tanstack/react-query";
import { targetFieldKeys } from "../targetFieldKeys";

async function deleteTargetField(id: number): Promise<void> {
  const res = await fetch(`/api/target-fields/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "매핑 항목 삭제에 실패했습니다.");
  }
}

export function useDeleteTargetField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTargetField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: targetFieldKeys.list() });
    },
  });
}
