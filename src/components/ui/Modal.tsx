"use client";

import { useEffect, type ReactNode } from "react";

export function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl md:max-h-[85vh] md:w-full md:max-w-lg md:rounded-2xl"
      >
        {children}
      </div>
    </div>
  );
}
