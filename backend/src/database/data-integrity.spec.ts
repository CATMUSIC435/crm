import { PrismaClient } from '@prisma/client';

describe('Database Data Integrity & Seed Verification (PostgreSQL 16)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Phân Hệ Người Dùng & Quyền Hạn (Auth & RBAC)', () => {
    it('phải có tài khoản Quản trị viên tối cao (admin@novacrm.com) với role SUPER_ADMIN', async () => {
      const admin = await prisma.user.findUnique({
        where: { email: 'admin@novacrm.com' },
      });

      expect(admin).toBeDefined();
      expect(admin?.role).toBe('SUPER_ADMIN');
      expect(admin?.fullName).toBe('Lê Hoàng Anh (Admin)');
      expect(admin?.is2FAEnabled).toBeDefined();
    });

    it('phải có các tài khoản nhân sự với đầy đủ các vai trò vận hành', async () => {
      const users = await prisma.user.findMany();
      expect(users.length).toBeGreaterThanOrEqual(4);

      const roles = users.map((u) => u.role);
      expect(roles).toContain('SUPER_ADMIN');
      expect(roles).toContain('DIRECTOR');
      expect(roles).toContain('AGENT');
    });
  });

  describe('2. Phân Hệ Dự Án & Bảng Hàng (Projects & Inventory)', () => {
    it('phải có ít nhất 4 đại dự án chiến lược được mở bán', async () => {
      const projects = await prisma.project.findMany();
      expect(projects.length).toBeGreaterThanOrEqual(4);

      const names = projects.map((p) => p.name);
      expect(names.some((n) => n.includes('NovaWorld'))).toBe(true);
      expect(names.some((n) => n.includes('Aqua City'))).toBe(true);
      expect(names.some((n) => n.includes('Grand Manhattan'))).toBe(true);
    });

    it('phải có danh mục căn hộ tồn kho với giá bán và mã căn hợp lệ', async () => {
      const units = await prisma.inventoryItem.findMany();
      expect(units.length).toBeGreaterThanOrEqual(4);

      for (const u of units) {
        expect(u.code).toBeDefined();
        expect(Number(u.price)).toBeGreaterThan(0);
        expect(u.area).toBeGreaterThan(0);
      }
    });
  });

  describe('3. Phân Hệ Khách Hàng 360 (Customers)', () => {
    it('phải có hồ sơ khách hàng định danh với số điện thoại và email', async () => {
      const customers = await prisma.customer.findMany();
      expect(customers.length).toBeGreaterThanOrEqual(3);

      for (const c of customers) {
        expect(c.fullName).toBeDefined();
        expect(c.phone).toBeDefined();
      }
    });
  });

  describe('4. Giai Đoạn 5: Chiến Dịch Tiếp Thị (Marketing Campaigns)', () => {
    it('phải có các chiến dịch quảng cáo đa nền tảng (Facebook, Google, TikTok, Zalo)', async () => {
      const campaigns = await prisma.marketingCampaign.findMany();
      expect(campaigns.length).toBeGreaterThanOrEqual(3);

      const platforms = campaigns.map((c) => c.platform);
      expect(platforms).toContain('Facebook');
      expect(platforms).toContain('Google');

      for (const c of campaigns) {
        expect(Number(c.budget)).toBeGreaterThan(0);
        expect(c.status).toBeDefined();
        expect(c.routingRule).toBeDefined();
      }
    });
  });

  describe('5. Giai Đoạn 5: Khách Hàng Thân Thiết NovaClub (Loyalty)', () => {
    it('phải có kho Voucher ưu đãi nghỉ dưỡng, golf, spa với điểm thưởng hợp lệ', async () => {
      const vouchers = await prisma.loyaltyVoucher.findMany();
      expect(vouchers.length).toBeGreaterThanOrEqual(3);

      for (const v of vouchers) {
        expect(v.code).toMatch(/^VCH-/);
        expect(v.points).toBeGreaterThan(0);
        expect(v.stock).toBeGreaterThan(0);
      }
    });
  });

  describe('6. Giai Đoạn 5: Thi Đua Kinh Doanh & Đua Top (Gamification)', () => {
    it('phải có danh sách Quests nhiệm vụ hàng ngày cho chuyên viên', async () => {
      const quests = await prisma.gamificationQuest.findMany();
      expect(quests.length).toBeGreaterThanOrEqual(3);

      for (const q of quests) {
        expect(q.title).toBeDefined();
        expect(q.max).toBeGreaterThan(0);
        expect(q.exp).toBeGreaterThan(0);
      }
    });

    it('phải có bộ danh hiệu Badges với cấp độ hiếm', async () => {
      const badges = await prisma.gamificationBadge.findMany();
      expect(badges.length).toBeGreaterThanOrEqual(2);

      for (const b of badges) {
        expect(b.name).toBeDefined();
        expect(b.rarity).toBeDefined();
        expect(b.bonusExp).toBeGreaterThan(0);
      }
    });
  });

  describe('7. Giai Đoạn 5: Sàn Liên Kết Đại Lý F1/F2 (Marketplace B2B)', () => {
    it('phải có sản phẩm liên sàn với chính sách phân chia hoa hồng Co-brokering 50/50', async () => {
      const listings = await prisma.marketplaceListing.findMany();
      expect(listings.length).toBeGreaterThanOrEqual(2);

      for (const l of listings) {
        expect(l.code).toMatch(/^MKT-/);
        expect(Number(l.price)).toBeGreaterThan(0);
        expect(l.commSplit).toBe('50/50');
        expect(l.ownerAgency).toBeDefined();
      }
    });

    it('phải có danh bạ đại lý đối tác Agency Partners đã xác thực', async () => {
      const partners = await prisma.agencyPartner.findMany();
      expect(partners.length).toBeGreaterThanOrEqual(1);

      for (const p of partners) {
        expect(p.name).toBeDefined();
        expect(p.code).toMatch(/^AGY-/);
        expect(p.tier).toBeDefined();
        expect(p.verified).toBe(true);
      }
    });
  });

  describe('8. Giai Đoạn 5: Khảo Sát NPS/CSAT (Surveys)', () => {
    it('phải có chiến dịch khảo sát điểm chạm và chỉ số NPS/CSAT', async () => {
      const campaigns = await prisma.surveyCampaign.findMany();
      expect(campaigns.length).toBeGreaterThanOrEqual(1);

      for (const c of campaigns) {
        expect(c.code).toBeDefined();
        expect(c.csatScore).toBeGreaterThan(0);
        expect(c.npsScore).toBeGreaterThan(0);
      }
    });
  });

  describe('9. Giai Đoạn 5: Hệ Sinh Thái Ứng Dụng & ERP (Integrations)', () => {
    it('phải có các cổng tích hợp cốt lõi (VietQR, SmartCA, MISA AMIS, Zalo ZNS)', async () => {
      const apps = await prisma.integrationApp.findMany();
      expect(apps.length).toBeGreaterThanOrEqual(4);

      const appCodes = apps.map((a) => a.appCode);
      expect(appCodes).toContain('vietqr');
      expect(appCodes).toContain('smartca');
      expect(appCodes).toContain('misa_erp');
      expect(appCodes).toContain('zalo_zns');

      for (const a of apps) {
        expect(a.name).toBeDefined();
        expect(a.provider).toBeDefined();
        expect(a.connected).toBe(true);
      }
    });
  });
});
