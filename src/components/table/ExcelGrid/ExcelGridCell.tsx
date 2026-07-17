"use client";

import { useState, type KeyboardEvent } from "react";

interface ExcelGridCellProps {
  id: string;
  value: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  colCount: number;
  rowCount: number;
  onCommit: (id: string, value: string) => void;
  onGrowCols: () => void;
  onGrowRows: () => void;
}

export function ExcelGridCell({
  id,
  value,
  row,
  col,
  rowSpan,
  colSpan,
  colCount,
  rowCount,
  onCommit,
  onGrowCols,
  onGrowRows,
}: ExcelGridCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    onCommit(id, draft);
    setEditing(false);
  };

  const focusCell = (targetRow: number, targetCol: number) => {
    document
      .querySelector<HTMLTableCellElement>(`td[data-row="${targetRow}"][data-col="${targetCol}"]`)
      ?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTableCellElement>) => {
    if (e.key === "F2") {
      e.preventDefault();
      setDraft(value);
      setEditing(true);
      return;
    }

    if (e.key === "Enter") {
      if (editing) {
        e.preventDefault();
        commit();
      }
      return;
    }

    const move: { row: number; col: number } = { row: 0, col: 0 };
    switch (e.key) {
      case "ArrowUp":
        move.row = -1;
        break;
      case "ArrowDown":
        if (row === rowCount - 1) {
          e.preventDefault();
          onGrowRows();
          return;
        }
        move.row = 1;
        break;
      case "ArrowLeft":
        move.col = -1;
        break;
      case "ArrowRight":
        if (col === colCount - 1) {
          e.preventDefault();
          onGrowCols();
          return;
        }
        move.col = 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    focusCell(row + move.row, col + move.col);
  };

  return (
    <td
      data-row={row}
      data-col={col}
      rowSpan={rowSpan}
      colSpan={colSpan}
      tabIndex={0}
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setDraft(value);
        setEditing(true);
      }}
      onKeyDown={handleKeyDown}
      className="h-8 min-w-[90px] border border-slate-200 align-top text-sm outline-none focus:ring-1 focus:ring-blue-400"
    >
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          className="w-full max-w-[100px] rounded-none border-none px-1 py-[1px] outline-none"
        />
      ) : (
        <span className="inline-block h-full w-[100px] overflow-hidden px-1 py-[1px]">{value}</span>
      )}
    </td>
  );
}
