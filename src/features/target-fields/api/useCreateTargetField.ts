import { useMutation, useQueryClient } from "@tanstack/react-query";
import { targetFieldKeys } from "../targetFieldKeys";
import type { CreateTargetFieldInput, TargetField } from "../types";

async function createTargetField(input: CreateTargetFieldInput): Promise<TargetField> {
  const res = await fetch("/api/target-fields", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "매핑 항목 추가에 실패했습니다.");
  }
  return res.json();
}

export function useCreateTargetField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTargetField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: targetFieldKeys.list() });
    },
  });
}
