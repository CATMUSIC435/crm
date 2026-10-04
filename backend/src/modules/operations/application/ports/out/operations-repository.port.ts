import { OperationBillEntity, BillStatus } from '../../../domain/operation-bill.entity';
import { FitoutPermitEntity, FitoutStatus } from '../../../domain/fitout-permit.entity';
import { AmenityBookingEntity, AmenityBookingStatus } from '../../../domain/amenity-booking.entity';

export const OPERATIONS_REPOSITORY = 'OPERATIONS_REPOSITORY';

export interface OperationsRepositoryPort {
  // Bills
  findAllBills(): Promise<OperationBillEntity[]>;
  findBillById(id: string): Promise<OperationBillEntity | null>;
  saveBill(bill: OperationBillEntity): Promise<OperationBillEntity>;
  updateBillStatus(id: string, status: BillStatus, paidDate?: string, paymentMethod?: string): Promise<OperationBillEntity>;

  // Fitout Permits
  findAllPermits(): Promise<FitoutPermitEntity[]>;
  findPermitById(id: string): Promise<FitoutPermitEntity | null>;
  savePermit(permit: FitoutPermitEntity): Promise<FitoutPermitEntity>;
  updatePermitStatus(id: string, status: FitoutStatus): Promise<FitoutPermitEntity>;
  refundPermitDeposit(id: string): Promise<FitoutPermitEntity>;

  // Amenities
  findAllBookings(): Promise<AmenityBookingEntity[]>;
  saveBooking(booking: AmenityBookingEntity): Promise<AmenityBookingEntity>;
  updateBookingStatus(id: string, status: AmenityBookingStatus): Promise<AmenityBookingEntity>;
}
