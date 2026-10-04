import { CreateBookingDto, ApproveBookingDto, RejectBookingDto, ExtendSlaDto } from '../../dtos/booking.dto';

export const BOOKING_USE_CASE = Symbol('BOOKING_USE_CASE');

export interface BookingUseCase {
  createBooking(dto: CreateBookingDto, agentId: string): Promise<any>;
  getBookings(projectId?: string, stage?: string): Promise<any[]>;
  getBookingDetail(id: string): Promise<any>;
  approveBooking(id: string, dto: ApproveBookingDto, actorRole: string, actorName: string): Promise<any>;
  rejectBooking(id: string, dto: RejectBookingDto, actorName: string): Promise<any>;
  extendSLA(id: string, dto: ExtendSlaDto, actorName: string): Promise<any>;
}
