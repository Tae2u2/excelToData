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
  rejectedReason: string | null;
  sourceFile: string | null;
  paidAt: string | null;
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
  sourceFile?: string | null;
}

export type UpdateSettlementInput = Partial<CreateSettlementInput> & {
  paybackStatus?: PaybackStatus;
  rejectedReason?: string | null;
  paidAt?: string | null;
};
