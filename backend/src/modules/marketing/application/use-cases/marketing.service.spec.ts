import { MarketingService } from './marketing.service';
import { MarketingRepositoryPort } from '../ports/out/marketing-repository.port';
import { MarketingCampaignEntity } from '../../domain/campaign.entity';
import { NotFoundException } from '@nestjs/common';

describe('MarketingService', () => {
  let service: MarketingService;
  let mockRepo: jest.Mocked<MarketingRepositoryPort>;

  const mockCampaigns: MarketingCampaignEntity[] = [
    {
      id: 'c1',
      code: 'c1',
      name: 'Lead Gen - Grand Manhattan (T12)',
      platform: 'Facebook',
      status: 'Active',
      budget: 50_000_000,
      spent: 12_500_000,
      leads: 50,
      clicks: 1000,
      conversions: 20,
      startDate: '2026-01-01',
      targetCPL: 250_000,
      routingRule: 'top_seller',
      assignedTeam: 'Team Luxury Alpha',
    },
    {
      id: 'c2',
      code: 'c2',
      name: 'Search Ads - Aqua City',
      platform: 'Google',
      status: 'Active',
      budget: 30_000_000,
      spent: 15_000_000,
      leads: 50,
      clicks: 1500,
      conversions: 30,
      startDate: '2026-01-10',
      targetCPL: 300_000,
      routingRule: 'round_robin',
      assignedTeam: 'Team Aqua',
    },
  ];

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn().mockResolvedValue(mockCampaigns),
      findById: jest.fn().mockImplementation((id: string) => {
        const found = mockCampaigns.find((c) => c.id === id);
        return Promise.resolve(found || null);
      }),
      create: jest.fn(),
      updateStatus: jest.fn(),
      incrementLeads: jest.fn().mockImplementation((id: string, count: number) => {
        const found = mockCampaigns.find((c) => c.id === id);
        if (!found) return Promise.resolve(null);
        return Promise.resolve({ ...found, leads: found.leads + count });
      }),
    };

    service = new MarketingService(mockRepo);
  });

  describe('getMetrics', () => {
    it('tính toán chính xác chỉ số tổng ngân sách, chi phí CPL trung bình và tỷ lệ chuyển đổi', async () => {
      const metrics = await service.getMetrics();

      expect(metrics.totalBudget).toBe(80_000_000);
      expect(metrics.totalSpent).toBe(27_500_000);
      expect(metrics.totalLeads).toBe(100);
      expect(metrics.totalClicks).toBe(2500);
      expect(metrics.totalConversions).toBe(50);

      // CPL = 27,500,000 / 100 = 275,000 VNĐ
      expect(metrics.averageCPL).toBe(275_000);

      // Conversion Rate = 50 / 2500 * 100 = 2.0%
      expect(metrics.averageConversionRate).toBe(2.0);

      // Phân bổ nền tảng
      expect(metrics.platformDistribution['Facebook'].count).toBe(1);
      expect(metrics.platformDistribution['Facebook'].leads).toBe(50);
      expect(metrics.platformDistribution['Google'].count).toBe(1);
      expect(metrics.platformDistribution['Google'].leads).toBe(50);
    });
  });

  describe('getCampaignById', () => {
    it('trả về chiến dịch nếu tồn tại', async () => {
      const campaign = await service.getCampaignById('c1');
      expect(campaign).toBeDefined();
      expect(campaign!.name).toContain('Grand Manhattan');
    });

    it('ném ngoại lệ NotFoundException nếu chiến dịch không tồn tại', async () => {
      await expect(service.getCampaignById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('recordLeadIngestion', () => {
    it('tăng số lượng leads khi có webhook lead mới từ Landing Page / Facebook Lead Ads', async () => {
      const updated = await service.recordLeadIngestion('c1', 5);
      expect(updated.leads).toBe(55); // 50 + 5
      expect(mockRepo.incrementLeads).toHaveBeenCalledWith('c1', 5);
    });
  });
});
