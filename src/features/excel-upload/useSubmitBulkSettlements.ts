import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settlementKeys } from "@/features/settlements/settlementKeys";
import type { CreateSettlementInput } from "@/features/settlements/types";

export interface BulkSubmitFailure {
  rowNumber: number;
  reason: string;
}

export class BulkSubmitError extends Error {
  failures: BulkSubmitFailure[];

  constructor(failures: BulkSubmitFailure[]) {
    super("일부 행이 제출에 실패했습니다.");
    this.failures = failures;
  }
}

export interface BulkSubmitRow {
  rowNumber: number;
  data: CreateSettlementInput;
}

async function submitBulkSettlements(rows: BulkSubmitRow[]): Promise<{ createdCount: number }> {
  const res = await fetch("/api/settlements/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rows }),
  });
  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.ok) {
    if (Array.isArray(body?.failures)) {
      throw new BulkSubmitError(body.failures);
    }
    throw new Error(body?.message ?? "일괄 제출에 실패했습니다.");
  }

  return { createdCount: body.createdCount };
}

export function useSubmitBulkSettlements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitBulkSettlements,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settlementKeys.list() });
    },
  });
}
