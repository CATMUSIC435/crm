import { PaymentTransactionEntity } from './payment.entity';

describe('PaymentTransactionEntity (VietQR IPN Domain Parser)', () => {
  it('nên trích xuất chính xác mã Booking từ nội dung chuyển khoản VietQR', () => {
    const tx = new PaymentTransactionEntity(
      'uuid-001',
      'FT2609012399',
      100_000_000,
      'NGUYEN VAN A CHUYEN TIEN COC CAN HO BK-1001 VIETQR NAPAS',
      'VIETQR_NAPAS247',
      'SUCCESS',
    );

    expect(tx.isBookingPayment()).toBe(true);
    expect(tx.bookingCode).toBe('BK-1001');
    expect(tx.isContractPayment()).toBe(false);
  });

  it('nên trích xuất chính xác mã Hợp đồng từ nội dung thanh toán đợt', () => {
    const tx = new PaymentTransactionEntity(
      'uuid-002',
      'MB88910239',
      500_000_000,
      'THANH TOAN DOT 2 HOP DONG MUA BAN HD-8801 THE GLOBAL CITY',
      'VIETQR_NAPAS247',
      'SUCCESS',
    );

    expect(tx.isContractPayment()).toBe(true);
    expect(tx.contractCode).toBe('HD-8801');
    expect(tx.isBookingPayment()).toBe(false);
  });

  it('nên xử lý nội dung không chứa mã định danh hợp lệ', () => {
    const tx = new PaymentTransactionEntity(
      'uuid-003',
      'MB999999',
      50_000_000,
      'CHUYEN TIEN MUA NHA KHONG RO NOI DUNG',
      'VIETQR_NAPAS247',
      'SUCCESS',
    );

    expect(tx.isBookingPayment()).toBe(false);
    expect(tx.isContractPayment()).toBe(false);
    expect(tx.bookingCode).toBeFalsy();
    expect(tx.contractCode).toBeFalsy();
  });
});
