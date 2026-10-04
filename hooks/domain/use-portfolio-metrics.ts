import { useMemo } from 'react';
import { PortfolioProperty } from '@/types';

export interface PortfolioMetricsSummary {
  totalInvestment: number;
  totalCurrentValuation: number;
  totalCapitalGain: number;
  totalCapitalGainPercent: number;
  totalAnnualNetRental: number;
  weightedRentalYield: number;
  estimatedIrr: number;
}

export function usePortfolioMetrics(properties: PortfolioProperty[]): PortfolioMetricsSummary {
  return useMemo(() => {
    if (!properties || properties.length === 0) {
      return {
        totalInvestment: 0,
        totalCurrentValuation: 0,
        totalCapitalGain: 0,
        totalCapitalGainPercent: 0,
        totalAnnualNetRental: 0,
        weightedRentalYield: 0,
        estimatedIrr: 0,
      };
    }

    const totalInvestment = properties.reduce((sum, p) => sum + (Number(p.buyPrice) || 0), 0);
    const totalCurrentValuation = properties.reduce((sum, p) => sum + (Number(p.currentValuation) || 0), 0);
    const totalCapitalGain = totalCurrentValuation - totalInvestment;
    const totalCapitalGainPercent = totalInvestment > 0 ? Number(((totalCapitalGain / totalInvestment) * 100).toFixed(1)) : 0;

    const totalAnnualNetRental = properties.reduce((sum, p) => sum + (Number(p.annualNetRental) || 0), 0);
    const weightedRentalYield = totalCurrentValuation > 0 ? Number(((totalAnnualNetRental / totalCurrentValuation) * 100).toFixed(2)) : 0;

    // Approximate Portfolio IRR: (Gain% / HoldingPeriod ~ 3 years) + Annual Yield
    const estimatedIrr = Number((totalCapitalGainPercent / 3 + weightedRentalYield).toFixed(1));

    return {
      totalInvestment,
      totalCurrentValuation,
      totalCapitalGain,
      totalCapitalGainPercent,
      totalAnnualNetRental,
      weightedRentalYield,
      estimatedIrr,
    };
  }, [properties]);
}
