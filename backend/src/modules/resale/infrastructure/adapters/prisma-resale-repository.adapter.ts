import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { ResaleRepositoryPort } from '../../application/ports/out/resale-repository.port';
import { ResaleListingEntity, ResaleListingType, ResaleListingStatus } from '../../domain/resale-listing.entity';
import { ClientDemandEntity } from '../../domain/client-demand.entity';

@Injectable()
export class PrismaResaleRepositoryAdapter implements ResaleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapListingToEntity(r: any): ResaleListingEntity {
    return new ResaleListingEntity(
      r.id,
      r.listingCode,
      r.type as ResaleListingType,
      r.projectName,
      r.propertyCode,
      r.propertyType,
      r.ownerName,
      r.ownerPhone,
      Number(r.area),
      r.bedrooms,
      r.bathrooms,
      r.direction,
      Number(r.askingPrice),
      r.targetNetPrice ? Number(r.targetNetPrice) : null,
      r.commissionRate,
      Number(r.commissionAmount),
      r.legalStatus,
      r.furnishedStatus,
      r.keyStatus,
      r.status as ResaleListingStatus,
      r.exclusiveContract,
      r.exclusiveEndDate,
      r.viewCount,
      r.showingCount,
      r.matchedLeadsCount,
      r.imageUrl,
      r.coBrokerSplitRatio,
    );
  }

  private mapDemandToEntity(d: any): ClientDemandEntity {
    return new ClientDemandEntity(
      d.id,
      d.clientName,
      d.clientPhone,
      d.demandType as ResaleListingType,
      Array.isArray(d.targetProjects) ? d.targetProjects : [],
      Number(d.minPrice),
      Number(d.maxPrice),
      d.bedrooms,
      d.purpose,
      d.urgency,
      d.assignedAgent,
      d.matchingScore,
      d.suggestedListingCode,
    );
  }

  async findAllListings(type?: string, status?: string): Promise<ResaleListingEntity[]> {
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const list = await this.prisma.resaleListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return list.map(item => this.mapListingToEntity(item));
  }

  async findListingById(id: string): Promise<ResaleListingEntity | null> {
    const r = await this.prisma.resaleListing.findUnique({ where: { id } });
    return r ? this.mapListingToEntity(r) : null;
  }

  async findListingByCode(code: string): Promise<ResaleListingEntity | null> {
    const r = await this.prisma.resaleListing.findUnique({ where: { listingCode: code } });
    return r ? this.mapListingToEntity(r) : null;
  }

  async saveListing(listing: ResaleListingEntity): Promise<ResaleListingEntity> {
    const r = await this.prisma.resaleListing.create({
      data: {
        listingCode: listing.listingCode,
        type: listing.type,
        projectName: listing.projectName,
        propertyCode: listing.propertyCode,
        propertyType: listing.propertyType,
        ownerName: listing.ownerName,
        ownerPhone: listing.ownerPhone,
        area: listing.area,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        direction: listing.direction,
        askingPrice: listing.askingPrice,
        targetNetPrice: listing.targetNetPrice,
        commissionRate: listing.commissionRate,
        commissionAmount: listing.commissionAmount,
        legalStatus: listing.legalStatus,
        furnishedStatus: listing.furnishedStatus,
        keyStatus: listing.keyStatus,
        status: listing.status,
        exclusiveContract: listing.exclusiveContract,
        exclusiveEndDate: listing.exclusiveEndDate,
        imageUrl: listing.imageUrl,
        coBrokerSplitRatio: listing.coBrokerSplitRatio,
      },
    });
    return this.mapListingToEntity(r);
  }

  async updateListingStatus(id: string, status: ResaleListingStatus): Promise<ResaleListingEntity> {
    const r = await this.prisma.resaleListing.update({
      where: { id },
      data: { status },
    });
    return this.mapListingToEntity(r);
  }

  async findAllDemands(): Promise<ClientDemandEntity[]> {
    const list = await this.prisma.clientDemand.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map(item => this.mapDemandToEntity(item));
  }

  async findDemandById(id: string): Promise<ClientDemandEntity | null> {
    const d = await this.prisma.clientDemand.findUnique({ where: { id } });
    return d ? this.mapDemandToEntity(d) : null;
  }

  async saveDemand(demand: ClientDemandEntity): Promise<ClientDemandEntity> {
    const d = await this.prisma.clientDemand.create({
      data: {
        clientName: demand.clientName,
        clientPhone: demand.clientPhone,
        demandType: demand.demandType,
        targetProjects: demand.targetProjects as any,
        minPrice: demand.minPrice,
        maxPrice: demand.maxPrice,
        bedrooms: demand.bedrooms,
        purpose: demand.purpose,
        urgency: demand.urgency,
        assignedAgent: demand.assignedAgent,
        matchingScore: demand.matchingScore,
        suggestedListingCode: demand.suggestedListingCode,
      },
    });
    return this.mapDemandToEntity(d);
  }

  async updateDemandMatch(id: string, score: number, suggestedListingCode?: string): Promise<ClientDemandEntity> {
    const d = await this.prisma.clientDemand.update({
      where: { id },
      data: {
        matchingScore: score,
        suggestedListingCode,
      },
    });
    return this.mapDemandToEntity(d);
  }
}
