import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';

test.describe('Giai Đoạn 4: Vận Hành Đô Thị, Nghiệm Thu Bàn Giao, Thị Trường Thứ Cấp & Quản Lý Gia Sản VIP', () => {
  let authToken = '';

  test.beforeAll(async () => {
    // Đăng nhập tài khoản admin để lấy Bearer token kiểm thử
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@novacrm.com', password: 'password123' }),
    });
    expect(res.ok).toBeTruthy();
    const data = await res.json();
    authToken = data.data.accessToken;
    expect(authToken).toBeTruthy();
  });

  // -------------------------------------------------------------
  // 1. MODULE 1: BÀN GIAO & QUẢN LÝ KHIẾM KHUYẾT SNAGGING DEFECT
  // -------------------------------------------------------------
  test('Handover: Truy vấn danh sách hồ sơ nghiệm thu bàn giao', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/handover/tickets`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(3);

    const ticket1 = body.data.find((t: any) => t.code === 'HO-2026-001');
    expect(ticket1).toBeDefined();
    expect(ticket1.projectName).toBe('NovaWorld Phan Thiet');
    expect(ticket1.status).toBe('da_ban_giao');
    expect(['da_in_phoi_so', 'da_trao_so']).toContain(ticket1.pinkBookStage);
  });

  test('Handover: Lấy danh mục 50 tiêu chí kỹ thuật nghiệm thu tiêu chuẩn đại đô thị', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/handover/checklist-template`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBe(50);

    // Kiểm tra đủ 5 phân hệ chuyên môn
    const categories = new Set(body.data.map((c: any) => c.category));
    expect(categories.has('KIEN_TRUC')).toBe(true);
    expect(categories.has('ME')).toBe(true);
    expect(categories.has('CAP_THOAT_NUOC')).toBe(true);
    expect(categories.has('NOI_THAT')).toBe(true);
    expect(categories.has('PCCC')).toBe(true);
  });

  test('Handover: Khởi tạo hồ sơ bàn giao căn hộ mới & ghi nhận lỗi snagging', async () => {
    const uniqueCode = `HO-${Date.now().toString().slice(-6)}`;
    const createRes = await fetch(`${BACKEND_URL}/api/v1/handover/tickets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: uniqueCode,
        contractId: 'HD-TEST-401',
        propertyCode: 'NVW-TEST.01',
        projectName: 'NovaWorld Phan Thiet',
        customerName: 'Kiểm Thử Viên Handover',
        customerPhone: '0911223344',
        propertyType: 'Biệt thự song lập',
        area: 180,
        scheduledDate: '2026-08-15',
        assignedEngineer: 'KS. Hoàng Nam (Ban QLDA)',
      }),
    });
    expect(createRes.status).toBe(201);
    const ticket = await createRes.json();
    expect(ticket.data.code).toBe(uniqueCode);

    // Khai báo khiếm khuyết snagging
    const defectRes = await fetch(`${BACKEND_URL}/api/v1/handover/defects`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId: ticket.data.id,
        propertyCode: 'NVW-TEST.01',
        location: 'Khu vực bồn tắm Master',
        category: 'Thiết bị vệ sinh',
        description: 'Vòi sen tắm đứng áp lực nước chưa đạt chuẩn 2.5 bar',
        severity: 'Trung Binh',
        contractor: 'Nhà thầu Cơ điện Ree M&E',
      }),
    });
    expect(defectRes.status).toBe(201);
    const defect = await defectRes.json();
    expect(defect.data.status).toBe('Dang Xu Ly');

    // Cập nhật trạng thái khắc phục lỗi
    const updateDefectRes = await fetch(`${BACKEND_URL}/api/v1/handover/defects/${defect.data.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Da Khac Phuc' }),
    });
    expect(updateDefectRes.status).toBe(200);
    const updatedDefect = await updateDefectRes.json();
    expect(updatedDefect.data.status).toBe('Da Khac Phuc');
    expect(updatedDefect.data.resolvedDate).toBeDefined();
  });

  test('Handover: Cập nhật tiến độ cấp Sổ Hồng qua 5 giai đoạn pháp lý & Ký số biên bản', async () => {
    // Cập nhật lên giai đoạn trao sổ hồng
    const pbRes = await fetch(`${BACKEND_URL}/api/v1/handover/tickets/ho-ticket-1/pink-book`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'da_trao_so',
        pinkBookNumber: 'CN-892147/BThuan-TRAOSO',
      }),
    });
    expect(pbRes.status).toBe(200);
    const pbData = await pbRes.json();
    expect(pbData.data.pinkBookStage).toBe('da_trao_so');
    expect(pbData.data.pinkBookNumber).toBe('CN-892147/BThuan-TRAOSO');

    // Ký số biên bản nhận nhà
    const signRes = await fetch(`${BACKEND_URL}/api/v1/handover/tickets/ho-ticket-1/sign-off`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ signedDate: '2026-10-03' }),
    });
    expect(signRes.status).toBe(201);
    const signData = await signRes.json();
    expect(signData.data.signedByCustomer).toBe(true);
    expect(signData.data.signedByStaff).toBe(true);
  });

  // -------------------------------------------------------------
  // 2. MODULE 2: VẬN HÀNH ĐÔ THỊ, THU PHÍ DỊCH VỤ & THI CÔNG NỘI THẤT
  // -------------------------------------------------------------
  test('Operations: Thu phí dịch vụ quản lý & đối soát VietQR Pro 24/7', async () => {
    const billsRes = await fetch(`${BACKEND_URL}/api/v1/operations/bills`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(billsRes.status).toBe(200);
    const bills = await billsRes.json();
    expect(bills.data.length).toBeGreaterThanOrEqual(3);

    // Phát hành hóa đơn mới
    const billCode = `INV-2026-${Date.now().toString().slice(-4)}`;
    const createBillRes = await fetch(`${BACKEND_URL}/api/v1/operations/bills`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        billCode,
        month: '08/2026',
        propertyCode: 'AQC-12A.01',
        projectName: 'Aqua City',
        residentName: 'Vũ Thu Trang',
        residentPhone: '0966554433',
        managementFee: 2880000,
        parkingFee: 1200000,
        utilitiesFee: 950000,
        dueDate: '2026-08-25',
      }),
    });
    expect(createBillRes.status).toBe(201);
    const newBill = await createBillRes.json();
    expect(Number(newBill.data.totalAmount)).toBe(5030000);
    expect(newBill.data.status).toBe('cho_thanh_toan');

    // Thanh toán đối soát tức thì qua VietQR IPN
    const payRes = await fetch(`${BACKEND_URL}/api/v1/operations/bills/${newBill.data.id}/pay`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod: 'VietQR Pro 24/7' }),
    });
    expect(payRes.status).toBe(201);
    const paidBill = await payRes.json();
    expect(paidBill.data.status).toBe('da_thanh_toan');
    expect(paidBill.data.paymentMethod).toBe('VietQR Pro 24/7');
  });

  test('Operations: Luồng phê duyệt giấy phép thi công nội thất & nghiệm thu hoàn cọc', async () => {
    const permitRes = await fetch(`${BACKEND_URL}/api/v1/operations/permits`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyCode: 'TGM-18.04',
        residentName: 'Phạm Minh Tuấn',
        contractorName: 'Delta Luxury Interior',
        workersCount: 8,
        startDate: '2026-08-10',
        endDate: '2026-10-10',
        depositAmount: 100000000,
        notes: 'Thi công cải tạo cách âm phòng xem phim gia đình',
      }),
    });
    expect(permitRes.status).toBe(201);
    const permit = await permitRes.json();
    expect(permit.data.status).toBe('cho_duyet');

    // Phê duyệt thi công
    const approveRes = await fetch(`${BACKEND_URL}/api/v1/operations/permits/${permit.data.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'dang_thi_cong' }),
    });
    expect(approveRes.status).toBe(200);
    const approved = await approveRes.json();
    expect(approved.data.status).toBe('dang_thi_cong');

    // Nghiệm thu hoàn cọc
    const refundRes = await fetch(`${BACKEND_URL}/api/v1/operations/permits/${permit.data.id}/refund`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(refundRes.status).toBe(201);
    const refunded = await refundRes.json();
    expect(refunded.data.depositRefunded).toBe(true);
  });

  test('Operations: Đặt chỗ tiện ích Clubhouse & Check-in QR Code cư dân', async () => {
    const bkgRes = await fetch(`${BACKEND_URL}/api/v1/operations/amenities/bookings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amenityType: 'Sân Pickleball VIP',
        propertyCode: 'NVW-01.01',
        residentName: 'Nguyễn Văn Tuấn',
        bookingDate: '2026-08-20',
        timeSlot: '07:00 - 09:00',
        guestsCount: 4,
      }),
    });
    expect(bkgRes.status).toBe(201);
    const bkg = await bkgRes.json();
    expect(bkg.data.status).toBe('da_xac_nhan');

    // Check-in
    const checkinRes = await fetch(`${BACKEND_URL}/api/v1/operations/amenities/bookings/${bkg.data.id}/checkin`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(checkinRes.status).toBe(201);
    const checked = await checkinRes.json();
    expect(checked.data.status).toBe('da_checkin');
  });

  // -------------------------------------------------------------
  // 3. MODULE 3: THỊ TRƯỜNG THỨ CẤP, CO-BROKERING & AI MATCHMAKING
  // -------------------------------------------------------------
  test('Resale: Ký gửi rổ hàng thứ cấp & Tính tỷ lệ hoa hồng liên kết Co-brokering 50/50', async () => {
    const listRes = await fetch(`${BACKEND_URL}/api/v1/resale/listings`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(listRes.status).toBe(200);
    const listings = await listRes.json();
    expect(listings.data.length).toBeGreaterThanOrEqual(2);

    const first = listings.data[0];
    const coBrokerRes = await fetch(`${BACKEND_URL}/api/v1/resale/listings/${first.id}/co-broker`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(coBrokerRes.status).toBe(200);
    const split = await coBrokerRes.json();
    expect(split.data.ratio).toContain('50/50');
    expect(split.data.listingSide + split.data.sellingSide).toBe(split.data.total);
  });

  test('Resale: Đăng ký nhu cầu khách hàng & Thuật toán AI Ghép Cặp (AI Matchmaking Engine)', async () => {
    const demandRes = await fetch(`${BACKEND_URL}/api/v1/resale/demands`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Bà Nguyễn Thị Ngọc Giàu',
        clientPhone: '0909887766',
        demandType: 'resale',
        targetProjects: ['The Grand Manhattan'],
        minPrice: 17000000000,
        maxPrice: 19500000000,
        bedrooms: 3,
        purpose: 'Ở thực',
        urgency: 'Cần gấp trong tuần 🔥',
        assignedAgent: 'Trần Văn Giám Đốc',
      }),
    });
    expect(demandRes.status).toBe(201);
    const demand = await demandRes.json();
    expect(demand.data.clientName).toBe('Bà Nguyễn Thị Ngọc Giàu');
    expect(demand.data.matchingScore).toBeGreaterThanOrEqual(90);

    // Kích hoạt ghép cặp AI
    const matchRes = await fetch(`${BACKEND_URL}/api/v1/resale/demands/${demand.data.id}/match-ai`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(matchRes.status).toBe(201);
    const matches = await matchRes.json();
    expect(Array.isArray(matches.data)).toBe(true);
    expect(matches.data.length).toBeGreaterThanOrEqual(1);

    const topMatch = matches.data[0];
    expect(topMatch.score).toBeGreaterThanOrEqual(90);
    expect(topMatch.listing.projectName).toBe('The Grand Manhattan');
  });

  test('Resale: Chốt cọc giao dịch thứ cấp & ghi nhận chia hoa hồng liên kết', async () => {
    const listingsRes = await fetch(`${BACKEND_URL}/api/v1/resale/listings`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const listings = await listingsRes.json();
    const targetListing = listings.data[0];

    const closeRes = await fetch(`${BACKEND_URL}/api/v1/resale/close-deal`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: targetListing.id,
        dealType: 'resale',
        finalPrice: targetListing.askingPrice,
        depositAmount: 500000000,
        sellerName: targetListing.ownerName,
        buyerName: 'Khách Mua Thứ Cấp VIP',
        buyerPhone: '0919998877',
        commissionAgent: 100000000,
        commissionCompany: 100000000,
      }),
    });
    expect(closeRes.status).toBe(201);
    const closeBody = await closeRes.json();
    expect(closeBody.data.status).toBe('completed');
    expect(closeBody.data.coBrokerSplit.listingAgentShare).toBe(100000000);
    expect(closeBody.data.coBrokerSplit.buyerAgentShare).toBe(100000000);
  });

  // -------------------------------------------------------------
  // 4. MODULE 4: QUẢN LÝ GIA SẢN VIP & ĐỘNG CƠ PHÂN TÍCH TÀI CHÍNH
  // -------------------------------------------------------------
  test('Portfolio: Báo cáo vĩ mô danh mục VIP (Macro Wealth Summary: IRR, CAGR, Yield)', async () => {
    const summaryRes = await fetch(`${BACKEND_URL}/api/v1/portfolio/summary`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(summaryRes.status).toBe(200);
    const summary = await summaryRes.json();
    expect(summary.data.totalAssetsCount).toBeGreaterThanOrEqual(3);
    expect(summary.data.totalInitialInvestment).toBeGreaterThan(0);
    expect(summary.data.totalCurrentPortfolioValue).toBeGreaterThan(summary.data.totalInitialInvestment);
    expect(summary.data.totalUnrealizedCapitalGain).toBeGreaterThan(0);
    expect(summary.data.averageIrr).toBeGreaterThan(10);
    expect(summary.data.averageCagr).toBeGreaterThan(10);
    expect(summary.data.averageRentalYield).toBeGreaterThan(1);
  });

  test('Portfolio: Định giá lại tài sản (Revaluation) & Tự động tính toán lại IRR / CAGR', async () => {
    const assetsRes = await fetch(`${BACKEND_URL}/api/v1/portfolio/assets`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const assets = await assetsRes.json();
    const asset = assets.data[0];

    // Cập nhật định giá mới tăng thêm 2 tỷ VNĐ
    const newValuation = Number(asset.currentValuation) + 2000000000;
    const revalRes = await fetch(`${BACKEND_URL}/api/v1/portfolio/assets/${asset.id}/valuation`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ valuation: newValuation }),
    });
    expect(revalRes.status).toBe(200);
    const reval = await revalRes.json();
    expect(Number(reval.data.currentValuation)).toBe(newValuation);
    expect(reval.data.irr).toBeGreaterThan(0);
    expect(reval.data.cagr).toBeGreaterThan(0);
  });

  test('Portfolio: Mô phỏng kịch bản chốt lời tái đầu tư (Exit Scenario Analysis)', async () => {
    const assetsRes = await fetch(`${BACKEND_URL}/api/v1/portfolio/assets`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const assets = await assetsRes.json();
    const asset = assets.data[0];

    const simRes = await fetch(`${BACKEND_URL}/api/v1/portfolio/assets/${asset.id}/simulate-exit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ additionalYears: 3, annualGrowthRate: 10.0 }),
    });
    expect(simRes.status).toBe(201);
    const sim = await simRes.json();
    expect(sim.data.holdingYears).toBe(3);
    expect(sim.data.projectedAnnualGrowthRate).toBe(10.0);
    expect(sim.data.projectedValuation).toBeGreaterThan(Number(asset.currentValuation));
    expect(sim.data.totalNetRoi).toBeGreaterThan(30);
    expect(sim.data.projectedIrr).toBeGreaterThan(10);
  });

  // -------------------------------------------------------------
  // 5. KIỂM THỬ TRẢI NGHIỆM GIAO DIỆN FRONTEND GIAI ĐOẠN 4 (UI E2E)
  // -------------------------------------------------------------
  test('UI Frontend: Tải và tương tác Bàn Giao & Nghiệm Thu Khiếm Khuyết (/handover)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/handover`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/handover/);

    await expect(page.locator('body')).toContainText(/Bàn Giao Bất Động Sản|Nghiệm Thu|HO-2026/i, { timeout: 15000 });
  });

  test('UI Frontend: Tải và tương tác Vận Hành Đô Thị & Dịch Vụ Cư Dân (/operations)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/operations`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/operations/);

    await expect(page.locator('body')).toContainText(/Quản Trị Vận Hành|Dịch Vụ Cư Dân|Phí Quản Lý/i, { timeout: 15000 });
  });

  test('UI Frontend: Tải và tương tác Sàn Ký Gửi & Thị Trường Thứ Cấp (/resale)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/resale`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/resale/);

    await expect(page.locator('body')).toContainText(/Sàn Ký Gửi|Thị Trường Thứ Cấp|KGB-/i, { timeout: 15000 });
  });

  test('UI Frontend: Tải và tương tác Quản Lý Gia Sản VIP & Danh Mục BĐS (/portfolio)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/portfolio`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/portfolio/);

    await expect(page.locator('body')).toContainText(/Quản Lý Gia Sản|Danh Mục BĐS VIP|Wealth/i, { timeout: 15000 });
  });
});
