import { OperationBillEntity, BillStatus } from '../../../domain/operation-bill.entity';
import { FitoutPermitEntity, FitoutStatus } from '../../../domain/fitout-permit.entity';
import { AmenityBookingEntity } from '../../../domain/amenity-booking.entity';

export const OPERATIONS_USE_CASE = 'OPERATIONS_USE_CASE';

export interface CreateBillDto {
  billCode: string;
  month: string;
  propertyCode: string;
  projectName: string;
  residentName: string;
  residentPhone?: string;
  managementFee: number;
  parkingFee: number;
  utilitiesFee: number;
  dueDate: string;
}

export interface CreateFitoutPermitDto {
  propertyCode: string;
  residentName: string;
  contractorName: string;
  contractorPhone?: string;
  workersCount: number;
  startDate: string;
  endDate: string;
  depositAmount: number;
  notes?: string;
}

export interface CreateAmenityBookingDto {
  amenityType: string;
  propertyCode: string;
  residentName: string;
  residentPhone?: string;
  bookingDate: string;
  timeSlot: string;
  guestsCount: number;
}

export interface OperationsUseCase {
  getBills(): Promise<OperationBillEntity[]>;
  createBill(dto: CreateBillDto): Promise<OperationBillEntity>;
  payBill(id: string, paymentMethod?: string): Promise<OperationBillEntity>;

  getPermits(): Promise<FitoutPermitEntity[]>;
  createPermit(dto: CreateFitoutPermitDto): Promise<FitoutPermitEntity>;
  approvePermit(id: string, status: FitoutStatus): Promise<FitoutPermitEntity>;
  refundDeposit(id: string): Promise<FitoutPermitEntity>;

  getBookings(): Promise<AmenityBookingEntity[]>;
  createBooking(dto: CreateAmenityBookingDto): Promise<AmenityBookingEntity>;
  checkInBooking(id: string): Promise<AmenityBookingEntity>;
}
