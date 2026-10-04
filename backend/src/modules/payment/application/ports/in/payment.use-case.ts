import { VietQrIpnDto } from '../../dtos/vietqr-ipn.dto';

export const PAYMENT_USE_CASE = Symbol('PAYMENT_USE_CASE');

export interface PaymentUseCase {
  processVietQrIpn(dto: VietQrIpnDto): Promise<{ success: boolean; message: string; data?: any }>;
  getTransactions(limit?: number): Promise<any[]>;
}
