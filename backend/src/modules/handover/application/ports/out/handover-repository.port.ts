import { HandoverTicketEntity, SnaggingDefectEntity, PinkBookStage, HandoverStatus } from '../../../domain/handover-ticket.entity';

export const HANDOVER_REPOSITORY = 'HANDOVER_REPOSITORY';

export interface HandoverRepositoryPort {
  findAll(): Promise<HandoverTicketEntity[]>;
  findById(id: string): Promise<HandoverTicketEntity | null>;
  findByCode(code: string): Promise<HandoverTicketEntity | null>;
  save(ticket: HandoverTicketEntity): Promise<HandoverTicketEntity>;
  updateStatus(id: string, status: HandoverStatus): Promise<HandoverTicketEntity>;
  updatePinkBook(id: string, stage: PinkBookStage, bookNumber?: string): Promise<HandoverTicketEntity>;
  addDefect(ticketId: string, defect: Omit<SnaggingDefectEntity, 'id'>): Promise<SnaggingDefectEntity>;
  updateDefectStatus(defectId: string, status: string, resolvedDate?: string): Promise<SnaggingDefectEntity>;
  updateChecklist(id: string, checklist: any[]): Promise<HandoverTicketEntity>;
}
