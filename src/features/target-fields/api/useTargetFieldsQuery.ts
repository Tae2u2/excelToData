import { useQuery } from "@tanstack/react-query";
import { targetFieldKeys } from "../targetFieldKeys";
import type { TargetField } from "../types";

async function fetchTargetFields(): Promise<TargetField[]> {
  const res = await fetch("/api/target-fields");
  if (!res.ok) throw new Error("매핑 항목 목록을 불러오지 못했습니다.");
  return res.json();
}

export function useTargetFieldsQuery() {
  return useQuery({
    queryKey: targetFieldKeys.list(),
    queryFn: fetchTargetFields,
  });
}
