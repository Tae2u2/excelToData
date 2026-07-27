"use client";

import { useQueryClient } from "@tanstack/react-query";
import { EditableCellTable } from "@/components/table/EditableCellTable/EditableCellTable";
import type { ColumnDef, EditableRow } from "@/components/table/EditableCellTable/types";
import { settlementKeys } from "@/features/settlements/settlementKeys";
import type { Settlement } from "@/features/settlements/types";
import { useTargetFieldsQuery } from "@/features/target-fields/api/useTargetFieldsQuery";
import { runValidation } from "../validation/runValidation";
import type { RawSettlementRow } from "../validation/types";
import { useUploadFlow } from "../uploadContext";

interface DisplayRow extends RawSettlementRow {
  rowNumber: string;
  [key: string]: string;
}

export function UploadConfirmTable() {
  const { state, dispatch } = useUploadFlow();
  const queryClient = useQueryClient();
  const { data: targetFields } = useTargetFieldsQuery();

  const columns: ColumnDef<DisplayRow>[] = [
    { field: "rowNumber", header: "행 번호", editable: false },
    ...(targetFields ?? []).map((f) => ({ field: f.key, header: f.label })),
  ];

  const rows: EditableRow<DisplayRow>[] = state.rows.map((row) => {
    const cellResults = { ...row.cellResults } as EditableRow<DisplayRow>["cellResults"];
    if (row.submitFailureReason && cellResults) {
      cellResults.orderNo = { ok: false, message: row.submitFailureReason };
    }
    return {
      id: row.rowNumber,
      data: { ...row.data, rowNumber: String(row.rowNumber) },
      cellResults,
    };
  });

  const handleCellChange = (rowId: string | number, field: keyof DisplayRow, value: string) => {
    if (field === "rowNumber") return; // display-only, not a submitted field

    const target = state.rows.find((row) => row.rowNumber === rowId);
    if (!target) return;

    const nextData: RawSettlementRow = { ...target.data, [field]: value };

    const cached = queryClient.getQueryData<Settlement[]>(settlementKeys.list()) ?? [];
    const existingOrderKeys = new Set(cached.map((s) => `${s.orderNo}|${s.campaignName}`));
    const { cellResults, rowStatus } = runValidation(nextData, { existingOrderKeys }, targetFields ?? []);

    dispatch({
      type: "UPDATE_ROW",
      rowNumber: target.rowNumber,
      row: { ...target, data: nextData, cellResults, rowStatus, submitFailureReason: undefined },
    });
  };

  return <EditableCellTable<DisplayRow> columns={columns} rows={rows} onCellChange={handleCellChange} />;
}
