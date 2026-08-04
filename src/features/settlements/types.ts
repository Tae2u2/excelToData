export type PaybackStatus = "PENDING" | "PAID" | "REJECTED";

export interface Settlement {
  id: number;
  orderNo: string;
  campaignName: string;
  buyerName: string;
  buyerPhone: string | null;
  purchaseAmount: number;
  paybackAmount: number;
  paybackStatus: PaybackStatus;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  memo: string | null;
  extraFields: Record<string, string> | null;
  rejectedReason: string | null;
  sourceFile: string | null;
  paidAt: string | null;
  groupId: number | null;
  group: { id: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSettlementInput {
  orderNo: string;
  campaignName: string;
  buyerName: string;
  buyerPhone?: string | null;
  purchaseAmount: number;
  paybackAmount: number;
  paybackStatus?: PaybackStatus;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  memo?: string | null;
  extraFields?: Record<string, string> | null;
  sourceFile?: string | null;
  groupId?: number | null;
}

export type UpdateSettlementInput = Partial<CreateSettlementInput> & {
  paybackStatus?: PaybackStatus;
  rejectedReason?: string | null;
  paidAt?: string | null;
};

export interface PaginatedSettlements {
  data: Settlement[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
