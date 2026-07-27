"use client";

import { useRef, useState, type KeyboardEvent } from "react";

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
  const cellRef = useRef<HTMLTableCellElement>(null);

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
        // Committing unmounts the input, which drops focus entirely —
        // reclaim it on the cell itself so arrow-key navigation keeps working.
        cellRef.current?.focus();
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
          // The new row's cell doesn't exist yet — wait for it to render.
          setTimeout(() => focusCell(row + 1, col), 0);
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
          setTimeout(() => focusCell(row, col + 1), 0);
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
      ref={cellRef}
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
      className="h-8 min-w-[90px] border border-slate-200 align-top text-sm outline outline-2 -outline-offset-2 outline-transparent focus-within:outline-green-300"
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
