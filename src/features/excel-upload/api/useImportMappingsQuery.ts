import { useQuery } from "@tanstack/react-query";
import { importMappingKeys } from "./importMappingKeys";
import type { ImportMappingProfile } from "../types";

async function fetchImportMappings(): Promise<ImportMappingProfile[]> {
  const res = await fetch("/api/import-mappings");
  if (!res.ok) throw new Error("매핑 프로필 목록을 불러오지 못했습니다.");
  return res.json();
}

export function useImportMappingsQuery() {
  return useQuery({
    queryKey: importMappingKeys.list(),
    queryFn: fetchImportMappings,
  });
}
