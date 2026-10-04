import { MortgageSimulationEntity } from '../../../domain/mortgage-calculator';
import { CalculateMortgageDto, MortgageCalculationResult } from '../in/mortgage.use-case';

export const MORTGAGE_REPOSITORY = Symbol('MORTGAGE_REPOSITORY');

export interface MortgageRepositoryPort {
  save(dto: CalculateMortgageDto, result: MortgageCalculationResult): Promise<MortgageSimulationEntity>;
  findAll(customerId?: string): Promise<MortgageSimulationEntity[]>;
}
