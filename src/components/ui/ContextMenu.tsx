"use client";

export interface RowAction {
  key: string;
  label: string;
  danger?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  actions: RowAction[];
  onSelect: (actionKey: string) => void;
  onClose: () => void;
}

export function ContextMenu({ x, y, actions, onSelect, onClose }: ContextMenuProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => e.preventDefault()} />
      <ul
        style={{ top: y, left: x }}
        className="fixed z-50 min-w-[160px] overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg"
      >
        {actions.map((action) => (
          <li key={action.key}>
            <button
              type="button"
              onClick={() => onSelect(action.key)}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 ${
                action.danger ? "text-red-600" : "text-slate-700"
              }`}
            >
              {action.label}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
