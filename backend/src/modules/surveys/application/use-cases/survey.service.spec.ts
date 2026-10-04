import { SurveyService } from './survey.service';
import { SurveyRepositoryPort } from '../ports/out/survey-repository.port';
import { SurveyCampaignEntity, SurveyFeedbackEntity } from '../../domain/survey.entity';

describe('SurveyService', () => {
  let service: SurveyService;
  let mockRepo: jest.Mocked<SurveyRepositoryPort>;

  const mockCampaigns: SurveyCampaignEntity[] = [
    {
      id: 'svy-1',
      code: 'SVY-101',
      name: 'Khảo sát sau nghiệm thu bàn giao',
      trigger: 'Sau khi nhận nhà',
      responsesCount: 45,
      conversion: '68%',
      status: 'active',
      channel: 'Zalo ZNS',
      targetAudience: 'Cư dân bàn giao',
      rewardPoints: 200,
      csatScore: 4.8,
      npsScore: 82,
      formUrl: null,
    },
    {
      id: 'svy-2',
      code: 'SVY-102',
      name: 'Khảo sát trải nghiệm VR 360',
      trigger: 'Sau khi xem sa bàn',
      responsesCount: 120,
      conversion: '45%',
      status: 'active',
      channel: 'Web App',
      targetAudience: 'Khách tham quan',
      rewardPoints: 100,
      csatScore: 4.6,
      npsScore: 74,
      formUrl: null,
    },
  ];

  const mockFeedbacks: SurveyFeedbackEntity[] = [
    {
      id: 'fb-1',
      campaignId: 'svy-1',
      customerName: 'Nguyễn Văn A',
      rating: 5,
      category: 'Bàn giao',
      sentiment: 'POSITIVE',
      comment: 'Căn hộ rất đẹp, đúng tiến độ',
      resolutionStatus: 'RESOLVED',
      createdAt: new Date(),
    },
    {
      id: 'fb-2',
      campaignId: 'svy-1',
      customerName: 'Trần Thị B',
      rating: 2,
      category: 'Bàn giao',
      sentiment: 'NEGATIVE',
      comment: 'Sơn nước phòng khách hơi lem nhem',
      resolutionStatus: 'OPEN',
      createdAt: new Date(),
    },
    {
      id: 'fb-3',
      campaignId: 'svy-2',
      customerName: 'Lê Văn C',
      rating: 3,
      category: 'Tư vấn',
      sentiment: 'NEUTRAL',
      comment: 'Tư vấn nhiệt tình nhưng tài liệu gửi hơi trễ',
      resolutionStatus: 'RESOLVED',
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    mockRepo = {
      findCampaigns: jest.fn().mockResolvedValue(mockCampaigns),
      createCampaign: jest.fn(),
      incrementCampaignResponses: jest.fn().mockResolvedValue(undefined),
      createFeedback: jest.fn().mockImplementation((dto, sentiment) => {
        return Promise.resolve({
          id: 'new-fb-id',
          ...dto,
          sentiment,
          resolutionStatus: 'RESOLVED',
          createdAt: new Date(),
        });
      }),
      findFeedbacks: jest.fn().mockResolvedValue(mockFeedbacks),
    };

    service = new SurveyService(mockRepo);
  });

  describe('submitFeedback', () => {
    it('đánh giá rating 5 sao phải được gán sentiment là POSITIVE', async () => {
      const result = await service.submitFeedback({
        campaignId: 'svy-1',
        customerName: 'Khách VIP',
        rating: 5,
        category: 'Tiện ích',
        comment: 'Hồ bơi rất sạch và đẹp',
      });

      expect(mockRepo.createFeedback).toHaveBeenCalledWith(
        expect.anything(),
        'POSITIVE',
      );
      expect(result.sentiment).toBe('POSITIVE');
      expect(mockRepo.incrementCampaignResponses).toHaveBeenCalledWith('svy-1');
    });

    it('đánh giá rating 1-2 sao phải được gán sentiment là NEGATIVE', async () => {
      const result = await service.submitFeedback({
        campaignId: 'svy-1',
        customerName: 'Khách Khiếu Nại',
        rating: 1,
        category: 'Vận hành',
        comment: 'Thang máy trục trặc giờ cao điểm',
      });

      expect(mockRepo.createFeedback).toHaveBeenCalledWith(
        expect.anything(),
        'NEGATIVE',
      );
      expect(result.sentiment).toBe('NEGATIVE');
    });

    it('đánh giá rating 3 sao phải được gán sentiment là NEUTRAL', async () => {
      const result = await service.submitFeedback({
        campaignId: 'svy-2',
        customerName: 'Khách Bình Thường',
        rating: 3,
        category: 'Tư vấn',
        comment: 'Tạm ổn',
      });

      expect(mockRepo.createFeedback).toHaveBeenCalledWith(
        expect.anything(),
        'NEUTRAL',
      );
      expect(result.sentiment).toBe('NEUTRAL');
    });
  });

  describe('getMetrics', () => {
    it('tính toán chính xác CSAT trung bình, tỷ lệ cảm xúc và điểm NPS', async () => {
      const metrics = await service.getMetrics();

      // ratings: 5, 2, 3 -> sum = 10, count = 3 -> avg = 3.3
      expect(metrics.totalResponses).toBe(3);
      expect(metrics.averageCSAT).toBe(3.3);
      expect(metrics.sentimentBreakdown.positive).toBe(1);
      expect(metrics.sentimentBreakdown.negative).toBe(1);
      expect(metrics.sentimentBreakdown.neutral).toBe(1);

      // NPS trung bình 2 chiến dịch: (82 + 74) / 2 = 78
      expect(metrics.averageNPS).toBe(78);

      // Phân bổ theo danh mục
      expect(metrics.categoryRatings['Bàn giao']).toBe(3.5); // (5 + 2) / 2
      expect(metrics.categoryRatings['Tư vấn']).toBe(3.0); // 3 / 1
    });
  });
});
