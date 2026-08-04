"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";

export interface RowAction {
  key: string;
  label: string;
  danger?: boolean;
  icon?: LucideIcon;
  color?: string; // Hex color applied to the icon only, e.g. "#d97706"
}

interface ContextMenuProps {
  x: number;
  y: number;
  actions: RowAction[];
  onSelect: (actionKey: string) => void;
  onClose: () => void;
}

export function ContextMenu({
  x,
  y,
  actions,
  onSelect,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({ top: y, left: x });

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const { height, width } = menu.getBoundingClientRect();
    const top = y + height > window.innerHeight ? y - height : y;
    const left = x + width > window.innerWidth ? x - width : x;
    setPosition({ top: Math.max(top, 0), left: Math.max(left, 0) });
  }, [x, y]);

  useEffect(() => {
    window.addEventListener("scroll", onClose, true);
    return () => window.removeEventListener("scroll", onClose, true);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        onContextMenu={(e) => e.preventDefault()}
      />
      <ul
        ref={menuRef}
        style={{ top: position.top, left: position.left }}
        onMouseLeave={onClose}
        className="fixed z-50 overflow-hidden border border-slate-200 bg-white py-1 shadow-lg"
      >
        {actions.map((action) => (
          <li key={action.key}>
            <button
              type="button"
              onClick={() => onSelect(action.key)}
              className={`block w-full px-5 py-2 text-left text hover:bg-slate-100 cursor-pointer border-b border-b-slate-300 ${
                action.danger ? "text-red-400" : "text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {action.icon && (
                  <action.icon
                    size={16}
                    strokeWidth={0.8}
                    color={action.danger ? undefined : action.color}
                  />
                )}
                {action.label}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
