import { LoyaltyService } from './loyalty.service';
import { LoyaltyRepositoryPort } from '../ports/out/loyalty-repository.port';
import { PrismaService } from '../../../../database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { LoyaltyVoucherEntity, LoyaltyTransactionEntity } from '../../domain/voucher.entity';

describe('LoyaltyService', () => {
  let service: LoyaltyService;
  let mockRepo: jest.Mocked<LoyaltyRepositoryPort>;
  let mockPrisma: any;

  const mockCustomer = {
    id: 'cust-1',
    fullName: 'Lê Hoàng Nam',
    phone: '0901234567',
    email: 'nam.le@example.com',
  };

  const mockVoucher: LoyaltyVoucherEntity = {
    id: 'vch-1',
    code: 'VCH-NOVA-500',
    title: 'Voucher Nghỉ Dưỡng Centara Mirage 5 Sao',
    points: 1500,
    iconName: 'Gift',
    color: 'emerald',
    category: 'resort',
    description: 'Nghỉ dưỡng 2N1Đ villa hướng biển',
    expiryDate: '2026-12-31',
    stock: 10,
    terms: 'Áp dụng ngày thường',
  };

  beforeEach(() => {
    mockRepo = {
      findVouchers: jest.fn(),
      findVoucherById: jest.fn().mockResolvedValue(mockVoucher),
      createVoucher: jest.fn(),
      decrementVoucherStock: jest.fn().mockResolvedValue(undefined),
      getCustomerPointsBalance: jest.fn().mockResolvedValue(5000),
      findTransactions: jest.fn().mockResolvedValue([]),
      createTransaction: jest.fn().mockImplementation((tx) =>
        Promise.resolve({
          id: 'tx-new-id',
          createdAt: new Date(),
          ...tx,
        }),
      ),
    };

    mockPrisma = {
      customer: {
        findUnique: jest.fn().mockResolvedValue(mockCustomer),
      },
    };

    service = new LoyaltyService(mockRepo, mockPrisma as PrismaService);
  });

  describe('redeemVoucher', () => {
    it('đổi voucher thành công khi số dư điểm lớn hơn hoặc bằng điểm yêu cầu', async () => {
      const result = await service.redeemVoucher({
        voucherId: 'vch-1',
        customerId: 'cust-1',
      });

      expect(result.success).toBe(true);
      expect(mockRepo.decrementVoucherStock).toHaveBeenCalledWith('vch-1');
      expect(mockRepo.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'REDEEM',
          points: -1500,
          balanceAfter: 3500, // 5000 - 1500
        }),
      );
    });

    it('báo lỗi BadRequestException khi số dư điểm không đủ', async () => {
      mockRepo.getCustomerPointsBalance.mockResolvedValueOnce(500); // Chỉ có 500 điểm

      await expect(
        service.redeemVoucher({
          voucherId: 'vch-1',
          customerId: 'cust-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('báo lỗi BadRequestException khi voucher đã hết lượt đổi (stock = 0)', async () => {
      mockRepo.findVoucherById.mockResolvedValueOnce({
        ...mockVoucher,
        stock: 0,
      });

      await expect(
        service.redeemVoucher({
          voucherId: 'vch-1',
          customerId: 'cust-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('báo lỗi NotFoundException khi voucher không tồn tại', async () => {
      mockRepo.findVoucherById.mockResolvedValueOnce(null);

      await expect(
        service.redeemVoucher({
          voucherId: 'non-existent',
          customerId: 'cust-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('awardPoints', () => {
    it('cộng điểm giao dịch BĐS và tạo giao dịch EARN chính xác', async () => {
      const result = await service.awardPoints({
        customerId: 'cust-1',
        points: 2000,
        description: 'Tích điểm ký HĐMB căn hộ NVW-01.01',
        referenceCode: 'HD-2026-001',
      });

      expect(mockRepo.createTransaction).toHaveBeenCalledWith({
        customerId: 'cust-1',
        customerName: 'Lê Hoàng Nam',
        customerPhone: '0901234567',
        type: 'EARN',
        points: 2000,
        balanceAfter: 7000, // 5000 + 2000
        description: 'Tích điểm ký HĐMB căn hộ NVW-01.01',
        referenceCode: 'HD-2026-001',
      });
      expect(result.points).toBe(2000);
      expect(result.balanceAfter).toBe(7000);
    });
  });

  describe('getMemberProfile', () => {
    it('xác định đúng hạng thẻ DIAMOND khi tích lũy trên 50.000 điểm', async () => {
      mockRepo.findTransactions.mockResolvedValueOnce([
        {
          id: 'tx-1',
          customerId: 'cust-1',
          customerName: 'Lê Hoàng Nam',
          type: 'EARN',
          points: 55000,
          balanceAfter: 55000,
          description: 'Giao dịch biệt thự',
          createdAt: new Date(),
        },
      ]);

      const profile = await service.getMemberProfile('cust-1');
      expect(profile.tier).toBe('DIAMOND');
      expect(profile.totalPointsEarned).toBe(55000);
    });

    it('xác định đúng hạng thẻ PLATINUM khi tích lũy từ 25.000 đến 49.999 điểm', async () => {
      mockRepo.findTransactions.mockResolvedValueOnce([
        {
          id: 'tx-1',
          customerId: 'cust-1',
          customerName: 'Lê Hoàng Nam',
          type: 'EARN',
          points: 30000,
          balanceAfter: 30000,
          description: 'Giao dịch Shophouse',
          createdAt: new Date(),
        },
      ]);

      const profile = await service.getMemberProfile('cust-1');
      expect(profile.tier).toBe('PLATINUM');
    });
  });
});
