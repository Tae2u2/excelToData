import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importMappingKeys } from "./importMappingKeys";
import type { CreateImportMappingInput, ImportMappingProfile } from "../types";

async function createImportMapping(input: CreateImportMappingInput): Promise<ImportMappingProfile> {
  const res = await fetch("/api/import-mappings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "매핑 프로필 저장에 실패했습니다.");
  }
  return res.json();
}

export function useCreateImportMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createImportMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: importMappingKeys.list() });
    },
  });
}
