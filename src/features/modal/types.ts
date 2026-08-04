import type { Settlement, CreateSettlementInput, UpdateSettlementInput } from "@/features/settlements/types";

export interface ModalPayloadMap {
  "settlement/register": {
    onSubmit: (input: CreateSettlementInput) => Promise<unknown>;
  };
  "settlement/edit": {
    row: Settlement;
    onSubmit: (input: UpdateSettlementInput) => Promise<unknown>;
  };
  "settlement/delete": {
    row: Settlement;
    onConfirm: () => Promise<unknown>;
  };
  "settlement/detail": {
    row: Settlement;
  };
  "settlement/related-data": {
    row: Settlement;
  };
  "settlement/bulk-detail": {
    rows: Settlement[];
  };
  "settlement/bulk-delete": {
    rows: Settlement[];
    onConfirm: () => Promise<unknown>;
  };
  "settlement/bulk-mark-paid": {
    rows: Settlement[];
    onConfirm: () => Promise<unknown>;
  };
  "settlement/assign-group": {
    rows: Settlement[];
    onSubmit: (groupId: number) => Promise<unknown>;
  };
  "settlement/remove-from-group": {
    rows: Settlement[];
    onConfirm: () => Promise<unknown>;
  };
}

export type ModalType = keyof ModalPayloadMap;
