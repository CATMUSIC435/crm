export interface FinancialMetrics {
  irr: number;             // Internal Rate of Return (%)
  cagr: number;            // Compound Annual Growth Rate (%)
  rentalYield: number;     // Annual Net Rental Yield (%)
  capitalGain: number;     // Current Valuation - Buy Price (VND)
  capitalGainPercent: number; // % increase
  totalHoldingReturn: number; // Total return over holding period (%)
}

export class FinancialEngine {
  /**
   * Tính toán CAGR: Compound Annual Growth Rate
   * CAGR = (EndVal / StartVal) ^ (1 / years) - 1
   */
  public static calculateCagr(buyPrice: number, currentValuation: number, years: number): number {
    if (buyPrice <= 0 || currentValuation <= 0 || years <= 0) return 0;
    const ratio = currentValuation / buyPrice;
    const cagr = Math.pow(ratio, 1 / years) - 1;
    return Number((cagr * 100).toFixed(2));
  }

  /**
   * Tính toán Rental Yield
   * Yield = (Annual Net Rental / Current Valuation) * 100
   */
  public static calculateRentalYield(annualNetRental: number, currentValuation: number): number {
    if (currentValuation <= 0 || annualNetRental <= 0) return 0;
    return Number(((annualNetRental / currentValuation) * 100).toFixed(2));
  }

  /**
   * Tính toán IRR (Internal Rate of Return) sử dụng phương pháp lặp Newton-Raphson
   * Dòng tiền:
   * Năm 0: -buyPrice
   * Năm 1..n-1: +annualNetRental
   * Năm n: +annualNetRental + currentValuation
   */
  public static calculateIrr(buyPrice: number, currentValuation: number, annualNetRental: number, years: number): number {
    if (buyPrice <= 0 || years <= 0) return 0;

    // Cashflows
    const cashFlows: number[] = [-buyPrice];
    for (let i = 1; i < years; i++) {
      cashFlows.push(annualNetRental);
    }
    cashFlows.push(annualNetRental + currentValuation);

    // Newton-Raphson
    let rate = 0.1; // initial guess 10%
    const maxIterations = 50;
    const tolerance = 1e-5;

    for (let iter = 0; iter < maxIterations; iter++) {
      let npv = 0;
      let dNpv = 0;

      for (let t = 0; t < cashFlows.length; t++) {
        const factor = Math.pow(1 + rate, t);
        npv += cashFlows[t] / factor;
        if (t > 0) {
          dNpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
        }
      }

      if (Math.abs(npv) < tolerance) {
        return Number((rate * 100).toFixed(2));
      }

      if (Math.abs(dNpv) < 1e-9) break;

      const newRate = rate - npv / dNpv;
      if (isNaN(newRate) || !isFinite(newRate)) break;
      rate = newRate;
    }

    // Fallback nếu Newton-Raphson phân kỳ
    const approximateReturn = ((currentValuation + (annualNetRental * years) - buyPrice) / buyPrice) / years;
    return Number((approximateReturn * 100).toFixed(2));
  }

  public static calculateAllMetrics(
    buyPrice: number,
    currentValuation: number,
    annualNetRental: number,
    years: number,
  ): FinancialMetrics {
    const cagr = this.calculateCagr(buyPrice, currentValuation, years);
    const rentalYield = this.calculateRentalYield(annualNetRental, currentValuation);
    const irr = this.calculateIrr(buyPrice, currentValuation, annualNetRental, years);
    const capitalGain = currentValuation - buyPrice;
    const capitalGainPercent = buyPrice > 0 ? Number(((capitalGain / buyPrice) * 100).toFixed(2)) : 0;
    const totalEarnings = capitalGain + (annualNetRental * years);
    const totalHoldingReturn = buyPrice > 0 ? Number(((totalEarnings / buyPrice) * 100).toFixed(2)) : 0;

    return {
      irr,
      cagr,
      rentalYield,
      capitalGain,
      capitalGainPercent,
      totalHoldingReturn,
    };
  }
}
