import { BookingTicketEntity } from '../../../domain/booking-ticket.entity';

export const BOOKING_REPOSITORY_PORT = Symbol('BOOKING_REPOSITORY_PORT');

export interface BookingRepositoryPort {
  save(booking: BookingTicketEntity): Promise<void>;
  findById(id: string): Promise<BookingTicketEntity | null>;
  findByUnitId(unitId: string): Promise<BookingTicketEntity | null>;
  findAll(projectId?: string, stage?: string): Promise<any[]>;
  updateUnitStatus(unitId: string, status: string, expiresAt?: Date): Promise<void>;
}
