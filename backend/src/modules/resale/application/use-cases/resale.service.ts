import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ResaleUseCase, CreateResaleListingDto, CreateClientDemandDto, CloseDealDto } from '../ports/in/resale.use-case';
import { RESALE_REPOSITORY, ResaleRepositoryPort } from '../ports/out/resale-repository.port';
import { ResaleListingEntity, ResaleListingStatus } from '../../domain/resale-listing.entity';
import { ClientDemandEntity } from '../../domain/client-demand.entity';
import { MatchmakingEngine, MatchResult } from '../../domain/matchmaking-engine';

@Injectable()
export class ResaleService implements ResaleUseCase {
  constructor(
    @Inject(RESALE_REPOSITORY)
    private readonly repo: ResaleRepositoryPort,
  ) {}

  async getListings(type?: string, status?: string): Promise<ResaleListingEntity[]> {
    return await this.repo.findAllListings(type, status);
  }

  async getListingById(id: string): Promise<ResaleListingEntity> {
    const item = await this.repo.findListingById(id);
    if (!item) {
      throw new NotFoundException(`Không tìm thấy sản phẩm thứ cấp ID: ${id}`);
    }
    return item;
  }

  async createListing(dto: CreateResaleListingDto): Promise<ResaleListingEntity> {
    const rate = dto.commissionRate || 1.5;
    const commissionAmount = Math.round(dto.askingPrice * (rate / 100));

    const listing = new ResaleListingEntity(
      '',
      dto.listingCode,
      dto.type,
      dto.projectName,
      dto.propertyCode,
      dto.propertyType,
      dto.ownerName,
      dto.ownerPhone,
      Number(dto.area),
      Number(dto.bedrooms),
      Number(dto.bathrooms),
      dto.direction || null,
      Number(dto.askingPrice),
      dto.targetNetPrice ? Number(dto.targetNetPrice) : null,
      Number(rate),
      commissionAmount,
      dto.legalStatus || 'Sổ hồng riêng',
      dto.furnishedStatus || 'Nội thất cơ bản',
      dto.keyStatus || 'Chủ nhà giữ chìa',
      'active',
      dto.exclusiveContract || false,
      dto.exclusiveEndDate || null,
      0,
      0,
      0,
      dto.imageUrl || null,
      dto.coBrokerSplitRatio || 50.0,
    );

    return await this.repo.saveListing(listing);
  }

  async updateListingStatus(id: string, status: ResaleListingStatus): Promise<ResaleListingEntity> {
    return await this.repo.updateListingStatus(id, status);
  }

  async getDemands(): Promise<ClientDemandEntity[]> {
    return await this.repo.findAllDemands();
  }

  async createDemand(dto: CreateClientDemandDto): Promise<ClientDemandEntity> {
    const demand = new ClientDemandEntity(
      '',
      dto.clientName,
      dto.clientPhone,
      dto.demandType,
      dto.targetProjects,
      Number(dto.minPrice),
      Number(dto.maxPrice),
      Number(dto.bedrooms),
      dto.purpose,
      dto.urgency,
      dto.assignedAgent,
      0,
      null,
    );

    const savedDemand = await this.repo.saveDemand(demand);

    // Tự động chạy thuật toán ghép cặp AI ngay khi tạo nhu cầu
    const allListings = await this.repo.findAllListings(dto.demandType, 'active');
    const matches = MatchmakingEngine.matchDemandWithListings(savedDemand, allListings);

    if (matches.length > 0) {
      const topMatch = matches[0];
      await this.repo.updateDemandMatch(savedDemand.id, topMatch.score, topMatch.listing.listingCode);
      savedDemand.matchingScore = topMatch.score;
      savedDemand.suggestedListingCode = topMatch.listing.listingCode;
    }

    return savedDemand;
  }

  async matchDemandAi(demandId: string): Promise<MatchResult[]> {
    const demand = await this.repo.findDemandById(demandId);
    if (!demand) {
      throw new NotFoundException(`Không tìm thấy nhu cầu khách hàng: ${demandId}`);
    }

    const allListings = await this.repo.findAllListings(demand.demandType, 'active');
    const matches = MatchmakingEngine.matchDemandWithListings(demand, allListings);

    if (matches.length > 0) {
      await this.repo.updateDemandMatch(demandId, matches[0].score, matches[0].listing.listingCode);
    }

    return matches;
  }

  async calculateCoBroker(listingId: string, customAmount?: number): Promise<{ listingSide: number; sellingSide: number; total: number; ratio: string }> {
    const listing = await this.getListingById(listingId);
    const amount = customAmount !== undefined ? customAmount : listing.commissionAmount;
    const split = listing.calculateCoBrokerSplit(amount);
    return {
      listingSide: split.listingSide,
      sellingSide: split.sellingSide,
      total: amount,
      ratio: `${100 - listing.coBrokerSplitRatio}/${listing.coBrokerSplitRatio} (Bên Bán / Bên Mua)`,
    };
  }

  async closeDeal(dto: CloseDealDto): Promise<any> {
    const listing = await this.getListingById(dto.listingId);
    await this.repo.updateListingStatus(dto.listingId, 'closed');

    const totalCommission = dto.commissionAgent + dto.commissionCompany;
    const split = listing.calculateCoBrokerSplit(totalCommission);

    return {
      dealCode: `DEAL-${Date.now().toString().slice(-6)}`,
      listingId: dto.listingId,
      propertyCode: listing.propertyCode,
      projectName: listing.projectName,
      finalPrice: dto.finalPrice,
      depositAmount: dto.depositAmount,
      sellerName: dto.sellerName,
      buyerName: dto.buyerName,
      status: 'completed',
      coBrokerSplit: {
        totalCommission,
        listingAgentShare: split.listingSide,
        buyerAgentShare: split.sellingSide,
      },
      message: 'Chốt cọc thành công! Hoa hồng liên kết Co-brokering đã được phân bổ tự động 50/50.',
    };
  }
}
