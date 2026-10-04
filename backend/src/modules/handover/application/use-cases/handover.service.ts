import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { HandoverUseCase, CreateHandoverDto, CreateDefectDto } from '../ports/in/handover.use-case';
import { HANDOVER_REPOSITORY, HandoverRepositoryPort } from '../ports/out/handover-repository.port';
import { HandoverTicketEntity, SnaggingDefectEntity, PinkBookStage, HandoverStatus } from '../../domain/handover-ticket.entity';
import { FIFTY_TECHNICAL_CHECKLIST_CRITERIA, ChecklistItem } from '../../domain/checklist-template';

@Injectable()
export class HandoverService implements HandoverUseCase {
  constructor(
    @Inject(HANDOVER_REPOSITORY)
    private readonly handoverRepo: HandoverRepositoryPort,
  ) {}

  async getAllTickets(): Promise<HandoverTicketEntity[]> {
    return await this.handoverRepo.findAll();
  }

  async getTicketById(id: string): Promise<HandoverTicketEntity> {
    const ticket = await this.handoverRepo.findById(id);
    if (!ticket) {
      throw new NotFoundException(`Không tìm thấy hồ sơ bàn giao với ID: ${id}`);
    }
    return ticket;
  }

  async createTicket(dto: CreateHandoverDto): Promise<HandoverTicketEntity> {
    const defaultChecklist: ChecklistItem[] = FIFTY_TECHNICAL_CHECKLIST_CRITERIA.map(c => ({
      ...c,
      isPassed: true,
    }));

    const ticket = new HandoverTicketEntity(
      '',
      dto.code,
      dto.contractId || null,
      dto.propertyCode,
      dto.projectId || null,
      dto.projectName,
      dto.customerId || null,
      dto.customerName,
      dto.customerPhone || null,
      dto.customerEmail || null,
      dto.propertyType,
      dto.area,
      dto.scheduledDate,
      dto.scheduledTime || null,
      dto.assignedEngineer || null,
      'cho_hen',
      null,
      null,
      0,
      0,
      null,
      false,
      false,
      null,
      'tiep_nhan_ho_so',
      null,
      0,
      null,
      defaultChecklist,
      [],
    );

    return await this.handoverRepo.save(ticket);
  }

  async updateTicketStatus(id: string, status: HandoverStatus): Promise<HandoverTicketEntity> {
    return await this.handoverRepo.updateStatus(id, status);
  }

  async updatePinkBookStage(id: string, stage: PinkBookStage, bookNumber?: string): Promise<HandoverTicketEntity> {
    return await this.handoverRepo.updatePinkBook(id, stage, bookNumber);
  }

  getChecklistTemplate(): ChecklistItem[] {
    return FIFTY_TECHNICAL_CHECKLIST_CRITERIA.map(c => ({
      ...c,
      isPassed: false,
    }));
  }

  async submitInspectionChecklist(id: string, checklist: ChecklistItem[]): Promise<HandoverTicketEntity> {
    const ticket = await this.getTicketById(id);
    const failedItems = checklist.filter(item => !item.isPassed);
    const newStatus: HandoverStatus = failedItems.length > 0 ? 'co_loi_can_sua' : 'da_ban_giao';

    await this.handoverRepo.updateStatus(id, newStatus);
    return await this.handoverRepo.updateChecklist(id, checklist);
  }

  async addDefect(dto: CreateDefectDto): Promise<SnaggingDefectEntity> {
    const defect = await this.handoverRepo.addDefect(dto.ticketId, {
      ticketId: dto.ticketId,
      propertyCode: dto.propertyCode,
      location: dto.location,
      category: dto.category,
      description: dto.description,
      severity: dto.severity,
      contractor: dto.contractor,
      status: 'Dang Xu Ly',
      reportedDate: new Date().toISOString().split('T')[0],
      photoUrls: dto.photoUrls || [],
    });
    return defect;
  }

  async updateDefectStatus(defectId: string, status: string): Promise<SnaggingDefectEntity> {
    const resolvedDate = status === 'Da Khac Phuc' ? new Date().toISOString().split('T')[0] : undefined;
    return await this.handoverRepo.updateDefectStatus(defectId, status, resolvedDate);
  }

  async signOffHandover(id: string, signedDate: string): Promise<HandoverTicketEntity> {
    const ticket = await this.getTicketById(id);
    ticket.signHandover(signedDate);
    return await this.handoverRepo.save(ticket);
  }
}
