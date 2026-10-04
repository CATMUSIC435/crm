import { PortfolioProperty } from '@/types';

export const selectPortfolioMacroStats = (properties: PortfolioProperty[]) => {
  const totalBuyPrice = properties.reduce((sum, p) => sum + (Number(p.buyPrice) || 0), 0);
  const totalValuation = properties.reduce((sum, p) => sum + (Number(p.currentValuation) || 0), 0);
  const totalCapitalGain = totalValuation - totalBuyPrice;
  const totalAnnualRent = properties.reduce((sum, p) => sum + (Number(p.annualNetRental) || 0), 0);

  return {
    totalBuyPrice,
    totalValuation,
    totalCapitalGain,
    totalAnnualRent,
    rentalYield: totalValuation > 0 ? Number(((totalAnnualRent / totalValuation) * 100).toFixed(2)) : 0,
    gainPercent: totalBuyPrice > 0 ? Number(((totalCapitalGain / totalBuyPrice) * 100).toFixed(1)) : 0,
  };
};

export const selectPropertiesByCustomer = (properties: PortfolioProperty[], customerId: string) => {
  if (!customerId || customerId === 'all') return properties;
  return properties.filter((p) => p.customerId === customerId);
};
