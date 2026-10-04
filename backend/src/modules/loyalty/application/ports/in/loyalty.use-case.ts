import { LoyaltyVoucherEntity, LoyaltyTransactionEntity } from '../../../domain/voucher.entity';

export const LOYALTY_USE_CASE = Symbol('LOYALTY_USE_CASE');

export interface CreateVoucherDto {
  title: string;
  points: number;
  iconName?: string;
  color?: string;
  category?: string;
  description?: string;
  expiryDate?: string;
  stock?: number;
  terms?: string;
}

export interface RedeemVoucherDto {
  voucherId: string;
  customerId: string;
}

export interface AwardPointsDto {
  customerId: string;
  points: number;
  description: string;
  referenceCode?: string;
}

export interface LoyaltyMemberProfileDto {
  customerId: string;
  customerName: string;
  customerPhone?: string;
  tier: 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  pointsBalance: number;
  totalPointsEarned: number;
  vouchersCount: number;
}

export interface LoyaltyUseCase {
  getVouchers(category?: string): Promise<LoyaltyVoucherEntity[]>;
  createVoucher(dto: CreateVoucherDto): Promise<LoyaltyVoucherEntity>;
  redeemVoucher(dto: RedeemVoucherDto): Promise<{ success: boolean; transaction: LoyaltyTransactionEntity; voucher: LoyaltyVoucherEntity }>;
  getTransactions(customerId?: string): Promise<LoyaltyTransactionEntity[]>;
  awardPoints(dto: AwardPointsDto): Promise<LoyaltyTransactionEntity>;
  getMemberProfile(customerId: string): Promise<LoyaltyMemberProfileDto>;
}
