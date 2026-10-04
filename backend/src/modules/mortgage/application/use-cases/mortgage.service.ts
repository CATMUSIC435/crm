import { Injectable, Inject } from '@nestjs/common';
import {
  MortgageUseCase,
  CalculateMortgageDto,
  MortgageCalculationResult,
  BankPackageDto,
} from '../ports/in/mortgage.use-case';
import { MORTGAGE_REPOSITORY, MortgageRepositoryPort } from '../ports/out/mortgage-repository.port';
import { MortgageCalculatorEngine, MortgageSimulationEntity } from '../../domain/mortgage-calculator';

const BANK_PACKAGES: BankPackageDto[] = [
  {
    id: 'vpb',
    name: 'VPBank - Gói Ngôi Nhà Đầu Tiên',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&q=80',
    preferentialRate: 5.9,
    preferentialMonths: 12,
    floatingRate: 9.5,
    maxLoanPercent: 80,
    maxTermYears: 25,
    description: 'Ân hạn nợ gốc 24 tháng, cố định 5.9% năm đầu',
  },
  {
    id: 'mbb',
    name: 'MBBank - Tiếp Sức An Cư VVIP',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&q=80',
    preferentialRate: 6.5,
    preferentialMonths: 24,
    floatingRate: 9.8,
    maxLoanPercent: 75,
    maxTermYears: 30,
    description: 'Bảo lãnh giải ngân song song dự án Novaland & Masterise',
  },
  {
    id: 'tpb',
    name: 'TPBank - LiveBank 24/7 Digital Loan',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&q=80',
    preferentialRate: 6.2,
    preferentialMonths: 18,
    floatingRate: 9.9,
    maxLoanPercent: 70,
    maxTermYears: 20,
    description: 'Duyệt hồ sơ online siêu tốc trong 4 giờ làm việc',
  },
  {
    id: 'vcb',
    name: 'Vietcombank - Gói Vay Tín Dụng Bền Vững',
    logo: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=100&q=80',
    preferentialRate: 6.0,
    preferentialMonths: 24,
    floatingRate: 9.0,
    maxLoanPercent: 70,
    maxTermYears: 20,
    description: 'Lãi suất thả nổi thấp nhất thị trường khối ngân hàng quốc doanh',
  },
];

@Injectable()
export class MortgageService implements MortgageUseCase {
  constructor(
    @Inject(MORTGAGE_REPOSITORY)
    private readonly repo: MortgageRepositoryPort,
  ) {}

  async calculate(dto: CalculateMortgageDto): Promise<MortgageCalculationResult> {
    const loanPercent = dto.loanPercent || 70;
    const loanTermYears = dto.loanTermYears || 20;

    const matchedBank = BANK_PACKAGES.find((b) => b.id === dto.bankId) || BANK_PACKAGES[0];
    const preferentialRate = dto.preferentialRate !== undefined ? dto.preferentialRate : matchedBank.preferentialRate;
    const preferentialMonths = dto.preferentialMonths !== undefined ? dto.preferentialMonths : matchedBank.preferentialMonths;
    const floatingRate = dto.floatingRate !== undefined ? dto.floatingRate : matchedBank.floatingRate;
    const repaymentMethod = dto.repaymentMethod || 'reducing';
    const enableGracePeriod = dto.enableGracePeriod || false;
    const graceMonths = dto.graceMonths || 0;
    const monthlyIncome = dto.monthlyIncome || 80000000;

    const calculated = MortgageCalculatorEngine.calculate(
      dto.propertyValue,
      loanPercent,
      loanTermYears,
      preferentialRate,
      preferentialMonths,
      floatingRate,
      repaymentMethod,
      enableGracePeriod,
      graceMonths,
      monthlyIncome,
    );

    return {
      propertyValue: dto.propertyValue,
      loanPercent,
      loanAmount: calculated.loanAmount,
      loanTermYears,
      bankName: matchedBank.name,
      monthlyPaymentFirst: calculated.monthlyPaymentFirst,
      totalInterest: calculated.totalInterest,
      totalPaid: calculated.loanAmount + calculated.totalInterest,
      dtiRatio: calculated.dtiRatio,
      scheduleSummary: calculated.schedule.slice(0, 36), // Return first 36 months preview
    };
  }

  async saveSimulation(dto: CalculateMortgageDto): Promise<MortgageSimulationEntity> {
    const result = await this.calculate(dto);
    return await this.repo.save(dto, result);
  }

  async getSimulations(customerId?: string): Promise<MortgageSimulationEntity[]> {
    return await this.repo.findAll(customerId);
  }

  async getBankPackages(): Promise<BankPackageDto[]> {
    return BANK_PACKAGES;
  }
}
