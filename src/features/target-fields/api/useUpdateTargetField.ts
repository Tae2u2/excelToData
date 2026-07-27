import { useMutation, useQueryClient } from "@tanstack/react-query";
import { targetFieldKeys } from "../targetFieldKeys";
import type { TargetField, UpdateTargetFieldInput } from "../types";

interface UpdateTargetFieldArgs {
  id: number;
  input: UpdateTargetFieldInput;
}

async function updateTargetField({ id, input }: UpdateTargetFieldArgs): Promise<TargetField> {
  const res = await fetch(`/api/target-fields/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "매핑 항목 수정에 실패했습니다.");
  }
  return res.json();
}

export function useUpdateTargetField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTargetField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: targetFieldKeys.list() });
    },
  });
}
