import { MortgageSimulationEntity, AmortizationPeriod } from '../../../domain/mortgage-calculator';

export const MORTGAGE_USE_CASE = Symbol('MORTGAGE_USE_CASE');

export interface CalculateMortgageDto {
  propertyValue: number;
  loanPercent?: number;
  loanTermYears?: number;
  bankId?: string;
  preferentialRate?: number;
  preferentialMonths?: number;
  floatingRate?: number;
  repaymentMethod?: 'reducing' | 'linear';
  enableGracePeriod?: boolean;
  graceMonths?: number;
  monthlyIncome?: number;
  customerId?: string;
  customerName?: string;
  propertyCode?: string;
}

export interface BankPackageDto {
  id: string;
  name: string;
  logo: string;
  preferentialRate: number;
  preferentialMonths: number;
  floatingRate: number;
  maxLoanPercent: number;
  maxTermYears: number;
  description: string;
}

export interface MortgageCalculationResult {
  propertyValue: number;
  loanPercent: number;
  loanAmount: number;
  loanTermYears: number;
  bankName: string;
  monthlyPaymentFirst: number;
  totalInterest: number;
  totalPaid: number;
  dtiRatio: number;
  scheduleSummary: AmortizationPeriod[];
}

export interface MortgageUseCase {
  calculate(dto: CalculateMortgageDto): Promise<MortgageCalculationResult>;
  saveSimulation(dto: CalculateMortgageDto): Promise<MortgageSimulationEntity>;
  getSimulations(customerId?: string): Promise<MortgageSimulationEntity[]>;
  getBankPackages(): Promise<BankPackageDto[]>;
}
