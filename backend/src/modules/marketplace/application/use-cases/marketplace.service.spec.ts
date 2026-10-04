import { MarketplaceService } from './marketplace.service';
import { MarketplaceRepositoryPort } from '../ports/out/marketplace-repository.port';
import { MarketplaceListingEntity, AgencyPartnerEntity } from '../../domain/marketplace.entity';
import { NotFoundException } from '@nestjs/common';

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  let mockRepo: jest.Mocked<MarketplaceRepositoryPort>;

  const mockListing: MarketplaceListingEntity = {
    id: 'mkt-1',
    code: 'MKT-8801',
    title: 'Penthouse Aqua City view sông Đồng Nai',
    price: 18_500_000_000,
    priceFormatted: '18.5 Tỷ',
    commSplit: '50/50',
    f2Commission: '1.5%',
    f2CommissionRate: 1.5,
    type: 'Bán',
    propertyCategory: 'Căn hộ',
    location: 'Aqua City, Long Hưng, Biên Hòa',
    district: 'Biên Hòa',
    ownerAgency: 'Đại Lý F1 CenLand',
    verified: true,
    exclusive: true,
    coBrokeringStatus: 'OPEN',
  };

  const mockPartner: AgencyPartnerEntity = {
    id: 'agy-1',
    name: 'Công ty Cổ Phần BĐS Đất Xanh Miền Nam',
    code: 'AGY-001',
    tier: 'F1',
    phone: '0908112233',
    email: 'info@datxanh.vn',
    activeListingsCount: 42,
    successfulDealsCount: 18,
    totalCommissionShared: 540_000_000,
    rating: 4.9,
    verified: true,
    joinedDate: '2025-06-15',
  };

  beforeEach(() => {
    mockRepo = {
      findListings: jest.fn().mockResolvedValue([mockListing]),
      findListingById: jest.fn().mockResolvedValue(mockListing),
      createListing: jest.fn(),
      updateListingCoBrokeringStatus: jest.fn().mockResolvedValue(undefined),
      findAgencyPartners: jest.fn().mockResolvedValue([mockPartner]),
      createAgencyPartner: jest.fn(),
    };

    service = new MarketplaceService(mockRepo);
  });

  describe('requestCoBrokering', () => {
    it('gửi yêu cầu liên kết bán chéo 50/50 thành công và chuyển trạng thái sang NEGOTIATING', async () => {
      const result = await service.requestCoBrokering(
        'mkt-1',
        'Đại Lý F2 ERA Vietnam',
        'Khách VIP Hà Nội',
      );

      expect(result.success).toBe(true);
      expect(result.contractCode).toMatch(/^COBROKER-\d{4}-\d{4}$/);
      expect(mockRepo.updateListingCoBrokeringStatus).toHaveBeenCalledWith(
        'mkt-1',
        'NEGOTIATING',
      );
      expect(result.message).toContain('Co-brokering 50/50');
      expect(result.message).toContain('Đại Lý F1 CenLand');
    });

    it('báo lỗi NotFoundException khi sản phẩm không tồn tại', async () => {
      mockRepo.findListingById.mockResolvedValueOnce(null);

      await expect(
        service.requestCoBrokering(
          'non-existent',
          'Đại Lý F2',
          'Khách Mua',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getListings', () => {
    it('lấy danh sách sản phẩm và hỗ trợ lọc theo danh mục, loại giao dịch', async () => {
      const listings = await service.getListings('Căn hộ', 'Bán', true);

      expect(mockRepo.findListings).toHaveBeenCalledWith('Căn hộ', 'Bán', true);
      expect(listings.length).toBe(1);
      expect(listings[0].code).toBe('MKT-8801');
    });
  });
});
