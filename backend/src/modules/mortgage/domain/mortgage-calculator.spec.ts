import { MortgageCalculatorEngine } from './mortgage-calculator';

describe('MortgageCalculatorEngine', () => {
  const propertyValue = 5_000_000_000; // 5 tỷ VNĐ
  const loanPercent = 70; // Vay 70% = 3.5 tỷ VNĐ
  const loanTermYears = 20; // 240 tháng
  const preferentialRate = 6.5; // 6.5%/năm
  const preferentialMonths = 12; // 12 tháng đầu ưu đãi
  const floatingRate = 9.8; // 9.8%/năm sau ưu đãi
  const monthlyIncome = 80_000_000; // Thu nhập 80 triệu/tháng

  describe('Phương thức Dư nợ giảm dần (reducing)', () => {
    it('phải tính đúng số tiền vay và số kỳ thanh toán', () => {
      const result = MortgageCalculatorEngine.calculate(
        propertyValue,
        loanPercent,
        loanTermYears,
        preferentialRate,
        preferentialMonths,
        floatingRate,
        'reducing',
        false,
        0,
        monthlyIncome,
      );

      expect(result.loanAmount).toBe(3_500_000_000);
      expect(result.schedule.length).toBe(240);
    });

    it('kỳ đầu tiên phải tính đúng lãi suất ưu đãi và tiền gốc', () => {
      const result = MortgageCalculatorEngine.calculate(
        propertyValue,
        loanPercent,
        loanTermYears,
        preferentialRate,
        preferentialMonths,
        floatingRate,
        'reducing',
        false,
        0,
        monthlyIncome,
      );

      const period1 = result.schedule[0];
      const expectedPrincipal = Math.round(3_500_000_000 / 240); // 14,583,333
      const expectedInterest = Math.round((3_500_000_000 * 0.065) / 12); // ~18,958,333

      expect(period1.period).toBe(1);
      expect(period1.rateApplied).toBe(preferentialRate);
      expect(period1.principal).toBe(expectedPrincipal);
      expect(period1.interest).toBe(expectedInterest);
      expect(period1.totalPayment).toBe(period1.principal + period1.interest);
      expect(result.monthlyPaymentFirst).toBe(period1.totalPayment);
    });

    it('sau thời gian ưu đãi (tháng 13), lãi suất phải chuyển sang floatingRate', () => {
      const result = MortgageCalculatorEngine.calculate(
        propertyValue,
        loanPercent,
        loanTermYears,
        preferentialRate,
        preferentialMonths,
        floatingRate,
        'reducing',
        false,
        0,
        monthlyIncome,
      );

      const period12 = result.schedule[11];
      const period13 = result.schedule[12];

      expect(period12.rateApplied).toBe(preferentialRate);
      expect(period13.rateApplied).toBe(floatingRate);
    });

    it('kỳ cuối cùng (240) phải tất toán dứt điểm dư nợ về 0', () => {
      const result = MortgageCalculatorEngine.calculate(
        propertyValue,
        loanPercent,
        loanTermYears,
        preferentialRate,
        preferentialMonths,
        floatingRate,
        'reducing',
        false,
        0,
        monthlyIncome,
      );

      const lastPeriod = result.schedule[result.schedule.length - 1];
      expect(lastPeriod.period).toBe(240);
      expect(lastPeriod.endingBalance).toBe(0);
    });

    it('tính đúng tỷ lệ DTI (Debt-to-Income)', () => {
      const result = MortgageCalculatorEngine.calculate(
        propertyValue,
        loanPercent,
        loanTermYears,
        preferentialRate,
        preferentialMonths,
        floatingRate,
        'reducing',
        false,
        0,
        monthlyIncome,
      );

      const expectedDti = Number(((result.monthlyPaymentFirst / monthlyIncome) * 100).toFixed(1));
      expect(result.dtiRatio).toBe(expectedDti);
      expect(result.dtiRatio).toBeGreaterThan(0);
      expect(result.dtiRatio).toBeLessThan(100);
    });
  });

  describe('Ân hạn nợ gốc (Grace Period)', () => {
    it('trong thời gian ân hạn, tiền gốc phải bằng 0 và chỉ thanh toán lãi', () => {
      const graceMonths = 24;
      const result = MortgageCalculatorEngine.calculate(
        propertyValue,
        loanPercent,
        loanTermYears,
        preferentialRate,
        preferentialMonths,
        floatingRate,
        'reducing',
        true,
        graceMonths,
        monthlyIncome,
      );

      for (let i = 0; i < graceMonths; i++) {
        expect(result.schedule[i].principal).toBe(0);
        expect(result.schedule[i].totalPayment).toBe(result.schedule[i].interest);
        expect(result.schedule[i].endingBalance).toBe(3_500_000_000);
      }

      // Kỳ sau ân hạn bắt đầu trả gốc
      expect(result.schedule[graceMonths].principal).toBeGreaterThan(0);
    });
  });

  describe('Phương thức Niên kim cố định (linear / annuity)', () => {
    it('tổng tiền thanh toán mỗi tháng sau ân hạn phải tương đối ổn định', () => {
      const result = MortgageCalculatorEngine.calculate(
        propertyValue,
        loanPercent,
        loanTermYears,
        floatingRate, // Sử dụng lãi suất cố định để kiểm tra annuity
        0,
        floatingRate,
        'linear',
        false,
        0,
        monthlyIncome,
      );

      const p1 = result.schedule[0].totalPayment;
      const p2 = result.schedule[1].totalPayment;
      const p50 = result.schedule[49].totalPayment;

      // Sai số trong giới hạn 1000 đồng làm tròn
      expect(Math.abs(p1 - p2)).toBeLessThan(1000);
      expect(Math.abs(p1 - p50)).toBeLessThan(1000);
      expect(result.schedule[result.schedule.length - 1].endingBalance).toBe(0);
    });
  });
});
