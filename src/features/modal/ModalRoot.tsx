"use client";

import { Suspense } from "react";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { useModal } from "./ModalContext";
import { MODAL_COMPONENTS } from "./modalRegistry";

export function ModalRoot() {
  const { state, close } = useModal();

  if (!state.isOpen || !state.modalType) return null;

  const Component = MODAL_COMPONENTS[state.modalType];

  return (
    <Modal onClose={close}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        }
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Component {...(state.modalProps as any)} onClose={close} />
      </Suspense>
    </Modal>
  );
}
