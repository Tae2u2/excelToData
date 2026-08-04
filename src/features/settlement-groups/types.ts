export interface SettlementGroup {
  id: number;
  name: string;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
  settlementCount: number;
}

export interface SettlementGroupDetail extends SettlementGroup {
  totalPurchaseAmount: number;
  totalPaybackAmount: number;
}

export interface CreateSettlementGroupInput {
  name: string;
  memo?: string | null;
}

export interface UpdateSettlementGroupInput {
  name?: string;
  memo?: string | null;
}
