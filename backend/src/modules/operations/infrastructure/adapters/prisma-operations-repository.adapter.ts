import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { OperationsRepositoryPort } from '../../application/ports/out/operations-repository.port';
import { OperationBillEntity, BillStatus } from '../../domain/operation-bill.entity';
import { FitoutPermitEntity, FitoutStatus } from '../../domain/fitout-permit.entity';
import { AmenityBookingEntity, AmenityBookingStatus } from '../../domain/amenity-booking.entity';

@Injectable()
export class PrismaOperationsRepositoryAdapter implements OperationsRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapBillToEntity(b: any): OperationBillEntity {
    return new OperationBillEntity(
      b.id,
      b.billCode,
      b.month,
      b.propertyCode,
      b.projectName,
      b.residentName,
      b.residentPhone,
      Number(b.managementFee),
      Number(b.parkingFee),
      Number(b.utilitiesFee),
      Number(b.totalAmount),
      b.status as BillStatus,
      b.dueDate,
      b.paidDate,
      b.paymentMethod,
    );
  }

  private mapPermitToEntity(p: any): FitoutPermitEntity {
    return new FitoutPermitEntity(
      p.id,
      p.propertyCode,
      p.residentName,
      p.contractorName,
      p.contractorPhone,
      p.workersCount,
      p.startDate,
      p.endDate,
      Number(p.depositAmount),
      p.status as FitoutStatus,
      p.depositRefunded,
      p.notes,
    );
  }

  private mapBookingToEntity(a: any): AmenityBookingEntity {
    return new AmenityBookingEntity(
      a.id,
      a.amenityType,
      a.propertyCode,
      a.residentName,
      a.residentPhone,
      a.bookingDate,
      a.timeSlot,
      a.guestsCount,
      a.status as AmenityBookingStatus,
    );
  }

  // Bills
  async findAllBills(): Promise<OperationBillEntity[]> {
    const records = await this.prisma.operationBill.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(r => this.mapBillToEntity(r));
  }

  async findBillById(id: string): Promise<OperationBillEntity | null> {
    const r = await this.prisma.operationBill.findFirst({
      where: {
        OR: [{ id }, { billCode: id }],
      },
    });
    return r ? this.mapBillToEntity(r) : null;
  }

  async saveBill(bill: OperationBillEntity): Promise<OperationBillEntity> {
    const r = await this.prisma.operationBill.create({
      data: {
        billCode: bill.billCode,
        month: bill.month,
        propertyCode: bill.propertyCode,
        projectName: bill.projectName,
        residentName: bill.residentName,
        residentPhone: bill.residentPhone,
        managementFee: bill.managementFee,
        parkingFee: bill.parkingFee,
        utilitiesFee: bill.utilitiesFee,
        totalAmount: bill.totalAmount,
        status: bill.status,
        dueDate: bill.dueDate,
        paidDate: bill.paidDate,
        paymentMethod: bill.paymentMethod,
      },
    });
    return this.mapBillToEntity(r);
  }

  async updateBillStatus(id: string, status: BillStatus, paidDate?: string, paymentMethod?: string): Promise<OperationBillEntity> {
    const existing = await this.findBillById(id);
    const targetId = existing ? existing.id : id;

    const r = await this.prisma.operationBill.update({
      where: { id: targetId },
      data: {
        status,
        ...(paidDate ? { paidDate } : {}),
        ...(paymentMethod ? { paymentMethod } : {}),
      },
    });
    return this.mapBillToEntity(r);
  }

  // Permits
  async findAllPermits(): Promise<FitoutPermitEntity[]> {
    const records = await this.prisma.fitoutPermit.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(r => this.mapPermitToEntity(r));
  }

  async findPermitById(id: string): Promise<FitoutPermitEntity | null> {
    const r = await this.prisma.fitoutPermit.findUnique({ where: { id } });
    return r ? this.mapPermitToEntity(r) : null;
  }

  async savePermit(permit: FitoutPermitEntity): Promise<FitoutPermitEntity> {
    const r = await this.prisma.fitoutPermit.create({
      data: {
        propertyCode: permit.propertyCode,
        residentName: permit.residentName,
        contractorName: permit.contractorName,
        contractorPhone: permit.contractorPhone,
        workersCount: permit.workersCount,
        startDate: permit.startDate,
        endDate: permit.endDate,
        depositAmount: permit.depositAmount,
        status: permit.status,
        depositRefunded: permit.depositRefunded,
        notes: permit.notes,
      },
    });
    return this.mapPermitToEntity(r);
  }

  async updatePermitStatus(id: string, status: FitoutStatus): Promise<FitoutPermitEntity> {
    const r = await this.prisma.fitoutPermit.update({
      where: { id },
      data: {
        status,
        depositRefunded: status === 'da_hoan_thanh' ? true : undefined,
      },
    });
    return this.mapPermitToEntity(r);
  }

  async refundPermitDeposit(id: string): Promise<FitoutPermitEntity> {
    const r = await this.prisma.fitoutPermit.update({
      where: { id },
      data: { depositRefunded: true },
    });
    return this.mapPermitToEntity(r);
  }

  // Amenities
  async findAllBookings(): Promise<AmenityBookingEntity[]> {
    const records = await this.prisma.amenityBooking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(r => this.mapBookingToEntity(r));
  }

  async saveBooking(booking: AmenityBookingEntity): Promise<AmenityBookingEntity> {
    const r = await this.prisma.amenityBooking.create({
      data: {
        amenityType: booking.amenityType,
        propertyCode: booking.propertyCode,
        residentName: booking.residentName,
        residentPhone: booking.residentPhone,
        bookingDate: booking.bookingDate,
        timeSlot: booking.timeSlot,
        guestsCount: booking.guestsCount,
        status: booking.status,
      },
    });
    return this.mapBookingToEntity(r);
  }

  async updateBookingStatus(id: string, status: AmenityBookingStatus): Promise<AmenityBookingEntity> {
    const r = await this.prisma.amenityBooking.update({
      where: { id },
      data: { status },
    });
    return this.mapBookingToEntity(r);
  }
}
