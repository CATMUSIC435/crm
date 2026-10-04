import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { OperationsUseCase, CreateBillDto, CreateFitoutPermitDto, CreateAmenityBookingDto } from '../ports/in/operations.use-case';
import { OPERATIONS_REPOSITORY, OperationsRepositoryPort } from '../ports/out/operations-repository.port';
import { OperationBillEntity } from '../../domain/operation-bill.entity';
import { FitoutPermitEntity, FitoutStatus } from '../../domain/fitout-permit.entity';
import { AmenityBookingEntity } from '../../domain/amenity-booking.entity';

@Injectable()
export class OperationsService implements OperationsUseCase {
  constructor(
    @Inject(OPERATIONS_REPOSITORY)
    private readonly repo: OperationsRepositoryPort,
  ) {}

  async getBills(): Promise<OperationBillEntity[]> {
    return await this.repo.findAllBills();
  }

  async createBill(dto: CreateBillDto): Promise<OperationBillEntity> {
    const totalAmount = Number(dto.managementFee) + Number(dto.parkingFee) + Number(dto.utilitiesFee);
    const bill = new OperationBillEntity(
      '',
      dto.billCode,
      dto.month,
      dto.propertyCode,
      dto.projectName,
      dto.residentName,
      dto.residentPhone || null,
      Number(dto.managementFee),
      Number(dto.parkingFee),
      Number(dto.utilitiesFee),
      totalAmount,
      'cho_thanh_toan',
      dto.dueDate,
    );
    return await this.repo.saveBill(bill);
  }

  async payBill(id: string, paymentMethod: string = 'VietQR Pro 24/7'): Promise<OperationBillEntity> {
    const bill = await this.repo.findBillById(id);
    if (!bill) {
      throw new NotFoundException(`Không tìm thấy hóa đơn mã: ${id}`);
    }
    const today = new Date().toISOString().split('T')[0];
    return await this.repo.updateBillStatus(id, 'da_thanh_toan', today, paymentMethod);
  }

  async getPermits(): Promise<FitoutPermitEntity[]> {
    return await this.repo.findAllPermits();
  }

  async createPermit(dto: CreateFitoutPermitDto): Promise<FitoutPermitEntity> {
    const permit = new FitoutPermitEntity(
      '',
      dto.propertyCode,
      dto.residentName,
      dto.contractorName,
      dto.contractorPhone || null,
      dto.workersCount,
      dto.startDate,
      dto.endDate,
      Number(dto.depositAmount),
      'cho_duyet',
      false,
      dto.notes || null,
    );
    return await this.repo.savePermit(permit);
  }

  async approvePermit(id: string, status: FitoutStatus): Promise<FitoutPermitEntity> {
    return await this.repo.updatePermitStatus(id, status);
  }

  async refundDeposit(id: string): Promise<FitoutPermitEntity> {
    return await this.repo.refundPermitDeposit(id);
  }

  async getBookings(): Promise<AmenityBookingEntity[]> {
    return await this.repo.findAllBookings();
  }

  async createBooking(dto: CreateAmenityBookingDto): Promise<AmenityBookingEntity> {
    const booking = new AmenityBookingEntity(
      '',
      dto.amenityType,
      dto.propertyCode,
      dto.residentName,
      dto.residentPhone || null,
      dto.bookingDate,
      dto.timeSlot,
      dto.guestsCount,
      'da_xac_nhan',
    );
    return await this.repo.saveBooking(booking);
  }

  async checkInBooking(id: string): Promise<AmenityBookingEntity> {
    return await this.repo.updateBookingStatus(id, 'da_checkin');
  }
}
