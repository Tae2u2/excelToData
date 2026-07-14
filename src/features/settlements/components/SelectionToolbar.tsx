"use client";

import { useSelection } from "@/features/settlements/selection/SelectionContext";
import type { RowAction } from "@/components/ui/ContextMenu";

export interface ToolbarAction extends RowAction {
  requiresExactlyOne?: boolean;
}

interface SelectionToolbarProps {
  actions: ToolbarAction[];
  onAction: (actionKey: string) => void;
}

export function SelectionToolbar({ actions, onAction }: SelectionToolbarProps) {
  const { selectedRows, clear } = useSelection();
  const count = selectedRows.length;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <span className="mr-2 text-sm text-slate-500">
        {count > 0 ? `${count}개 선택됨` : "행을 선택해 일괄 처리할 수 있습니다"}
      </span>

      {actions.map((action) => {
        const disabled = count === 0 || (action.requiresExactlyOne && count !== 1);
        return (
          <button
            key={action.key}
            type="button"
            disabled={disabled}
            onClick={() => onAction(action.key)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
              action.danger
                ? "border-red-200 text-red-600 hover:bg-red-50"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {action.label}
          </button>
        );
      })}

      {count > 0 && (
        <button
          type="button"
          onClick={clear}
          className="ml-auto text-sm text-slate-400 hover:text-slate-600"
        >
          선택 해제
        </button>
      )}
    </div>
  );
}
