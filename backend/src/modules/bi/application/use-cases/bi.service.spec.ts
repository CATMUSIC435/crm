import { BiService } from './bi.service';
import { BiRepositoryPort } from '../ports/out/bi-repository.port';

describe('BiService', () => {
  let service: BiService;
  let mockRepo: jest.Mocked<BiRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      findMetricByKey: jest.fn().mockResolvedValue(null),
      upsertMetric: jest.fn().mockResolvedValue(null as any),
      getInventoryAndRevenueStats: jest.fn().mockResolvedValue({
        targetRevenue: 100_000_000_000_000, // 100 nghìn tỷ
        actualRevenue: 60_000_000_000_000,  // 60 nghìn tỷ
        totalUnits: 10000,
        soldUnits: 7500,
        activeProjectsCount: 5,
      }),
    };

    service = new BiService(mockRepo);
  });

  describe('getMacroMetrics', () => {
    it('tính toán chính xác tiến độ thu tiền GDV và tỷ lệ hấp thụ rổ hàng', async () => {
      const metrics = await service.getMacroMetrics();

      expect(metrics.totalGDV).toBe(100_000_000_000_000);
      expect(metrics.totalRevenueCollected).toBe(60_000_000_000_000);
      expect(metrics.collectionProgressPercent).toBe(60.0); // 60 / 100 * 100
      expect(metrics.absorptionRatePercent).toBe(75.0); // 7500 / 10000 * 100
      expect(metrics.totalUnitsSold).toBe(7500);
      expect(metrics.totalUnitsInventory).toBe(10000);
      expect(metrics.totalActiveProjects).toBe(5);
    });
  });

  describe('getArimaForecast', () => {
    it('dự báo chuỗi thời gian ARIMA(1,1,1) trả về các điểm lịch sử và điểm dự phóng tương lai', async () => {
      const forecast = await service.getArimaForecast(8);

      expect(forecast.length).toBe(8);

      // Điểm lịch sử có actualRevenue
      const historyPoint = forecast[0];
      expect(historyPoint.month).toBe('Tháng 3/2026');
      expect(historyPoint.actualRevenue).toBeDefined();
      expect(historyPoint.confidence).toBe(0.95);

      // Điểm tương lai không có actualRevenue nhưng có predictedRevenue và dải biên độ
      const futurePoint = forecast[4];
      expect(futurePoint.month).toBe('Tháng 7/2026');
      expect(futurePoint.actualRevenue).toBeUndefined();
      expect(futurePoint.predictedRevenue).toBeGreaterThan(0);
      expect(futurePoint.upperBound).toBeGreaterThan(futurePoint.predictedRevenue);
      expect(futurePoint.lowerBound).toBeLessThan(futurePoint.predictedRevenue);
    });
  });

  describe('getTelesaleHeatmap', () => {
    it('tạo ma trận nhiệt 7 ngày x 7 khung giờ và xác định chính xác các khung giờ vàng', async () => {
      const heatmap = await service.getTelesaleHeatmap();

      // 7 ngày x 7 khung giờ = 49 ô
      expect(heatmap.length).toBe(49);

      // Kiểm tra có đầy đủ 7 ngày
      const days = new Set(heatmap.map((c) => c.dayOfWeek));
      expect(days.size).toBe(7);

      // Các ô giờ vàng trong tuần (Thứ 2 - Thứ 6 vào 09:30 - 11:30) phải có tỷ lệ kết nối cao > 80%
      const goldenHourCell = heatmap.find(
        (c) => c.dayOfWeek === 'Thứ 2' && c.hourSlot === '09:30 - 11:30',
      );
      expect(goldenHourCell).toBeDefined();
      expect(goldenHourCell!.connectedRate).toBeGreaterThanOrEqual(80);
      expect(goldenHourCell!.bookingConversionRate).toBeGreaterThanOrEqual(20);
    });
  });

  describe('getConversionFunnel', () => {
    it('trả về phễu chuyển đổi 5 giai đoạn với tỷ lệ rớt phễu hợp lý', async () => {
      const funnel = await service.getConversionFunnel();

      expect(funnel.length).toBe(5);
      expect(funnel[0].stage).toContain('Lead Quan Tâm');
      expect(funnel[4].stage).toContain('Ký Hợp Đồng');

      // Giai đoạn sau phải có số lượng nhỏ hơn hoặc bằng giai đoạn trước
      for (let i = 1; i < funnel.length; i++) {
        expect(funnel[i].count).toBeLessThanOrEqual(funnel[i - 1].count);
      }
    });
  });
});
