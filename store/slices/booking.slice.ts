import { StateCreator } from 'zustand';
import { BookingTicket } from '@/types';

export interface BookingSlice {
  bookingTickets: BookingTicket[];
  activeBookingId: string | null;

  // Actions
  setBookingTickets: (tickets: BookingTicket[]) => void;
  addBookingTicket: (ticket: BookingTicket) => void;
  updateBookingTicketStatus: (id: string, status: BookingTicket['status']) => void;
  approveBookingTicket: (id: string, approvalRole: string) => void;
}

export const createBookingSlice: StateCreator<BookingSlice, [], [], BookingSlice> = (set) => ({
  bookingTickets: [],
  activeBookingId: null,

  setBookingTickets: (tickets) => set({ bookingTickets: tickets }),

  addBookingTicket: (ticket) =>
    set((state) => ({
      bookingTickets: [ticket, ...state.bookingTickets],
    })),

  updateBookingTicketStatus: (id, status) =>
    set((state) => ({
      bookingTickets: state.bookingTickets.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),

  approveBookingTicket: (id, approvalRole) =>
    set((state) => ({
      bookingTickets: state.bookingTickets.map((t) =>
        t.id === id ? { ...t, status: 'done' } : t
      ),
    })),
});
