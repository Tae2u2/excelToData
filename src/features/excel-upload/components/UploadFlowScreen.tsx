"use client";

import { useState } from "react";
import { useUploadFlow } from "../uploadContext";
import { useSubmitBulkSettlements, BulkSubmitError, type BulkSubmitRow } from "../useSubmitBulkSettlements";
import { toCreateSettlementInput } from "../toCreateSettlementInput";
import { UploadDropzone } from "./UploadDropzone";
import { UploadMappingStep } from "./UploadMappingStep";
import { UploadConfirmTable } from "./UploadConfirmTable";
import { UploadSummaryBar } from "./UploadSummaryBar";
import { UploadResultPanel } from "./UploadResultPanel";

export function UploadFlowScreen() {
  const { state, dispatch } = useUploadFlow();
  const submitMutation = useSubmitBulkSettlements();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validCount = state.rows.filter((row) => row.rowStatus === "valid").length;
  const invalidCount = state.rows.length - validCount;

  const handleSubmit = async () => {
    setSubmitError(null);
    dispatch({ type: "SUBMIT_START" });

    const rowsToSubmit: BulkSubmitRow[] = state.rows
      .filter((row) => row.rowStatus === "valid")
      .map((row) => ({
        rowNumber: row.rowNumber,
        data: toCreateSettlementInput(row.data, state.fileName ?? ""),
      }));

    try {
      const { createdCount } = await submitMutation.mutateAsync(rowsToSubmit);
      dispatch({ type: "SUBMIT_SUCCESS", createdCount });
    } catch (err) {
      if (err instanceof BulkSubmitError) {
        dispatch({ type: "SUBMIT_FAILURE", failures: err.failures });
      } else {
        setSubmitError(err instanceof Error ? err.message : "제출 중 오류가 발생했습니다.");
        dispatch({ type: "SUBMIT_FAILURE", failures: [] });
      }
    }
  };

  const handleReset = () => dispatch({ type: "RESET" });

  if (state.stage === "done") {
    return <UploadResultPanel createdCount={state.createdCount ?? 0} onUploadAnother={handleReset} />;
  }

  if (state.stage === "idle") {
    return <UploadDropzone />;
  }

  if (state.stage === "mapping") {
    return <UploadMappingStep />;
  }

  return (
    <div className="flex flex-col gap-4">
      {state.fileName && <p className="text-sm text-slate-500">파일: {state.fileName}</p>}
      <UploadSummaryBar
        totalCount={state.rows.length}
        validCount={validCount}
        invalidCount={invalidCount}
        submitting={state.stage === "submitting"}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <UploadConfirmTable />
    </div>
  );
}
