import { test, expect } from '@playwright/test';
import { io, Socket } from 'socket.io-client';

test.describe.serial('KIỂM TRA CHUYÊN SÂU GIAI ĐOẠN 2 (BOOKING SLA, CONTRACTS E-SIGN, VIETQR IPN & REALTIME WS)', () => {

  let adminToken: string;
  let managerToken: string;
  let directorToken: string;
  let accountantToken: string;
  let agentToken: string;

  test.beforeAll(async ({ request }) => {
    // 1. Token SUPER_ADMIN
    const adminRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(adminRes.status()).toBe(200);
    adminToken = ((await adminRes.json()).data || (await adminRes.json())).accessToken;

    // 2. Token TEAM_LEADER (Trưởng phòng)
    const managerRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'manager@novacrm.com', password: 'password123' },
    });
    expect(managerRes.status()).toBe(200);
    managerToken = ((await managerRes.json()).data || (await managerRes.json())).accessToken;

    // 3. Token DIRECTOR (Giám đốc)
    const directorRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'director@novacrm.com', password: 'password123' },
    });
    expect(directorRes.status()).toBe(200);
    directorToken = ((await directorRes.json()).data || (await directorRes.json())).accessToken;

    // 4. Token ACCOUNTANT (Kế toán)
    const accountantRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'accountant@novacrm.com', password: 'password123' },
    });
    expect(accountantRes.status()).toBe(200);
    accountantToken = ((await accountantRes.json()).data || (await accountantRes.json())).accessToken;

    // 5. Token AGENT (Chuyên viên Môi giới)
    const agentRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'agent@novacrm.com', password: 'password123' },
    });
    expect(agentRes.status()).toBe(200);
    agentToken = ((await agentRes.json()).data || (await agentRes.json())).accessToken;
  });

  // =========================================================================
  // PHẦN 1: QUY TRÌNH BOOKING GIỮ CHỖ & KHÓA CĂN ĐA CẤP (BOOKING WORKFLOW)
  // =========================================================================

  let createdBookingId: string;
  let createdBookingCode: string;
  const testUnitId = 'unit-phase2-' + Date.now();

  test('1.1. Booking: Môi giới khởi tạo phiếu giữ chỗ mới & kích hoạt SLA đếm ngược 15 phút', async ({ request }) => {
    const res = await request.post('http://localhost:4000/api/v1/bookings', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        unitId: testUnitId,
        customerId: 'c1',
        projectId: 'p1',
        depositAmount: 100000000,
        bookingType: 'Giữ chỗ có hoàn lại',
        priority: 'high',
        notes: 'Khách hàng VIP chốt căn sau khi khảo sát thực địa',
        paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    const data = body.data || body;

    expect(data.id).toBeDefined();
    expect(data.code).toContain('BK-');
    expect(data.stage).toBe('INIT_SALE');
    expect(data.expiresAt).toBeDefined();

    // Kiểm tra thời gian đếm ngược xấp xỉ 15 phút (900.000 ms)
    const expiresTime = new Date(data.expiresAt).getTime();
    const diffMinutes = (expiresTime - Date.now()) / (60 * 1000);
    expect(diffMinutes).toBeGreaterThan(13);
    expect(diffMinutes).toBeLessThanOrEqual(16);

    createdBookingId = data.id;
    createdBookingCode = data.code;
  });

  test('1.2. Booking: Chống tranh chấp căn hộ (Distributed Locking) khi căn đang có phiếu hiệu lực', async ({ request }) => {
    // Môi giới khác cố tình tạo phiếu đè lên căn hộ testUnitId đang giữ chỗ
    const res = await request.post('http://localhost:4000/api/v1/bookings', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        unitId: testUnitId,
        customerId: 'c2',
        projectId: 'p1',
        depositAmount: 100000000,
        bookingType: 'Giữ chỗ có hoàn lại',
      },
    });

    // Hệ thống chặn lại với mã lỗi 409 Conflict
    expect(res.status()).toBe(409);
    const body = await res.json();
    const message = body.error?.message || body.message;
    expect(message).toContain('hiện đang có giao dịch giữ chỗ còn hiệu lực');
  });

  test('1.3. Booking: Luồng phê duyệt hồ sơ 3 cấp bậc (Trưởng phòng ➔ Giám đốc ➔ Kế toán)', async ({ request }) => {
    // Cấp 1: Trưởng phòng kinh doanh duyệt hồ sơ
    const step1Res = await request.patch(`http://localhost:4000/api/v1/bookings/${createdBookingId}/approve`, {
      headers: { Authorization: `Bearer ${managerToken}` },
      data: { comment: 'Đã kiểm tra chứng từ cọc hợp lệ, chuyển Giám đốc phê duyệt' },
    });
    expect(step1Res.status()).toBe(200);
    const step1Data = (await step1Res.json()).data || (await step1Res.json());
    expect(step1Data.stage).toBe('MANAGER_APPROVED');

    // Cấp 2: Giám đốc khối bán hàng duyệt
    const step2Res = await request.patch(`http://localhost:4000/api/v1/bookings/${createdBookingId}/approve`, {
      headers: { Authorization: `Bearer ${directorToken}` },
      data: { comment: 'Đồng ý duyệt chính sách chiết khấu 2%, chuyển Kế toán khớp tiền' },
    });
    expect(step2Res.status()).toBe(200);
    const step2Data = (await step2Res.json()).data || (await step2Res.json());
    expect(step2Data.stage).toBe('DIRECTOR_APPROVED');

    // Cấp 3: Kế toán xác nhận ủy nhiệm chi tiền vào tài khoản CĐT ➔ Hoàn tất Khóa Căn
    const step3Res = await request.patch(`http://localhost:4000/api/v1/bookings/${createdBookingId}/approve`, {
      headers: { Authorization: `Bearer ${accountantToken}` },
      data: { comment: 'Đã nhận đủ 100.000.000 VNĐ vào tài khoản Vietcombank' },
    });
    expect(step3Res.status()).toBe(200);
    const step3Data = (await step3Res.json()).data || (await step3Res.json());
    expect(step3Data.stage).toBe('DONE_LOCKED');
  });

  test('1.4. Booking: Gia hạn thêm thời gian SLA giữ chỗ (+30 phút)', async ({ request }) => {
    // Tạo thêm một phiếu booking tạm để thử nghiệm tính năng gia hạn SLA
    const tempRes = await request.post('http://localhost:4000/api/v1/bookings', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        unitId: 'i5',
        customerId: 'c3',
        projectId: 'p2',
        depositAmount: 50000000,
        bookingType: 'Giữ chỗ có hoàn lại',
      },
    });
    expect(tempRes.status()).toBe(201);
    const tempBooking = (await tempRes.json()).data || (await tempRes.json());

    // Trưởng phòng xin gia hạn 30 phút vì khách hàng đang ở ngoài ngân hàng
    const extendRes = await request.patch(`http://localhost:4000/api/v1/bookings/${tempBooking.id}/extend-sla`, {
      headers: { Authorization: `Bearer ${managerToken}` },
      data: {
        minutes: 30,
        reason: 'Khách hàng đang chuyển tiền tại quầy ngân hàng, cần thêm thời gian đối soát',
      },
    });

    expect(extendRes.status()).toBe(200);
    const extData = (await extendRes.json()).data || (await extendRes.json());
    expect(extData.expiresAt).toBeDefined();

    // Hủy bỏ phiếu tạm để giải phóng căn hộ i5
    await request.patch(`http://localhost:4000/api/v1/bookings/${tempBooking.id}/reject`, {
      headers: { Authorization: `Bearer ${managerToken}` },
      data: { reason: 'Hoàn tất kiểm thử SLA, giải phóng căn về rổ hàng' },
    });
  });

  test('1.5. Booking: Từ chối hồ sơ (Reject) và giải phóng căn hộ về rổ hàng khả dụng', async ({ request }) => {
    // 1. Tạo phiếu booking tạm
    const createRes = await request.post('http://localhost:4000/api/v1/bookings', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        unitId: 'i6',
        customerId: 'c1',
        projectId: 'p3',
        depositAmount: 50000000,
        bookingType: 'Giữ chỗ có hoàn lại',
      },
    });
    expect(createRes.status()).toBe(201);
    const ticket = (await createRes.json()).data || (await createRes.json());

    // 2. Quản lý từ chối phiếu do chứng từ thanh toán không hợp lệ
    const rejectRes = await request.patch(`http://localhost:4000/api/v1/bookings/${ticket.id}/reject`, {
      headers: { Authorization: `Bearer ${managerToken}` },
      data: { reason: 'Ảnh chụp ủy nhiệm chi bị mờ không xác thực được mã giao dịch' },
    });

    expect(rejectRes.status()).toBe(200);
    const rejectData = (await rejectRes.json()).data || (await rejectRes.json());
    expect(rejectData.stage).toBe('REJECTED');
  });

  test('1.6. Booking: Truy vấn danh sách phiếu booking phục vụ bảng Kanban 5 cột', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/bookings', {
      headers: { Authorization: `Bearer ${agentToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    const list = body.data || body;

    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);

    // Kiểm tra cấu trúc bản ghi đủ để render card Kanban
    const item = list[0];
    expect(item.code).toBeDefined();
    expect(item.stage).toBeDefined();
    expect(Number(item.depositAmount)).toBeGreaterThan(0);
    expect(item.unit).toBeDefined();
    expect(item.customer).toBeDefined();
  });

  // =========================================================================
  // PHẦN 2: QUẢN TRỊ HỢP ĐỒNG & KÝ SỐ ĐIỆN TỬ SHA-256 E-SIGN (CONTRACTS)
  // =========================================================================

  let createdContractId: string;
  let createdContractCode: string;

  test('2.1. Contracts: Khởi tạo hợp đồng mua bán với lịch thanh toán chuẩn 5 đợt', async ({ request }) => {
    const res = await request.post('http://localhost:4000/api/v1/contracts', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        type: 'Hợp đồng mua bán',
        customerId: 'c1',
        unitId: 'i2',
        projectId: 'p1',
        value: 12500000000,
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    const contract = body.data || body;

    expect(contract.id).toBeDefined();
    expect(contract.code).toContain('HD-');
    expect(contract.status).toBe('PENDING_SIGNATURE');
    expect(contract.paymentProgress).toBe(10);
    expect(Array.isArray(contract.paymentSchedule)).toBe(true);
    expect(contract.paymentSchedule.length).toBe(5);

    createdContractId = contract.id;
    createdContractCode = contract.code;
  });

  test('2.2. Contracts: Thực hiện ký số điện tử e-Sign với mã băm bảo mật SHA-256', async ({ request }) => {
    const targetId = createdContractId || 'ct-1';
    const res = await request.post(`http://localhost:4000/api/v1/contracts/${targetId}/esign`, {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        signerName: 'Nguyễn Văn Tuấn (Chủ Sở Hữu Căn Hộ)',
      },
    });

    expect([200, 201]).toContain(res.status());
    const body = await res.json();
    const result = body.data || body;

    // Kiểm tra tính toàn vẹn chữ ký số SHA-256 (chuỗi hex đúng 64 ký tự)
    expect(result.signatureHash).toBeDefined();
    expect(result.signatureHash.length).toBe(64);
    expect(/^[a-f0-9]{64}$/.test(result.signatureHash)).toBe(true);
    expect(result.signedAt).toBeDefined();
  });

  test('2.3. Contracts: Kế toán ghi nhận thanh toán đợt 2 và cập nhật % tiến độ hợp đồng', async ({ request }) => {
    const targetId = createdContractId || 'ct-1';
    const res = await request.post(`http://localhost:4000/api/v1/contracts/${targetId}/payments`, {
      headers: { Authorization: `Bearer ${accountantToken}` },
      data: {
        amount: 2500000000, // Đóng thêm 2.5 tỷ (20%)
        installment: 2,
        paymentMethod: 'Chuyển khoản VietQR Doanh Nghiệp',
      },
    });

    expect([200, 201]).toContain(res.status());
    const body = await res.json();
    const updated = body.data || body;

    expect(Number(updated.paidAmount)).toBeGreaterThan(1250000000);
    expect(updated.paymentProgress).toBeGreaterThanOrEqual(20);
  });

  test('2.4. Contracts: Truy vấn danh sách hợp đồng & chi tiết hợp đồng', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/contracts', {
      headers: { Authorization: `Bearer ${agentToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    const contracts = body.data || body;

    expect(Array.isArray(contracts)).toBe(true);
    expect(contracts.length).toBeGreaterThanOrEqual(1);

    // Truy vấn chi tiết hợp đồng
    const targetId = createdContractId || 'ct-1';
    const detailRes = await request.get(`http://localhost:4000/api/v1/contracts/${targetId}`, {
      headers: { Authorization: `Bearer ${agentToken}` },
    });
    expect(detailRes.status()).toBe(200);
    const detail = (await detailRes.json()).data || (await detailRes.json());
    expect(detail.id).toBe(targetId);
  });

  // =========================================================================
  // PHẦN 3: CỔNG ĐỐI SOÁT THANH TOÁN TỰ ĐỘNG VIETQR IPN (PAYMENTS)
  // =========================================================================

  test('3.1. Payment IPN: Nhận Webhook VietQR đối soát gạch cọc tự động phiếu Booking', async ({ request }) => {
    const res = await request.post('http://localhost:4000/api/v1/payments/vietqr-ipn', {
      data: {
        transactionId: 'TX_BOOKING_' + Date.now(),
        amount: 100000000,
        content: `THANH TOAN COC CAN HO THE GRAND MANHATTAN BK-1003`,
        bankCode: 'MBBANK',
        accountNumber: '0901888999',
      },
    });

    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    const message = json.data?.message || json.message;
    expect(message).toContain('BOOKING:BK-1003');
  });

  test('3.2. Payment IPN: Nhận Webhook VietQR đối soát thanh toán đợt Hợp Đồng Mua Bán', async ({ request }) => {
    const res = await request.post('http://localhost:4000/api/v1/payments/vietqr-ipn', {
      data: {
        transactionId: 'TX_CONTRACT_' + Date.now(),
        amount: 820000000,
        content: `DONG TIEN DOT 1 HD-8802 AQUA CITY`,
        bankCode: 'TCB',
        accountNumber: '190333444555',
      },
    });

    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    const message = json.data?.message || json.message;
    expect(message).toContain('CONTRACT:HD-8802');
  });

  test('3.3. Payment IPN: Truy vấn nhật ký giao dịch biến động số dư', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/payments/transactions', {
      headers: { Authorization: `Bearer ${accountantToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    const txs = body.data || body;

    expect(Array.isArray(txs)).toBe(true);
    expect(txs.length).toBeGreaterThanOrEqual(1);
    expect(txs[0].transactionRef).toBeDefined();
  });

  // =========================================================================
  // PHẦN 4: WEBSOCKET REAL-TIME GATEWAY BẢNG HÀNG (/ws/inventory)
  // =========================================================================

  test('4.1. WebSocket Gateway: Kết nối Socket.IO tới namespace /ws/inventory thành công', async () => {
    const socket: Socket = io('http://localhost:4000/ws/inventory', {
      transports: ['websocket', 'polling'],
      reconnection: false,
      timeout: 5000,
    });

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.close();
        reject(new Error('WebSocket connection timed out'));
      }, 4000);

      socket.on('connect', () => {
        clearTimeout(timer);
        expect(socket.connected).toBe(true);
        expect(socket.id).toBeDefined();

        // Tham gia phòng dự án
        socket.emit('join_project', { projectId: 'p1' });

        socket.close();
        resolve();
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timer);
        socket.close();
        reject(err);
      });
    });
  });

  // =========================================================================
  // PHẦN 5: TRẢI NGHIỆM GIAO DIỆN NGƯỜI DÙNG E2E (FRONTEND DASHBOARD PAGES)
  // =========================================================================

  test('5.1. Frontend UI: Bảng Kanban Booking (/booking) hiển thị 5 cột quy trình nghiệp vụ', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/booking');

    // Kiểm tra tiêu đề trang
    await expect(page.locator('text=Quy Trình').or(page.locator('text=Booking')).first()).toBeVisible();

    // Kiểm tra 5 cột nghiệp vụ trên bảng Kanban
    await expect(page.locator('text=Khởi Tạo').first()).toBeVisible();
    await expect(page.locator('text=Quản Lý Duyệt').first()).toBeVisible();
    await expect(page.locator('text=GĐ Khối Duyệt').first()).toBeVisible();
    await expect(page.locator('text=Chờ Kế Toán').first()).toBeVisible();
    await expect(page.locator('text=Đã Khóa Căn').first()).toBeVisible();
  });

  test('5.2. Frontend UI: Danh bạ Hợp đồng (/contracts) hiển thị danh sách, tiến độ và huy hiệu e-Sign', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/contracts');

    // Kiểm tra tiêu đề và bảng hợp đồng
    await expect(page.locator('text=Hợp Đồng').first()).toBeVisible();
    await expect(page.locator('text=HD-921').or(page.locator('text=DC-922')).or(page.locator('text=Hợp đồng')).first()).toBeVisible();
    await expect(page.locator('text=Đã ký chính thức').or(page.locator('text=Chờ phê duyệt')).or(page.locator('text=Đã ký')).first()).toBeVisible();
  });

  test('5.3. Frontend Rewrite Proxy: Kết nối thông suốt qua /backend-api/bookings và /backend-api/contracts', async ({ request }) => {
    // Proxy Bookings
    const bookingRes = await request.get('http://localhost:3000/backend-api/bookings', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(bookingRes.status()).toBe(200);
    const bookingData = (await bookingRes.json()).data || (await bookingRes.json());
    expect(Array.isArray(bookingData)).toBe(true);

    // Proxy Contracts
    const contractRes = await request.get('http://localhost:3000/backend-api/contracts', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(contractRes.status()).toBe(200);
    const contractData = (await contractRes.json()).data || (await contractRes.json());
    expect(Array.isArray(contractData)).toBe(true);
  });
});
