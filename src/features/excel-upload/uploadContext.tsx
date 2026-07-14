"use client";

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import type { CellValidationResult, RawSettlementRow } from "./validation/types";
import { useUploadSessionStorage } from "./useUploadSessionStorage";

export interface AnnotatedRow {
  rowNumber: number;
  data: RawSettlementRow;
  cellResults: Partial<Record<keyof RawSettlementRow, CellValidationResult>>;
  rowStatus: "valid" | "invalid";
  submitFailureReason?: string;
}

export type UploadStage = "idle" | "parsed" | "confirming" | "submitting" | "done";

export interface UploadState {
  stage: UploadStage;
  fileName: string | null;
  rows: AnnotatedRow[];
  createdCount: number | null;
}

export type UploadAction =
  | { type: "PARSED"; fileName: string; rows: AnnotatedRow[] }
  | { type: "UPDATE_ROW"; rowNumber: number; row: AnnotatedRow }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS"; createdCount: number }
  | { type: "SUBMIT_FAILURE"; failures: { rowNumber: number; reason: string }[] }
  | { type: "RESET" }
  | { type: "HYDRATE"; state: UploadState };

export const initialUploadState: UploadState = {
  stage: "idle",
  fileName: null,
  rows: [],
  createdCount: null,
};

function reducer(state: UploadState, action: UploadAction): UploadState {
  switch (action.type) {
    case "PARSED":
      return { stage: "confirming", fileName: action.fileName, rows: action.rows, createdCount: null };
    case "UPDATE_ROW":
      return {
        ...state,
        rows: state.rows.map((row) => (row.rowNumber === action.rowNumber ? action.row : row)),
      };
    case "SUBMIT_START":
      return { ...state, stage: "submitting" };
    case "SUBMIT_SUCCESS":
      return { ...state, stage: "done", createdCount: action.createdCount };
    case "SUBMIT_FAILURE": {
      const reasonByRow = new Map(action.failures.map((f) => [f.rowNumber, f.reason]));
      return {
        ...state,
        stage: "confirming",
        rows: state.rows.map((row) =>
          reasonByRow.has(row.rowNumber)
            ? { ...row, rowStatus: "invalid", submitFailureReason: reasonByRow.get(row.rowNumber) }
            : { ...row, submitFailureReason: undefined }
        ),
      };
    }
    case "RESET":
      return initialUploadState;
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

interface UploadContextValue {
  state: UploadState;
  dispatch: Dispatch<UploadAction>;
}

const UploadContext = createContext<UploadContextValue | null>(null);

export function UploadFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialUploadState);
  useUploadSessionStorage(state, dispatch);

  return <UploadContext.Provider value={{ state, dispatch }}>{children}</UploadContext.Provider>;
}

export function useUploadFlow() {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUploadFlow must be used within UploadFlowProvider");
  return ctx;
}
