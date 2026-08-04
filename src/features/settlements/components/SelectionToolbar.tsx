"use client";

import { useSelection } from "@/features/settlements/selection/SelectionContext";
import type { RowAction } from "@/components/ui/ContextMenu";
import type { LucideIcon } from "lucide-react";

export interface ToolbarAction extends RowAction {
  requiresExactlyOne?: boolean;
  icon?: LucideIcon;
  /** Hex color applied to the icon only, e.g. "#d97706" */
  color?: string;
}

interface SelectionToolbarProps {
  actions: ToolbarAction[];
  onAction: (actionKey: string) => void;
}

export function SelectionToolbar({ actions, onAction }: SelectionToolbarProps) {
  const { selectedRows, clear } = useSelection();
  const count = selectedRows.length;

  return (
    <div className="flex flex-col items-start justify-start gap-2 bg-white w-full">
      <div className="flex flex-wrap w-full">
        {actions.map((action) => {
          const disabled =
            count === 0 || (action.requiresExactlyOne && count !== 1);
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              type="button"
              disabled={disabled}
              onClick={() => onAction(action.key)}
              className={`flex flex-col items-center gap-1.5 border-y border-l last:border-r px-5 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                action.danger
                  ? "border-red-200 text-red-600 hover:bg-red-50"
                  : "border-slate-300 text-gray-800 hover:bg-slate-50"
              }`}
            >
              {Icon && (
                <Icon
                  size={23}
                  strokeWidth={0.6}
                  color={action.danger ? undefined : action.color}
                />
              )}
              {action.label}
            </button>
          );
        })}
      </div>
      <div>
        <span className="mr-2 text-sm text-slate-500">
          {count > 0
            ? `${count}개 선택됨`
            : "행을 선택해 일괄 처리할 수 있습니다"}
        </span>
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
    </div>
  );
}
