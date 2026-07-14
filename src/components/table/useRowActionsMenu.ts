import { useState, type MouseEvent } from "react";

interface MenuState {
  open: boolean;
  variant: "context" | "sheet";
  x?: number;
  y?: number;
}

export function useRowActionsMenu<TRow>(row: TRow, onSelect: (actionKey: string, row: TRow) => void) {
  const [menu, setMenu] = useState<MenuState>({ open: false, variant: "sheet" });

  const openContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setMenu({ open: true, variant: "context", x: e.clientX, y: e.clientY });
  };

  const openSheet = () => {
    setMenu({ open: true, variant: "sheet" });
  };

  const close = () => {
    setMenu((prev) => ({ ...prev, open: false }));
  };

  const select = (actionKey: string) => {
    onSelect(actionKey, row);
    close();
  };

  return { menu, openContextMenu, openSheet, close, select };
}
