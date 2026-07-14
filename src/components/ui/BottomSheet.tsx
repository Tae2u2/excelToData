"use client";

import { cn } from "@/lib/cn";
import type { RowAction } from "./ContextMenu";

interface BottomSheetProps {
  isOpen: boolean;
  title?: string;
  actions: RowAction[];
  onSelect: (actionKey: string) => void;
  onClose: () => void;
}

export function BottomSheet({ isOpen, title, actions, onSelect, onClose }: BottomSheetProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} aria-hidden="true" />}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-xl transition-transform duration-200 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {title && (
          <div className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-500">{title}</div>
        )}
        <ul className="p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {actions.map((action) => (
            <li key={action.key}>
              <button
                type="button"
                onClick={() => onSelect(action.key)}
                className={cn(
                  "w-full rounded-md px-3 py-3 text-left text-sm hover:bg-slate-100",
                  action.danger ? "text-red-600" : "text-slate-700"
                )}
              >
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
