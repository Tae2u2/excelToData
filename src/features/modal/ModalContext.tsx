"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { ModalRoot } from "./ModalRoot";
import type { ModalPayloadMap, ModalType } from "./types";

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: ModalPayloadMap[ModalType] | null;
}

interface ModalContextValue {
  state: ModalState;
  open: <K extends ModalType>(modalType: K, modalProps: ModalPayloadMap[K]) => void;
  close: () => void;
}

const initialState: ModalState = { isOpen: false, modalType: null, modalProps: null };

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>(initialState);

  const open = useCallback(
    <K extends ModalType>(modalType: K, modalProps: ModalPayloadMap[K]) => {
      setState({ isOpen: true, modalType, modalProps });
    },
    []
  );

  const close = useCallback(() => setState(initialState), []);

  return (
    <ModalContext.Provider value={{ state, open, close }}>
      {children}
      <ModalRoot />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
