import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractUseCase } from '../ports/in/contract.use-case';
import { CreateContractDto, SignContractDto, RecordPaymentDto } from '../dtos/contract.dto';
import { ContractEntity } from '../../domain/contract.entity';
import { PrismaService } from '../../../../database/prisma.service';

const SEED_CONTRACTS: any[] = [
  {
    id: 'ct-1',
    code: 'HD-8801',
    type: 'Hợp đồng mua bán',
    customerId: 'c1',
    customer: { fullName: 'Nguyễn Văn Tuấn', phone: '0901234567', rank: 'DIAMOND_VVIP' },
    unitId: 'i1',
    unit: { code: 'NVW-01.01', type: 'Biệt thự biển đơn lập', tower: 'Khu Florida 1' },
    projectId: 'p1',
    project: { name: 'NovaWorld Phan Thiet' },
    creatorId: 'usr-agent-004',
    creator: { fullName: 'Phạm Thị Thảo' },
    value: 15500000000,
    paidAmount: 1550000000,
    paymentProgress: 10,
    status: 'PENDING_SIGNATURE',
    signatureHash: null,
    signedAt: null,
    paymentSchedule: [
      { installment: 1, milestone: 'Đặt cọc', percentage: 10, amount: 1550000000, status: 'Đã thu' },
      { installment: 2, milestone: 'Ký HĐMB chính thức', percentage: 20, amount: 3100000000, status: 'Đến hạn' },
      { installment: 3, milestone: 'Hoàn thiện cất nóc', percentage: 20, amount: 3100000000, status: 'Chưa đến hạn' },
      { installment: 4, milestone: 'Bàn giao nhận nhà', percentage: 45, amount: 6975000000, status: 'Chưa đến hạn' },
      { installment: 5, milestone: 'Bàn giao Sổ Hồng', percentage: 5, amount: 775000000, status: 'Chưa đến hạn' },
    ],
    createdAt: new Date('2024-05-01'),
  },
  {
    id: 'ct-2',
    code: 'HD-8802',
    type: 'Hợp đồng đặt cọc',
    customerId: 'c2',
    customer: { fullName: 'Trần Thị Mai', phone: '0912345678', rank: 'PLATINUM' },
    unitId: 'i3',
    unit: { code: 'AQC-05.12', type: 'Nhà phố liền kề', tower: 'The Suite' },
    projectId: 'p2',
    project: { name: 'Aqua City' },
    creatorId: 'usr-agent-004',
    creator: { fullName: 'Phạm Thị Thảo' },
    value: 8200000000,
    paidAmount: 2460000000,
    paymentProgress: 30,
    status: 'SIGNED_ACTIVE',
    signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    signedAt: new Date('2024-05-15'),
    paymentSchedule: [
      { installment: 1, milestone: 'Đặt cọc', percentage: 10, amount: 820000000, status: 'Đã thu' },
      { installment: 2, milestone: 'Ký HĐMB', percentage: 20, amount: 1640000000, status: 'Đã thu' },
      { installment: 3, milestone: 'Hoàn thiện', percentage: 70, amount: 5740000000, status: 'Chưa đến hạn' },
    ],
    createdAt: new Date('2024-05-10'),
  },
];

@Injectable()
export class ContractService implements ContractUseCase {
  private inMemoryContracts: any[] = [...SEED_CONTRACTS];

  constructor(private readonly prisma: PrismaService) {}

