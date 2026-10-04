import { LoyaltyVoucherEntity, LoyaltyTransactionEntity } from '../../../domain/voucher.entity';
import { CreateVoucherDto } from '../in/loyalty.use-case';

export const LOYALTY_REPOSITORY = Symbol('LOYALTY_REPOSITORY');

export interface LoyaltyRepositoryPort {
  findVouchers(category?: string): Promise<LoyaltyVoucherEntity[]>;
  findVoucherById(id: string): Promise<LoyaltyVoucherEntity | null>;
  createVoucher(dto: CreateVoucherDto): Promise<LoyaltyVoucherEntity>;
  decrementVoucherStock(id: string): Promise<void>;
  findTransactions(customerId?: string): Promise<LoyaltyTransactionEntity[]>;
  createTransaction(data: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    type: string;
    points: number;
    balanceAfter: number;
    description: string;
    voucherId?: string;
    referenceCode?: string;
  }): Promise<LoyaltyTransactionEntity>;
  getCustomerPointsBalance(customerId: string): Promise<number>;
}
