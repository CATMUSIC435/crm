export interface LoyaltyVoucherEntity {
  id: string;
  code: string;
  title: string;
  points: number;
  iconName: string;
  color: string;
  category: string;
  description?: string | null;
  expiryDate?: string | null;
  stock: number;
  terms?: string | null;
}

export interface LoyaltyTransactionEntity {
  id: string;
  customerId?: string | null;
  customerName: string;
  customerPhone?: string | null;
  type: 'EARN' | 'REDEEM' | 'ADJUST' | string;
  points: number;
  balanceAfter: number;
  description: string;
  voucherId?: string | null;
  referenceCode?: string | null;
  createdAt: Date;
}
