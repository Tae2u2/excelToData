import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { ModalPayloadMap, ModalType } from "./types";

type ModalComponentProps<K extends ModalType> = ModalPayloadMap[K] & { onClose: () => void };

export const MODAL_COMPONENTS: {
  [K in ModalType]: LazyExoticComponent<ComponentType<ModalComponentProps<K>>>;
} = {
  "settlement/register": lazy(() => import("@/features/settlements/modals/RegisterSettlementModal")),
  "settlement/edit": lazy(() => import("@/features/settlements/modals/EditSettlementModal")),
  "settlement/delete": lazy(() => import("@/features/settlements/modals/DeleteSettlementModal")),
  "settlement/detail": lazy(() => import("@/features/settlements/modals/SettlementDetailModal")),
  "settlement/related-data": lazy(() => import("@/features/settlements/modals/RelatedDataLookupModal")),
  "settlement/bulk-detail": lazy(() => import("@/features/settlements/modals/BulkDetailModal")),
  "settlement/bulk-delete": lazy(() => import("@/features/settlements/modals/BulkDeleteModal")),
  "settlement/bulk-mark-paid": lazy(() => import("@/features/settlements/modals/BulkMarkPaidModal")),
  "settlement/assign-group": lazy(() => import("@/features/settlements/modals/AssignGroupModal")),
  "settlement/remove-from-group": lazy(() => import("@/features/settlements/modals/RemoveFromGroupModal")),
};
