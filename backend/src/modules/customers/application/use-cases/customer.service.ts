import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CustomerUseCase } from '../ports/in/customer.use-case';
import { CreateCustomerDto, FilterCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { PrismaService } from '../../../../database/prisma.service';

const SEED_CUSTOMERS = [
  {
    id: 'c1',
    code: 'KH-001',
    fullName: 'Nguyễn Văn Tuấn',
    phone: '0901234567',
    email: 'tuan.nguyen@investor.vn',
    rank: 'DIAMOND_VVIP',
    totalRevenue: 25000000000,
    status: 'ACTIVE',
    assignedToId: 'usr-admin-001',
    assignedTo: { fullName: 'Lê Hoàng Anh', phone: '0901888999' },
    _count: { bookings: 2, contracts: 3 },
  },
  {
    id: 'c2',
    code: 'KH-002',
    fullName: 'Trần Thị Bích Ngọc',
    phone: '0912345678',
    email: 'bichngoc.tran@vietcapital.vn',
    rank: 'PLATINUM',
    totalRevenue: 15000000000,
    status: 'ACTIVE',
    assignedToId: 'usr-agent-005',
    assignedTo: { fullName: 'Hoàng Văn Môi Giới', phone: '0905888999' },
    _count: { bookings: 1, contracts: 2 },
  },
  {
    id: 'c3',
    code: 'KH-003',
    fullName: 'Lê Hoàng Cường',
    phone: '0987654321',
    email: 'cuong.le@techvina.com',
    rank: 'GOLD',
    totalRevenue: 0,
    status: 'ACTIVE',
    assignedToId: 'usr-agent-005',
    assignedTo: { fullName: 'Hoàng Văn Môi Giới', phone: '0905888999' },
    _count: { bookings: 1, contracts: 0 },
  },
  {
    id: 'c4',
    code: 'KH-004',
    fullName: 'Phạm Minh Tuấn',
    phone: '0912987654',
    email: 'minhtuan.pham@saigonres.com',
    rank: 'DIAMOND_VVIP',
    totalRevenue: 35000000000,
    status: 'ACTIVE',
    assignedToId: 'usr-admin-001',
    assignedTo: { fullName: 'Lê Hoàng Anh', phone: '0901888999' },
    _count: { bookings: 3, contracts: 4 },
  },
];

@Injectable()
export class CustomerService implements CustomerUseCase {
  private inMemoryCustomers: any[] = [...SEED_CUSTOMERS];

  constructor(private readonly prisma: PrismaService) {}

  async getCustomers(filters: FilterCustomerDto, agentId?: string) {
    if (this.prisma.isConnected) {
      try {
        const where: any = {};
        if (agentId) where.assignedToId = agentId;
        if (filters.rank) where.rank = filters.rank;
        if (filters.status) where.status = filters.status;
        if (filters.search) {
          where.OR = [
            { fullName: { contains: filters.search, mode: 'insensitive' } },
            { phone: { contains: filters.search } },
            { email: { contains: filters.search, mode: 'insensitive' } },
            { code: { contains: filters.search, mode: 'insensitive' } },
          ];
        }

        const res = await this.prisma.customer.findMany({
          where,
          include: {
            assignedTo: { select: { fullName: true, phone: true } },
            _count: { select: { bookings: true, contracts: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
        return res;
      } catch {}
    }

    // Fallback in-memory
    let list = [...this.inMemoryCustomers];
    if (agentId) {
      list = list.filter((c) => c.assignedToId === agentId);
    }
    if (filters.rank) {
      list = list.filter((c) => c.rank === filters.rank);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter((c) =>
        c.fullName.toLowerCase().includes(s) ||
        c.phone.includes(s) ||
        c.code.toLowerCase().includes(s)
      );
    }
    return list;
  }

  async getCustomerDetail(id: string) {
    if (this.prisma.isConnected) {
      try {
        const customer = await this.prisma.customer.findUnique({
          where: { id },
          include: {
            assignedTo: { select: { fullName: true, phone: true, email: true } },
            bookings: { include: { unit: true, project: true } },
            contracts: { include: { unit: true, project: true } },
          },
        });
        if (customer) return customer;
      } catch {}
    }

    const found = this.inMemoryCustomers.find((c) => c.id === id || c.code === id);
    if (!found) {
      throw new NotFoundException(`Không tìm thấy hồ sơ khách hàng: ${id}`);
    }
    return {
      ...found,
      bookings: [],
      contracts: [],
    };
  }

  async createCustomer(dto: CreateCustomerDto, agentId: string) {
    if (this.prisma.isConnected) {
      try {
        const existing = await this.prisma.customer.findUnique({ where: { phone: dto.phone } });
        if (existing) {
          throw new ConflictException(`Số điện thoại ${dto.phone} đã thuộc về khách hàng khác trong danh bạ`);
        }

        const count = await this.prisma.customer.count();
        const code = `KH-${String(count + 1).padStart(3, '0')}`;

        const created = await this.prisma.customer.create({
          data: {
            code,
            fullName: dto.fullName,
            phone: dto.phone,
            email: dto.email,
            idCardNumber: dto.idCardNumber,
            rank: (dto.rank as any) || 'NEW',
            assignedToId: agentId,
          },
        });
        this.inMemoryCustomers.unshift(created);
        return created;
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
      }
    }

    const code = `KH-${String(this.inMemoryCustomers.length + 1).padStart(3, '0')}`;
    const newCustomer = {
      id: `c-${Date.now()}`,
      code,
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      idCardNumber: dto.idCardNumber,
      rank: dto.rank || 'NEW',
      totalRevenue: 0,
      status: 'ACTIVE',
      assignedToId: agentId,
      assignedTo: { fullName: 'Môi Giới Phụ Trách', phone: '0901888999' },
      _count: { bookings: 0, contracts: 0 },
    };
    this.inMemoryCustomers.unshift(newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto) {
    if (this.prisma.isConnected) {
      try {
        const updateData: any = {};
        if (dto.fullName !== undefined) updateData.fullName = dto.fullName;
        if (dto.phone !== undefined) updateData.phone = dto.phone;
        if (dto.email !== undefined) updateData.email = dto.email;
        if (dto.idCardNumber !== undefined) updateData.idCardNumber = dto.idCardNumber;
        if (dto.rank !== undefined) updateData.rank = dto.rank as any;
        if (dto.status !== undefined) updateData.status = dto.status;
        if (dto.assignedToId !== undefined) updateData.assignedToId = dto.assignedToId;

        const updated = await this.prisma.customer.update({
          where: { id },
          data: updateData,
          include: {
            assignedTo: { select: { fullName: true, phone: true, email: true } },
            bookings: { include: { unit: true, project: true } },
            contracts: { include: { unit: true, project: true } },
          },
        });

        const idx = this.inMemoryCustomers.findIndex((c) => c.id === id);
        if (idx !== -1) {
          this.inMemoryCustomers[idx] = { ...this.inMemoryCustomers[idx], ...updated };
        }
        return updated;
      } catch (err: any) {
        // Fallback to in-memory if Prisma error or record not in DB
      }
    }

    const idx = this.inMemoryCustomers.findIndex((c) => c.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Không tìm thấy hồ sơ khách hàng: ${id}`);
    }
    this.inMemoryCustomers[idx] = {
      ...this.inMemoryCustomers[idx],
      ...dto,
    };
    return this.inMemoryCustomers[idx];
  }
}

