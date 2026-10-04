import { test, expect } from '@playwright/test';
import io from 'socket.io-client';

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';

test.describe('Giai Đoạn 3: PropTech 4.0, GIS, Panorama VR, Live Auction & AI Engine', () => {
  let authToken = '';

  test.beforeAll(async () => {
    // Đăng nhập tài khoản admin để lấy Bearer token kiểm thử các endpoint
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
  // 1. KIỂM THỬ KHÔNG GIAN BẢN ĐỒ GIS & QUY HOẠCH 1/500
  // -------------------------------------------------------------
  test('GIS: Truy vấn danh sách các lớp hạ tầng liên vùng (Metro, Vành Đai, Sân Bay)', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/gis/layers`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(2);

    const metroLayer = body.data.find((l: any) => l.code === 'metro-1');
    expect(metroLayer).toBeDefined();
    expect(metroLayer.category).toBe('TRANSPORT');
    expect(metroLayer.geoJson.type).toBe('LineString');
  });

  test('GIS: Truy vấn vị trí không gian và tọa độ ranh quy hoạch của các dự án', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/gis/projects`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(3);

    const p1 = body.data.find((p: any) => p.code === 'P01');
    expect(p1).toBeDefined();
    expect(p1.latitude).toBeGreaterThan(0);
    expect(p1.longitude).toBeGreaterThan(0);
  });

  test('GIS: Tính toán bán kính tiện ích không gian (Spatial Radius Query Haversine)', async () => {
    // Tọa độ Quận 1: 10.7601, 106.6948 - Bán kính 50km
    const res = await fetch(`${BACKEND_URL}/api/v1/gis/radius?lat=10.7601&lng=106.6948&radiusKm=50`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.totalFound).toBeGreaterThanOrEqual(1);
    expect(body.data.projects.length).toBeGreaterThanOrEqual(1);

    // Dự án gần nhất phải là The Grand Manhattan (cách < 2km)
    const closest = body.data.projects[0];
    expect(closest.distanceKm).toBeLessThan(5);
  });

  test('GIS: Tra cứu hồ sơ pháp lý chi tiết quy hoạch 1/500 dự án', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/gis/zoning/p1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.projectName).toBe('NovaWorld Phan Thiet');
    expect(body.data.decisionNumber).toContain('QĐ số 1826/QĐ-UBND');
    expect(body.data.scale).toContain('1.000 Hecta');
    expect(body.data.farCoefficient).toBe('1.2 lần');
  });

  // -------------------------------------------------------------
  // 2. KIỂM THỬ SA BÀN ẢO VR 360 & ĐIỂM CHẠM HOTSPOTS 3D
  // -------------------------------------------------------------
  test('Panorama: Lấy danh mục các căn hộ có dữ liệu Sa bàn VR 360', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/panorama/tours`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);

    const tour = body.data[0];
    expect(tour.unitCode).toBe('NVW-01.01');
    expect(tour.totalRooms).toBeGreaterThanOrEqual(1);
  });

  test('Panorama: Lấy chi tiết không gian 3D, cổng teleport và điểm chạm vật liệu', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/panorama/tours/p1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.rooms).toBeDefined();
    expect(body.data.rooms.length).toBeGreaterThanOrEqual(1);

    const livingRoom = body.data.rooms.find((r: any) => r.id === 'p1-living');
    expect(livingRoom).toBeDefined();
    expect(livingRoom.measurements.area).toContain('m²');
    expect(livingRoom.specs.length).toBeGreaterThanOrEqual(1);
    expect(livingRoom.specs[0].brand).toBe('Poltrona Frau');
  });

  test('Panorama: Gắn thêm điểm chạm Hotspot 3D mới vào phòng căn hộ', async () => {
    const newHotspot = {
      position: [1.2, 0.8, -2.5],
      title: 'Hệ Thống Rèm Tự Động Somfy Pháp',
      subtitle: 'Smart Motorized Curtains',
      brand: 'Somfy',
      origin: 'Cluses, France',
      warranty: '5 năm chính hãng',
      description: 'Điều khiển bằng giọng nói và cảm biến ánh sáng mặt trời.',
    };

    const res = await fetch(`${BACKEND_URL}/api/v1/panorama/tours/p1/rooms/p1-living/hotspots`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newHotspot),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.totalHotspots).toBeGreaterThanOrEqual(2);
  });

  // -------------------------------------------------------------
  // 3. KIỂM THỬ PHÒNG ĐẤU GIÁ LIVE BI-DIRECTIONAL & KÝ QUỸ ESCROW
  // -------------------------------------------------------------
  test('Auction: Lấy danh sách các phiên đấu giá và chi tiết phòng', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/auctions`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);

    const room = body.data[0];
    expect(room.code).toBe('AUC-101');
    expect(room.status).toBe('LIVE');
    expect(Number(room.currentBid)).toBeGreaterThan(0);
  });

  test('Auction: Nộp tiền ký quỹ bảo đảm tham gia đấu giá (Escrow Deposit)', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/auctions/AUC-101/escrow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bidderId: 'usr-admin-001',
        bidderName: 'Lê Hoàng Anh',
        depositAmount: 500000000,
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('HELD');
    expect(body.data.transactionRef).toContain('ESCROW');
  });

  test('Auction: Đặt giá thầu mới hợp lệ qua REST API', async () => {
    // Lấy giá hiện tại
    const roomRes = await fetch(`${BACKEND_URL}/api/v1/auctions/AUC-101`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const roomData = await roomRes.json();
    const nextBid = Number(roomData.data.currentBid) + Number(roomData.data.bidStep);

    const bidRes = await fetch(`${BACKEND_URL}/api/v1/auctions/AUC-101/bid`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bidderId: 'usr-admin-001',
        bidderName: 'Nguyễn V*** T***',
        amount: nextBid,
      }),
    });
    expect(bidRes.status).toBe(201);
    const bidData = await bidRes.json();
    expect(bidData.success).toBe(true);
    expect(Number(bidData.data.amount)).toBe(nextBid);
    expect(bidData.data.isWinningBid).toBe(true);
  });

  test('Auction: Kết nối WebSocket và nhận sự kiện gõ búa (bid_placed) theo thời gian thực', async () => {
    // Lấy giá hiện tại của phòng AUC-101 để tính targetBid hợp lệ
    const roomRes = await fetch(`${BACKEND_URL}/api/v1/auctions/AUC-101`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const roomData = await roomRes.json();
    const targetBid = Number(roomData.data.currentBid) + Number(roomData.data.bidStep);

    const receivedEvent = await new Promise((resolve, reject) => {
      const socket = io(`${BACKEND_URL}/ws/auction`, {
        transports: ['websocket'],
        timeout: 6000,
      });

      const timer = setTimeout(() => {
        socket.disconnect();
        reject(new Error('WebSocket timeout waiting for bid_placed event'));
      }, 5000);

      socket.on('connect', () => {
        socket.emit('join_room', { roomId: 'AUC-101' });

        // Sau khi join room, phát 1 lượt đặt giá mới
        setTimeout(() => {
          socket.emit('place_bid', {
            auctionId: 'AUC-101',
            bidderId: 'usr-admin-001',
            bidderName: 'Môi Giới Vàng',
            amount: targetBid,
          });
        }, 300);
      });

      socket.on('bid_placed', (eventData) => {
        clearTimeout(timer);
        socket.disconnect();
        resolve(eventData);
      });

      socket.on('bid_error', (err) => {
        clearTimeout(timer);
        socket.disconnect();
        reject(new Error(`WebSocket Bid Error: ${err.message}`));
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timer);
        socket.disconnect();
        reject(err);
      });
    });

    expect(receivedEvent).toBeDefined();
    expect((receivedEvent as any).auctionId).toBe('AUC-101');
    expect((receivedEvent as any).currentBid).toBe(targetBid);
  });


  // -------------------------------------------------------------
  // 4. KIỂM THỬ TRÍ TUỆ NHÂN TẠO OCR (DOCUMENT-AI)
  // -------------------------------------------------------------
  test('Document-AI: Bóc tách dữ liệu CCCD gắn chip với độ tin cậy cao', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/document-ai/scan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docType: 'cccd',
        sampleId: 'sample1',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.fields.idNumber).toBe('079085012345');
    expect(body.data.fields.fullName).toBe('NGUYỄN VĂN TUẤN');
    expect(body.data.confidences.idNumber).toBe('99.9%');
  });

  test('Document-AI: Xác thực KYC kiểm tra số CCCD 12 số chuẩn Bộ Công An', async () => {
    // 1. Quét tạo bản ghi
    const scanRes = await fetch(`${BACKEND_URL}/api/v1/document-ai/scan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docType: 'cccd',
        sampleId: 'sample2',
      }),
    });
    const scanData = await scanRes.json();
    const docId = scanData.data.id;

    // 2. Gọi xác thực KYC
    const verifyRes = await fetch(`${BACKEND_URL}/api/v1/document-ai/${docId}/verify-kyc`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(verifyRes.status).toBe(201);
    const verifyData = await verifyRes.json();
    expect(verifyData.success).toBe(true);
    expect(verifyData.data.record.isValid).toBe(true);
    expect(verifyData.data.record.verifiedAt).toBeDefined();
  });

  test('Document-AI: Lấy lịch sử quét tài liệu OCR', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/document-ai/history`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  // -------------------------------------------------------------
  // 5. KIỂM THỬ TRỢ LÝ AI RAG KHO TRI THỨC BĐS (AI-KNOWLEDGE)
  // -------------------------------------------------------------
  test('AI-Knowledge: Trợ lý RAG giải đáp chính sách bán hàng và chiết khấu thanh toán', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/ai-knowledge/ask`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'Chính sách bán hàng và chiết khấu thanh toán sớm tại NovaWorld?',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.confidence).toBeGreaterThan(90);
    expect(body.data.answer).toContain('thanh toán');
    expect(body.data.sources.length).toBeGreaterThanOrEqual(1);
    expect(body.data.suggestedQuestions.length).toBeGreaterThanOrEqual(1);
  });

  test('AI-Knowledge: Trợ lý RAG giải đáp quy trình giữ chỗ và khóa căn SLA 15 phút', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/ai-knowledge/ask`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'Thời hạn giữ chỗ căn hộ và quy định đặt cọc booking là bao lâu?',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.answer).toContain('15 phút');
  });

  test('AI-Knowledge: Lấy danh mục tài liệu tri thức RAG theo phân loại', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/ai-knowledge/documents`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(3);

    const categories = body.data.map((d: any) => d.category);
    expect(categories).toContain('policy');
  });

  // -------------------------------------------------------------
  // 6. KIỂM THỬ CHI TIẾT GIAO DIỆN FRONTEND GIAI ĐOẠN 3 (UI E2E)
  // -------------------------------------------------------------

  // MODULE 13: BẢN ĐỒ QUY HOẠCH & LỚP ĐẤT GIS (/gis)
  test('P3-01. GIS: Bản đồ không gian, NLP Search động, Tra cứu Pháp lý 1/500 Modal z-[1000]', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/gis`, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra tiêu đề và bộ lọc lớp hạ tầng
    await expect(page.locator('h1:has-text("GIS")').or(page.locator('text=Bản Đồ Số Quy Hoạch')).first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Tuyến Metro Số 1').first()).toBeVisible();

    // 2. Tìm kiếm động bằng ô NLP Search
    const searchInput = page.locator('input[placeholder*="Chat tìm kiếm không gian"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Aqua City');
    await page.waitForTimeout(400);

    // 3. Mở Modal Tra cứu Quy hoạch 1/500
    const zoningBtn = page.locator('button:has-text("Tra Cứu Quy Hoạch 1/500")').first();
    await expect(zoningBtn).toBeVisible({ timeout: 10000 });
    await zoningBtn.click();

    // 4. Kiểm tra Modal mở và có z-[1000]
    const modal = page.locator('div.fixed.inset-0.z-\\[1000\\]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toContainText(/Quy Hoạch Chi Tiết 1\/500/i);
    await expect(modal).toContainText(/Hồ Sơ Quy Hoạch Chi Tiết 1\/500 & Pháp Lý Đất Đai/i);

    // 5. Đóng modal bằng nút X
    const closeBtn = modal.locator('button:has(svg.lucide-x)').first();
    await closeBtn.click();
    await expect(modal).toBeHidden({ timeout: 4000 });
  });

  // MODULE 14: SA BÀN ẢO & VR 360 TOUR (/panorama)
  test('P3-02. Panorama: VR 360 Viewer, Đổi phòng, Modal Đặt Cọc Khóa Căn z-[1000] tạo Ticket động', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/panorama`, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra không gian VR
    await expect(page.locator('h1:has-text("Virtual Tour 360")').or(page.locator('text=Sa Bàn Số 3D')).first()).toBeVisible({ timeout: 15000 });

    // 2. Mở Modal Đặt cọc giữ chỗ tức thì (Instant Booking)
    const instantBookingBtn = page.locator('button:has-text("Giữ Căn Ngay")').first();
    await expect(instantBookingBtn).toBeVisible({ timeout: 8000 });
    await instantBookingBtn.click();

    // 3. Kiểm tra Modal mở và có z-[1000]
    const modal = page.locator('div.fixed.inset-0.z-\\[1000\\]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toContainText(/Giữ Căn & Khóa Chỗ Tức Thì/i);

    // 4. Chọn số tiền đặt cọc và bấm xác nhận
    const depositOption = modal.locator('button:has-text("100.000.000 VNĐ")').first();
    if (await depositOption.isVisible()) {
      await depositOption.click();
    }

    // 5. Submit form đặt cọc
    const submitBtn = modal.locator('button:has-text("Xác Nhận Giữ Chỗ")').first();
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
    await submitBtn.click();

    // 6. Modal đóng lại sau khi hoàn tất
    await expect(modal).toBeHidden({ timeout: 5000 });
  });

  // MODULE 15: ỨNG DỤNG DI ĐỘNG & PWA (/mobile)
  test('P3-03. Mobile: Trải nghiệm PWA iPhone Mockup, Chế độ Offline và Modal Hẹn Giờ Bắn Tin z-[1000]', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/mobile`, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra giao diện mô phỏng iPhone và PWA
    await expect(page.locator('h1:has-text("Trạm Di Động PWA")').or(page.locator('text=Field Hub')).first()).toBeVisible({ timeout: 15000 });

    // 2. Mở Modal Hẹn Giờ Bắn Push Notification
    const scheduleBtn = page.locator('button:has-text("Hẹn Giờ Bắn Tin")').first();
    await expect(scheduleBtn).toBeVisible({ timeout: 8000 });
    await scheduleBtn.click();

    // 3. Kiểm tra Modal mở và có z-[1000]
    const modal = page.locator('div.fixed.inset-0.z-\\[1000\\]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toContainText(/Lập Lịch Hẹn Giờ Bắn Push Notification/i);

    // 4. Đóng modal
    const closeBtn = modal.locator('button:has-text("Đóng"), button:has(svg.lucide-x)').first();
    await closeBtn.click();
    await expect(modal).toBeHidden({ timeout: 4000 });
  });

  // MODULE 16: QUẢN TRỊ NỘI DUNG CMS & CHUẨN SEO BĐS (/cms)
  test('P3-04. CMS: Tính điểm SEO thời gian thực, Soạn bài viết mới với dữ liệu động Date.now()', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/cms`, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra tiêu đề trang CMS
    await expect(page.locator('h1:has-text("CMS")').or(page.locator('text=Hệ Thống Quản Trị Nội Dung')).first()).toBeVisible({ timeout: 15000 });

    // 2. Kiểm tra thanh điểm SEO Simulator động
    const seoTitleInput = page.locator('input[value*="Aqua City"]').first();
    if (await seoTitleInput.isVisible()) {
      await seoTitleInput.fill('Bảng giá Aqua City Đồng Nai mới nhất năm 2026 chiết khấu siêu khủng');
      await page.waitForTimeout(300);
      // Điểm SEO phản hồi động
      await expect(page.locator('text=Điểm SEO Onpage TB').or(page.locator('text=/ 100')).first()).toBeVisible();
    }

    // 3. Mở Modal Soạn Bài Viết Mới
    const createBtn = page.locator('button:has-text("Soạn Thảo Bài Viết Mới"), button:has-text("Thêm Bài Mới")').first();
    await expect(createBtn).toBeVisible({ timeout: 8000 });
    await createBtn.click();

    // 4. Kiểm tra Modal mở (Dialog với z-[1000])
    const dialog = page.locator('div[role="dialog"]:not([data-nextjs-dialog])').first();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText(/Soạn Thảo & Đăng Bài Viết Mới/i);

    // 5. Nhập dữ liệu bài viết động (tránh dữ liệu tĩnh)
    const dynamicTitle = `Dự án Biệt thự Aqua City Đảo Phượng Hoàng ${Date.now()}`;
    const titleInput = dialog.locator('input[placeholder*="Ví dụ: Phân tích"]').first();
    await titleInput.fill(dynamicTitle);

    const excerptInput = dialog.locator('textarea[placeholder*="Tóm tắt ngắn gọn"]').first();
    await excerptInput.fill('Phân tích chi tiết quy hoạch và khả năng tăng giá bất động sản ven sông tại Đồng Nai năm 2026.');

    // 6. Submit xuất bản bài viết
    const submitBtn = dialog.locator('button[type="submit"]:has-text("Xuất Bản Bài Viết")').first();
    await submitBtn.click();

    // 7. Modal tự động đóng
    await expect(dialog).toBeHidden({ timeout: 5000 });

    // 8. Bài viết mới xuất hiện ngay trong danh sách articles
    await expect(page.locator(`text=${dynamicTitle}`).first()).toBeVisible({ timeout: 8000 });
  });

  // MODULE 17: SỰ KIỆN MỞ BÁN & CHECK-IN QR (/events)
  test('P3-05. Events: Cấp vé VIP mới với mã động Date.now(), Check-in QR hiển thị Pop-up Đón Tiếp z-[1000]', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/events`, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // 1. Kiểm tra tiêu đề và KPIs
    await expect(page.locator('h1:has-text("Sự Kiện Mở Bán")').or(page.locator('text=Check-in QR')).first()).toBeVisible({ timeout: 15000 });

    // 2. Mở Modal Cấp Vé Mời Mới
    const addGuestBtn = page.locator('button:has-text("Thêm Khách Mời")').first();
    await expect(addGuestBtn).toBeVisible({ timeout: 8000 });
    await addGuestBtn.click();

    // 3. Kiểm tra Modal mở
    const dialog = page.locator('div[role="dialog"]:not([data-nextjs-dialog])').first();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText(/Thêm Khách Mời & Cấp Vé QR/i);

    // 4. Nhập dữ liệu khách động
    const dynamicGuest = `Đại Gia BĐS ${Date.now().toString().slice(-4)}`;
    const dynamicPhone = `0912${Date.now().toString().slice(-6)}`;
    await dialog.locator('input[placeholder="Nguyễn Văn A"]').first().fill(dynamicGuest);
    await dialog.locator('input[placeholder="0901 234 567"]').first().fill(dynamicPhone);

    // 5. Submit tạo vé
    const submitBtn = dialog.locator('button[type="submit"]:has-text("Cấp Vé & Lưu Khách")').first();
    await submitBtn.click();
    await expect(dialog).toBeHidden({ timeout: 5000 });

    // 6. Giả lập Quét mã Check-in khách VIP (VVIP-888)
    const quickVipBtn = page.locator('button:has-text("VVIP-888")').first();
    if (await quickVipBtn.isVisible()) {
      await quickVipBtn.click();

      // 7. Pop-up Đón tiếp khách VVIP hiển thị
      const welcomeModal = page.locator('div[role="dialog"]:not([data-nextjs-dialog])').first();
      await expect(welcomeModal).toBeVisible({ timeout: 6000 });
      await expect(welcomeModal).toContainText(/CHECK-IN CONFIRMED|CHÀO MỪNG QUÝ KHÁCH/i);

      // Đóng modal chào đón
      const closeWelcome = welcomeModal.locator('button:has-text("Dẫn Khách Vào Bàn"), button:has-text("In Thẻ Đeo")').first();
      if (await closeWelcome.isVisible()) {
        await closeWelcome.click();
      }
    }
  });

  // MODULE 18: TỔNG ĐÀI AI & VOICE AGENT BĐS (/call-center)
  test('P3-06. Call Center: Bàn phím số Softphone, Quay số gọi điện, Ghi chú Disposition kết thúc cuộc gọi', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/call-center`, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra giao diện Softphone
    await expect(page.locator('h1:has-text("Tổng Đài")').or(page.locator('text=VoIP Cloud')).first()).toBeVisible({ timeout: 15000 });

    // 2. Điền số điện thoại bằng nút Thử số mẫu
    const sampleBtn = page.locator('button[title="Thử số mẫu"]').first();
    await expect(sampleBtn).toBeVisible({ timeout: 8000 });
    await sampleBtn.click();

    // 3. Bấm Bắt Đầu Cuộc Gọi
    const callBtn = page.locator('button[title="Bắt đầu gọi"]').first();
    await expect(callBtn).toBeVisible({ timeout: 5000 });
    await callBtn.click();

    // 4. Kiểm tra trạng thái đang đàm thoại & nút kết thúc
    const endCallBtn = page.locator('button[title="Kết thúc cuộc gọi"]').first();
    await expect(endCallBtn).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000); // Đàm thoại 1 giây

    // 5. Kết thúc cuộc gọi -> tự động mở Modal Ghi chú Disposition
    await endCallBtn.click();

    // 6. Modal Disposition hiển thị
    const dispModal = page.locator('div[role="dialog"]:not([data-nextjs-dialog])').first();
    await expect(dispModal).toBeVisible({ timeout: 5000 });
    await expect(dispModal).toContainText(/Kết Quả/i);

    // 7. Nhập ghi chú đàm thoại động và Lưu kết quả
    const notesInput = dispModal.locator('textarea').first();
    if (await notesInput.isVisible()) {
      await notesInput.fill(`Khách hàng quan tâm căn Shophouse The Global City ${Date.now()}`);
    }

    const saveDispBtn = dispModal.locator('button:has-text("Lưu Kết Quả & Hoàn Tất Cuộc Gọi")').first();
    await saveDispBtn.click();
    await expect(dispModal).toBeHidden({ timeout: 5000 });

    // 8. Chuyển sang Tab Nhật Ký Lịch Sử & Kiểm tra cuộc gọi vừa thực hiện
    const historyTab = page.locator('button[role="tab"]:has-text("Nhật Ký & Bóc Băng Hội Thoại"), [role="tab"]:has-text("Nhật Ký")').first();
    if (await historyTab.isVisible()) {
      await historyTab.click();
      await expect(page.locator('text=Nguyễn Văn A').or(page.locator('text=0909 123 456')).first()).toBeVisible({ timeout: 6000 });
    }
  });
});

