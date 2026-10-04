export class PaymentTransactionEntity {
  constructor(
    public readonly id: string,
    public readonly transactionRef: string,
    public readonly amount: number,
    public readonly transferContent: string,
    public readonly gateway: string = 'VIETQR_NAPAS247',
    public status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'RECONCILED' = 'SUCCESS',
    public readonly bankName?: string,
    public readonly accountNumber?: string,
    public bookingCode?: string,
    public contractCode?: string,
  ) {
    this.extractCodes();
  }

  /**
   * Tự động bóc tách mã phiếu booking hoặc mã hợp đồng từ cú pháp chuyển khoản
   * Ví dụ: "NOVA BK1001 NGUYEN VAN TUAN COC CAN" -> bookingCode = "BK-1001"
   */
  private extractCodes(): void {
    const cleanContent = this.transferContent.replace(/[\s\-_]/g, '').toUpperCase();
    
    // Tìm mã booking dạng BK1001 hoặc BK-1001
    const bkMatch = cleanContent.match(/BK(\d{4})/);
    if (bkMatch) {
      this.bookingCode = `BK-${bkMatch[1]}`;
    }

    // Tìm mã hợp đồng dạng HD8801 hoặc HD-8801
    const hdMatch = cleanContent.match(/HD(\d{4})/);
    if (hdMatch) {
      this.contractCode = `HD-${hdMatch[1]}`;
    }
  }

  public isBookingPayment(): boolean {
    return !!this.bookingCode;
  }

  public isContractPayment(): boolean {
    return !!this.contractCode;
  }
}
