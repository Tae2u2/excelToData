import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importMappingKeys } from "./importMappingKeys";

async function deleteImportMapping(id: number): Promise<void> {
  const res = await fetch(`/api/import-mappings/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "매핑 프로필 삭제에 실패했습니다.");
  }
}

export function useDeleteImportMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteImportMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: importMappingKeys.list() });
    },
  });
}
