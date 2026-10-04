import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { MortgageRepositoryPort } from '../../application/ports/out/mortgage-repository.port';
import { MortgageSimulationEntity } from '../../domain/mortgage-calculator';
import { CalculateMortgageDto, MortgageCalculationResult } from '../../application/ports/in/mortgage.use-case';

@Injectable()
export class PrismaMortgageRepositoryAdapter implements MortgageRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(item: any): MortgageSimulationEntity {
    return {
      id: item.id,
      customerId: item.customerId,
      customerName: item.customerName,
      propertyCode: item.propertyCode,
      propertyValue: Number(item.propertyValue),
      loanPercent: item.loanPercent,
      loanAmount: Number(item.loanAmount),
      loanTermYears: item.loanTermYears,
      bankId: item.bankId,
      bankName: item.bankName,
      preferentialRate: item.preferentialRate,
      preferentialMonths: item.preferentialMonths,
      floatingRate: item.floatingRate,
      repaymentMethod: item.repaymentMethod,
      enableGracePeriod: item.enableGracePeriod,
      graceMonths: item.graceMonths,
      monthlyIncome: Number(item.monthlyIncome),
      dtiRatio: item.dtiRatio,
      monthlyPaymentFirst: Number(item.monthlyPaymentFirst),
      totalInterest: Number(item.totalInterest),
      amortizationSchedule: item.amortizationSchedule,
      createdAt: item.createdAt,
    };
  }

  async save(dto: CalculateMortgageDto, result: MortgageCalculationResult): Promise<MortgageSimulationEntity> {
    const created = await this.prisma.mortgageSimulation.create({
      data: {
        customerId: dto.customerId,
        customerName: dto.customerName || 'Khách hàng VIP',
        propertyCode: dto.propertyCode || 'NVW-01.01',
        propertyValue: result.propertyValue,
        loanPercent: result.loanPercent,
        loanAmount: result.loanAmount,
        loanTermYears: result.loanTermYears,
        bankId: dto.bankId || 'vpb',
        bankName: result.bankName,
        preferentialRate: dto.preferentialRate || 6.5,
        preferentialMonths: dto.preferentialMonths || 12,
        floatingRate: dto.floatingRate || 9.8,
        repaymentMethod: dto.repaymentMethod || 'reducing',
        enableGracePeriod: dto.enableGracePeriod || false,
        graceMonths: dto.graceMonths || 0,
        monthlyIncome: dto.monthlyIncome || 80000000,
        dtiRatio: result.dtiRatio,
        monthlyPaymentFirst: result.monthlyPaymentFirst,
        totalInterest: result.totalInterest,
        amortizationSchedule: result.scheduleSummary as any,
      },
    });
    return this.toEntity(created);
  }

  async findAll(customerId?: string): Promise<MortgageSimulationEntity[]> {
    const where: any = {};
    if (customerId) where.customerId = customerId;

    const list = await this.prisma.mortgageSimulation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return list.map((item) => this.toEntity(item));
  }
}
