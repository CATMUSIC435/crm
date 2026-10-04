export interface AmortizationPeriod {
  period: number; // Kỳ thứ 1..360
  monthStr: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
  rateApplied: number;
}

export interface MortgageSimulationEntity {
  id: string;
  customerId?: string | null;
  customerName?: string | null;
  propertyCode?: string | null;
  propertyValue: number;
  loanPercent: number;
  loanAmount: number;
  loanTermYears: number;
  bankId: string;
  bankName: string;
  preferentialRate: number;
  preferentialMonths: number;
  floatingRate: number;
  repaymentMethod: 'reducing' | 'linear';
  enableGracePeriod: boolean;
  graceMonths: number;
  monthlyIncome: number;
  dtiRatio: number;
  monthlyPaymentFirst: number;
  totalInterest: number;
  amortizationSchedule?: AmortizationPeriod[];
  createdAt: Date;
}

export class MortgageCalculatorEngine {
  static calculate(
    propertyValue: number,
    loanPercent: number,
    loanTermYears: number,
    preferentialRate: number, // % per year (e.g. 6.5)
    preferentialMonths: number, // e.g. 12
    floatingRate: number, // % per year (e.g. 9.8)
    repaymentMethod: 'reducing' | 'linear',
    enableGracePeriod: boolean,
    graceMonths: number,
    monthlyIncome: number,
  ): {
    loanAmount: number;
    monthlyPaymentFirst: number;
    totalInterest: number;
    dtiRatio: number;
    schedule: AmortizationPeriod[];
  } {
    const loanAmount = Math.round(propertyValue * (loanPercent / 100));
    const totalPeriods = loanTermYears * 12;
    const schedule: AmortizationPeriod[] = [];

    let currentBalance = loanAmount;
    let totalInterest = 0;
    const effectiveGraceMonths = enableGracePeriod ? graceMonths : 0;
    const remainingPeriodsAfterGrace = totalPeriods - effectiveGraceMonths;

    // Monthly principal for reducing method
    const monthlyPrincipalAfterGrace = remainingPeriodsAfterGrace > 0
      ? Math.round(loanAmount / remainingPeriodsAfterGrace)
      : 0;

    for (let period = 1; period <= totalPeriods; period++) {
      if (currentBalance <= 0) break;

      const rateYear = period <= preferentialMonths ? preferentialRate : floatingRate;
      const rateMonth = rateYear / 100 / 12;

      let principal = 0;
      let interest = Math.round(currentBalance * rateMonth);

      if (period <= effectiveGraceMonths) {
        // Grace period: pay only interest
        principal = 0;
      } else {
        if (repaymentMethod === 'reducing') {
          principal = Math.min(monthlyPrincipalAfterGrace, currentBalance);
        } else {
          // Linear / Annuity equal monthly total
          const n = totalPeriods - period + 1;
          const monthlyPayment = (currentBalance * (rateMonth * Math.pow(1 + rateMonth, n))) / (Math.pow(1 + rateMonth, n) - 1);
          principal = Math.min(Math.round(monthlyPayment - interest), currentBalance);
        }
      }

      // Final payment adjustment
      if (period === totalPeriods || currentBalance - principal < 1000) {
        principal = currentBalance;
      }

      const totalPayment = principal + interest;
      const endingBalance = Math.max(0, currentBalance - principal);
      totalInterest += interest;

      schedule.push({
        period,
        monthStr: `Tháng ${period}`,
        beginningBalance: currentBalance,
        principal,
        interest,
        totalPayment,
        endingBalance,
        rateApplied: rateYear,
      });

      currentBalance = endingBalance;
    }

    const monthlyPaymentFirst = schedule.length > 0 ? schedule[0].totalPayment : 0;
    const dtiRatio = monthlyIncome > 0 ? Number(((monthlyPaymentFirst / monthlyIncome) * 100).toFixed(1)) : 0;

    return {
      loanAmount,
      monthlyPaymentFirst,
      totalInterest,
      dtiRatio,
      schedule,
    };
  }
}
