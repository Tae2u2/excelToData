"use client";

import { useCallback, useReducer } from "react";
import { buildSheetFromData } from "./sheetUtils";
import type { ExcelGridColumn, ExcelSheet } from "./types";

type Action =
  | { type: "UPDATE_CELL"; id: string; value: string }
  | { type: "SET_FROM_DATA"; data: Record<string, unknown>[]; columns: ExcelGridColumn[] };

function reducer(sheet: ExcelSheet, action: Action): ExcelSheet {
  switch (action.type) {
    case "UPDATE_CELL":
      return { ...sheet, [action.id]: { ...sheet[action.id], value: action.value } };
    case "SET_FROM_DATA":
      return buildSheetFromData(action.data, action.columns);
    default:
      return sheet;
  }
}

export function useExcelGridState(initialSheet: ExcelSheet = {}) {
  const [sheet, dispatch] = useReducer(reducer, initialSheet);

  const updateCell = useCallback((id: string, value: string) => {
    dispatch({ type: "UPDATE_CELL", id, value });
  }, []);

  const setSheetFromData = useCallback(
    ({ data, columns }: { data: Record<string, unknown>[]; columns: ExcelGridColumn[] }) => {
      dispatch({ type: "SET_FROM_DATA", data, columns });
    },
    []
  );

  return { sheet, updateCell, setSheetFromData };
}
