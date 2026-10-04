import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { HandoverRepositoryPort } from '../../application/ports/out/handover-repository.port';
import { HandoverTicketEntity, SnaggingDefectEntity, PinkBookStage, HandoverStatus } from '../../domain/handover-ticket.entity';

@Injectable()
export class PrismaHandoverRepositoryAdapter implements HandoverRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapDefectToEntity(d: any): SnaggingDefectEntity {
    return {
      id: d.id,
      ticketId: d.ticketId,
      propertyCode: d.propertyCode,
      location: d.location,
      category: d.category,
      description: d.description,
      severity: d.severity as any,
      contractor: d.contractor,
      status: d.status as any,
      reportedDate: d.reportedDate,
      photoUrls: Array.isArray(d.photoUrls) ? d.photoUrls : [],
      resolvedDate: d.resolvedDate || undefined,
    };
  }

  private mapToEntity(record: any): HandoverTicketEntity {
    return new HandoverTicketEntity(
      record.id,
      record.code,
      record.contractId,
      record.propertyCode,
      record.projectId,
      record.projectName,
      record.customerId,
      record.customerName,
      record.customerPhone,
      record.customerEmail,
      record.propertyType,
      record.area,
      record.scheduledDate,
      record.scheduledTime,
      record.assignedEngineer,
      record.status as HandoverStatus,
      record.electricMeterIndex,
      record.waterMeterIndex,
      record.keysHandedOverCount,
      record.accessCardsCount,
      record.signedDate,
      record.signedByCustomer,
      record.signedByStaff,
      record.warrantyExpiryDate,
      record.pinkBookStage as PinkBookStage,
      record.pinkBookNumber,
      record.defectsCount,
      record.notes,
      Array.isArray(record.checklist) ? record.checklist : [],
      record.defects ? record.defects.map((d: any) => this.mapDefectToEntity(d)) : [],
    );
  }

  async findAll(): Promise<HandoverTicketEntity[]> {
    const list = await this.prisma.handoverTicket.findMany({
      include: { defects: true },
      orderBy: { createdAt: 'desc' },
    });
    return list.map(item => this.mapToEntity(item));
  }

  async findById(id: string): Promise<HandoverTicketEntity | null> {
    const record = await this.prisma.handoverTicket.findUnique({
      where: { id },
      include: { defects: true },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async findByCode(code: string): Promise<HandoverTicketEntity | null> {
    const record = await this.prisma.handoverTicket.findUnique({
      where: { code },
      include: { defects: true },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async save(ticket: HandoverTicketEntity): Promise<HandoverTicketEntity> {
    if (ticket.id) {
      const updated = await this.prisma.handoverTicket.update({
        where: { id: ticket.id },
        data: {
          status: ticket.status,
          signedDate: ticket.signedDate,
          signedByCustomer: ticket.signedByCustomer,
          signedByStaff: ticket.signedByStaff,
          warrantyExpiryDate: ticket.warrantyExpiryDate,
          pinkBookStage: ticket.pinkBookStage,
          pinkBookNumber: ticket.pinkBookNumber,
          notes: ticket.notes,
          defectsCount: ticket.defectsCount,
          checklist: ticket.checklist as any,
        },
        include: { defects: true },
      });
      return this.mapToEntity(updated);
    }

    const created = await this.prisma.handoverTicket.create({
      data: {
        code: ticket.code,
        contractId: ticket.contractId,
        propertyCode: ticket.propertyCode,
        projectId: ticket.projectId,
        projectName: ticket.projectName,
        customerId: ticket.customerId,
        customerName: ticket.customerName,
        customerPhone: ticket.customerPhone,
        customerEmail: ticket.customerEmail,
        propertyType: ticket.propertyType,
        area: ticket.area,
        scheduledDate: ticket.scheduledDate,
        scheduledTime: ticket.scheduledTime,
        assignedEngineer: ticket.assignedEngineer,
        status: ticket.status,
        pinkBookStage: ticket.pinkBookStage,
        checklist: ticket.checklist as any,
      },
      include: { defects: true },
    });
    return this.mapToEntity(created);
  }

  async updateStatus(id: string, status: HandoverStatus): Promise<HandoverTicketEntity> {
    const updated = await this.prisma.handoverTicket.update({
      where: { id },
      data: { status },
      include: { defects: true },
    });
    return this.mapToEntity(updated);
  }

  async updatePinkBook(id: string, stage: PinkBookStage, bookNumber?: string): Promise<HandoverTicketEntity> {
    const updated = await this.prisma.handoverTicket.update({
      where: { id },
      data: {
        pinkBookStage: stage,
        ...(bookNumber ? { pinkBookNumber: bookNumber } : {}),
      },
      include: { defects: true },
    });
    return this.mapToEntity(updated);
  }

  async addDefect(ticketId: string, defect: Omit<SnaggingDefectEntity, 'id'>): Promise<SnaggingDefectEntity> {
    const created = await this.prisma.snaggingDefect.create({
      data: {
        ticketId,
        propertyCode: defect.propertyCode,
        location: defect.location,
        category: defect.category,
        description: defect.description,
        severity: defect.severity,
        contractor: defect.contractor,
        status: defect.status,
        reportedDate: defect.reportedDate,
        photoUrls: defect.photoUrls as any,
      },
    });

    await this.prisma.handoverTicket.update({
      where: { id: ticketId },
      data: {
        defectsCount: { increment: 1 },
        status: 'co_loi_can_sua',
      },
    });

    return this.mapDefectToEntity(created);
  }

  async updateDefectStatus(defectId: string, status: string, resolvedDate?: string): Promise<SnaggingDefectEntity> {
    const updated = await this.prisma.snaggingDefect.update({
      where: { id: defectId },
      data: {
        status,
        ...(resolvedDate ? { resolvedDate } : {}),
      },
    });
    return this.mapDefectToEntity(updated);
  }

  async updateChecklist(id: string, checklist: any[]): Promise<HandoverTicketEntity> {
    const updated = await this.prisma.handoverTicket.update({
      where: { id },
      data: { checklist: checklist as any },
      include: { defects: true },
    });
    return this.mapToEntity(updated);
  }
}
