import { HandoverTicketEntity, SnaggingDefectEntity, PinkBookStage, HandoverStatus } from '../../../domain/handover-ticket.entity';
import { ChecklistItem } from '../../../domain/checklist-template';

export const HANDOVER_USE_CASE = 'HANDOVER_USE_CASE';

export interface CreateHandoverDto {
  code: string;
  contractId?: string;
  propertyCode: string;
  projectId?: string;
  projectName: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  propertyType: string;
  area: number;
  scheduledDate: string;
  scheduledTime?: string;
  assignedEngineer?: string;
}

export interface CreateDefectDto {
  ticketId: string;
  propertyCode: string;
  location: string;
  category: string;
  description: string;
  severity: 'Nhe' | 'Trung Binh' | 'Khan Cap';
  contractor: string;
  photoUrls?: string[];
}

export interface HandoverUseCase {
  getAllTickets(): Promise<HandoverTicketEntity[]>;
  getTicketById(id: string): Promise<HandoverTicketEntity>;
  createTicket(dto: CreateHandoverDto): Promise<HandoverTicketEntity>;
  updateTicketStatus(id: string, status: HandoverStatus): Promise<HandoverTicketEntity>;
  updatePinkBookStage(id: string, stage: PinkBookStage, bookNumber?: string): Promise<HandoverTicketEntity>;
  getChecklistTemplate(): ChecklistItem[];
  submitInspectionChecklist(id: string, checklist: ChecklistItem[]): Promise<HandoverTicketEntity>;
  addDefect(dto: CreateDefectDto): Promise<SnaggingDefectEntity>;
  updateDefectStatus(defectId: string, status: string): Promise<SnaggingDefectEntity>;
  signOffHandover(id: string, signedDate: string): Promise<HandoverTicketEntity>;
}