  async getContracts(projectId?: string) {
    if (this.prisma.isConnected) {
      try {
        const where = projectId ? { projectId } : {};
        const res = await this.prisma.contract.findMany({
          where,
          include: {
            customer: { select: { fullName: true, phone: true, rank: true } },
            unit: { select: { code: true, type: true, tower: true } },
            project: { select: { name: true } },
            creator: { select: { fullName: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
        if (res && res.length > 0) return res;
      } catch {}
    }

    let list = [...this.inMemoryContracts];
    if (projectId) list = list.filter((c) => c.projectId === projectId);
    return list;
  }

  async getContractDetail(id: string) {
    if (this.prisma.isConnected) {
      try {
        const contract = await this.prisma.contract.findUnique({
          where: { id },
          include: {
            customer: true,
            unit: true,
            project: true,
            creator: true,
          },
        });
        if (contract) return contract;
      } catch {}
    }

    const contract = this.inMemoryContracts.find((c) => c.id === id || c.code === id);
    if (!contract) {
      throw new NotFoundException(`Không tìm thấy hợp đồng: ${id}`);
    }
    return contract;
  }

  async createContract(dto: CreateContractDto, creatorId: string) {
    const code = `HD-${String(8800 + this.inMemoryContracts.length + 1)}`;
    const schedule = [
      { installment: 1, milestone: 'Đặt cọc', percentage: 10, amount: dto.value * 0.1, status: 'Đã thu' },
      { installment: 2, milestone: 'Ký HĐMB chính thức', percentage: 20, amount: dto.value * 0.2, status: 'Đến hạn' },
      { installment: 3, milestone: 'Hoàn thiện cất nóc', percentage: 20, amount: dto.value * 0.2, status: 'Chưa đến hạn' },
      { installment: 4, milestone: 'Bàn giao nhận nhà', percentage: 45, amount: dto.value * 0.45, status: 'Chưa đến hạn' },
      { installment: 5, milestone: 'Bàn giao Sổ Hồng', percentage: 5, amount: dto.value * 0.05, status: 'Chưa đến hạn' },
    ];

    if (this.prisma.isConnected) {
      try {
        const contract = await this.prisma.contract.create({
          data: {
            code,
            type: dto.type,
            customerId: dto.customerId,
            unitId: dto.unitId,
            projectId: dto.projectId,
            creatorId,
            value: dto.value,
            paidAmount: dto.value * 0.1,
            paymentProgress: 10,
            status: 'PENDING_SIGNATURE',
            paymentSchedule: schedule,
          },
        });

        await this.prisma.inventoryItem.update({
          where: { id: dto.unitId },
          data: { status: 'SOLD' },
        });

        await this.prisma.customer.update({
          where: { id: dto.customerId },
          data: { totalRevenue: { increment: dto.value }, status: 'Đã giao dịch' },
        });

        return contract;
      } catch {}
    }

    // In-Memory Fallback
    const newContract = {
      id: `ct-${Date.now()}`,
      code,
      type: dto.type,
      customerId: dto.customerId,
      customer: { fullName: 'Khách Hàng Mua Nhà', phone: '0901234567', rank: 'PLATINUM' },
      unitId: dto.unitId,
      unit: { code: dto.unitId, type: 'Căn hộ chung cư', tower: 'Tháp Sapphire' },
      projectId: dto.projectId,
      project: { name: 'Đại Đô Thị NovaCRM' },
      creatorId,
      creator: { fullName: 'Môi Giới Phụ Trách' },
      value: dto.value,
      paidAmount: dto.value * 0.1,
      paymentProgress: 10,
      status: 'PENDING_SIGNATURE',
      signatureHash: null,
      signedAt: null,
      paymentSchedule: schedule,
      createdAt: new Date(),
    };

    this.inMemoryContracts.unshift(newContract);
    return newContract;
  }

  async signContract(id: string, dto: SignContractDto, ipAddress: string) {
    let raw = this.inMemoryContracts.find((c) => c.id === id || c.code === id);

    if (this.prisma.isConnected) {
      try {
        const dbRaw = await this.prisma.contract.findUnique({ where: { id } });
        if (dbRaw) raw = dbRaw;
      } catch {}
    }

    if (!raw) {
      throw new NotFoundException(`Không tìm thấy hợp đồng: ${id}`);
    }

    const domain = new ContractEntity(
      raw.id,
      raw.code,
      raw.type,
      raw.customerId,
      raw.unitId,
      raw.projectId,
      raw.creatorId,
      Number(raw.value),
      Number(raw.paidAmount),
      raw.paymentProgress,
      raw.status as any,
    );

    const hash = domain.signDigital(dto.signerName, ipAddress);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.contract.update({
          where: { id: raw.id },
          data: {
            status: 'SIGNED_ACTIVE',
            signatureHash: hash,
            signedAt: domain.signedAt,
          },
        });
      } catch {}
    }

    // Cập nhật bộ nhớ
    raw.status = 'SIGNED_ACTIVE';
    raw.signatureHash = hash;
    raw.signedAt = domain.signedAt;

    return {
      id: raw.id,
      code: raw.code,
      signatureHash: hash,
      signedAt: domain.signedAt,
      message: 'Ký số điện tử SHA-256 cho hợp đồng thành công',
    };
  }

  async recordPayment(id: string, dto: RecordPaymentDto) {
    let raw = this.inMemoryContracts.find((c) => c.id === id || c.code === id);

    if (this.prisma.isConnected) {
      try {
        const dbRaw = await this.prisma.contract.findUnique({ where: { id } });
        if (dbRaw) raw = dbRaw;
      } catch {}
    }

    if (!raw) {
      throw new NotFoundException(`Không tìm thấy hợp đồng: ${id}`);
    }

    const domain = new ContractEntity(
      raw.id,
      raw.code,
      raw.type,
      raw.customerId,
      raw.unitId,
      raw.projectId,
      raw.creatorId,
      Number(raw.value),
      Number(raw.paidAmount),
      raw.paymentProgress,
      raw.status as any,
    );

    domain.recordPayment(dto.amount);

    if (this.prisma.isConnected) {
      try {
        return await this.prisma.contract.update({
          where: { id: raw.id },
          data: {
            paidAmount: domain.paidAmount,
            paymentProgress: domain.paymentProgress,
            status: domain.status as any,
          },
        });
      } catch {}
    }

    raw.paidAmount = domain.paidAmount;
    raw.paymentProgress = domain.paymentProgress;
    raw.status = domain.status;

    return raw;
  }
}
