import { test, expect } from '@playwright/test';

test.describe.serial('KIỂM THỬ DỮ LIỆU THẬT DOCKER (POSTGRESQL 16 POSTGIS & REDIS 7) - GIAI ĐOẠN 1 & 2', () => {

  let adminToken: string;
  let managerToken: string;
  let directorToken: string;
  let accountantToken: string;
  let agentToken: string;

  test.beforeAll(async ({ request }) => {
    // Đăng nhập bằng tài khoản Quản trị viên lưu trực tiếp trong PostgreSQL
    const loginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(loginRes.status()).toBe(200);
    const body = await loginRes.json();
    const data = body.data || body;
    adminToken = data.accessToken;

    expect(data.user.email).toBe('admin@novacrm.com');
    expect(data.user.role).toBe('SUPER_ADMIN');

    // Lấy token cho các vai trò khác từ PostgreSQL
    const mRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'manager@novacrm.com', password: 'password123' },
    });
    managerToken = ((await mRes.json()).data || (await mRes.json())).accessToken;

    const dRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'director@novacrm.com', password: 'password123' },
    });
    directorToken = ((await dRes.json()).data || (await dRes.json())).accessToken;

    const accRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'accountant@novacrm.com', password: 'password123' },
    });
    accountantToken = ((await accRes.json()).data || (await accRes.json())).accessToken;

    const aRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'agent@novacrm.com', password: 'password123' },
    });
    agentToken = ((await aRes.json()).data || (await aRes.json())).accessToken;
  });

  // =========================================================================
  // GIAI ĐOẠN 1: DỮ LIỆU THẬT TRÊN POSTGRESQL (USERS, PROJECTS, INVENTORY, CUSTOMERS)
  // =========================================================================

  test('1.1. PostgreSQL User: Đăng ký nhân viên kinh doanh mới và ghi nhận trực tiếp vào bảng User', async ({ request }) => {
    const uniqueEmail = `agent.docker.${Date.now()}@novacrm.com`;
    const uniquePhone = '09' + Math.floor(10000000 + Math.random() * 90000000);

    const regRes = await request.post('http://localhost:4000/api/v1/auth/register', {
      data: {
        email: uniqueEmail,
        password: 'password123',
        fullName: 'Nguyễn Văn Môi Giới Docker',
        phone: uniquePhone,
      },
    });

    expect(regRes.status()).toBe(201);
    const regData = (await regRes.json()).data || (await regRes.json());
    expect(regData.user.email).toBe(uniqueEmail);

    // Xác thực đăng nhập lại ngay lập tức với tài khoản vừa tạo trong PostgreSQL
    const loginTest = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: uniqueEmail, password: 'password123' },
    });
    expect(loginTest.status()).toBe(200);
  });

  test('1.2. PostgreSQL Projects: Truy vấn 4 đại dự án chủ lực đã nạp thực tế vào cơ sở dữ liệu', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/projects', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status()).toBe(200);
    const projects = (await res.json()).data || (await res.json());

    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThanOrEqual(4);

    const codes = projects.map((p: any) => p.code);
    expect(codes).toContain('P01'); // NovaWorld Phan Thiet
    expect(codes).toContain('P02'); // Aqua City
    expect(codes).toContain('P03'); // The Grand Manhattan
    expect(codes).toContain('P04'); // The Global City
  });

  test('1.3. PostgreSQL Inventory: Truy vấn rổ hàng căn hộ kèm quan hệ khóa ngoại (Foreign Keys)', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/inventory?projectId=p1', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status()).toBe(200);
    const units = (await res.json()).data || (await res.json());

    expect(Array.isArray(units)).toBe(true);
    expect(units.length).toBeGreaterThanOrEqual(2);

    const u1 = units.find((u: any) => u.code === 'NVW-01.01');
    expect(u1).toBeDefined();
    expect(u1.price).toBeGreaterThan(0);
    expect(u1.bedrooms).toBe(4);
    expect(u1.view).toContain('biển');
  });

  test('1.4. PostgreSQL Customers: Truy vấn danh bạ khách hàng 360 lưu trữ trong bảng Customer', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/customers', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status()).toBe(200);
    const customers = (await res.json()).data || (await res.json());

    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThanOrEqual(3);

    const vvip = customers.find((c: any) => c.code === 'KH-001');
    expect(vvip).toBeDefined();
    expect(vvip.fullName).toBe('Nguyễn Văn Tuấn');
    expect(vvip.rank).toBe('DIAMOND_VVIP');
  });

  // =========================================================================
  // GIAI ĐOẠN 2: DỮ LIỆU THẬT TRÊN POSTGRESQL (BOOKINGS, CONTRACTS, VIETQR IPN)
  // =========================================================================

  let realBookingId: string;
  let realBookingCode: string;
  const realUnitId = 'unit-docker-' + Date.now();

  test('2.1. PostgreSQL Booking: Khởi tạo phiếu cọc ghi nhận vào bảng BookingTicket & đồng bộ trạng thái Unit', async ({ request }) => {
    const res = await request.post('http://localhost:4000/api/v1/bookings', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        unitId: realUnitId,
        customerId: 'c1',
        projectId: 'p1',
        depositAmount: 100000000,
        bookingType: 'Giữ chỗ có hoàn lại',
        priority: 'high',
        notes: 'Khách hàng VIP chốt cọc lưu PostgreSQL thật qua Docker',
      },
    });

    expect(res.status()).toBe(201);
    const data = (await res.json()).data || (await res.json());

    expect(data.id).toBeDefined();
    expect(data.code).toContain('BK-');
    expect(data.stage).toBe('INIT_SALE');
    expect(data.expiresAt).toBeDefined();

    realBookingId = data.id;
    realBookingCode = data.code;
  });

  test('2.2. PostgreSQL Booking: Chống đặt cọc trùng lặp trên cùng một căn hộ (Distributed Locking)', async ({ request }) => {
    // Thử đặt cọc tiếp vào căn hộ realUnitId đang có phiếu hiệu lực
    const conflictRes = await request.post('http://localhost:4000/api/v1/bookings', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        unitId: realUnitId,
        customerId: 'c2',
        projectId: 'p1',
        depositAmount: 100000000,
        bookingType: 'Giữ chỗ có hoàn lại',
      },
    });

    expect(conflictRes.status()).toBe(409);
  });

  test('2.3. PostgreSQL Booking: Quy trình phê duyệt cập nhật trực tiếp vào cơ sở dữ liệu', async ({ request }) => {
    // 1. Trưởng phòng duyệt
    const mApprove = await request.patch(`http://localhost:4000/api/v1/bookings/${realBookingId}/approve`, {
      headers: { Authorization: `Bearer ${managerToken}` },
      data: { comment: 'Trưởng phòng xác nhận hồ sơ hợp lệ trên PostgreSQL' },
    });
    expect(mApprove.status()).toBe(200);

    // 2. Giám đốc duyệt
    const dApprove = await request.patch(`http://localhost:4000/api/v1/bookings/${realBookingId}/approve`, {
      headers: { Authorization: `Bearer ${directorToken}` },
      data: { comment: 'Giám đốc khối phê duyệt' },
    });
    expect(dApprove.status()).toBe(200);

    // 3. Kế toán xác nhận dòng tiền -> Chuyển trạng thái sang DONE_LOCKED
    const accApprove = await request.patch(`http://localhost:4000/api/v1/bookings/${realBookingId}/approve`, {
      headers: { Authorization: `Bearer ${accountantToken}` },
      data: { comment: 'Kế toán xác nhận nhận tiền vào tài khoản' },
    });
    expect(accApprove.status()).toBe(200);
    const finalData = (await accApprove.json()).data || (await accApprove.json());
    expect(finalData.stage).toBe('DONE_LOCKED');
  });

  test('2.4. PostgreSQL Contracts: Ký số điện tử SHA-256 và lưu mã băm vào bảng Contract', async ({ request }) => {
    const signRes = await request.post('http://localhost:4000/api/v1/contracts/ct-1/esign', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        signerName: 'Nguyễn Văn Tuấn (Ký Số Thực Nghiệm Docker)',
      },
    });

    expect([200, 201]).toContain(signRes.status());
    const signData = (await signRes.json()).data || (await signRes.json());

    expect(signData.signatureHash).toBeDefined();
    expect(signData.signatureHash.length).toBe(64); // SHA-256 64 hex chars
    expect(signData.signedAt).toBeDefined();

    // Truy vấn lại từ PostgreSQL để đảm bảo hợp đồng đã đổi trạng thái thành SIGNED_ACTIVE
    const getRes = await request.get('http://localhost:4000/api/v1/contracts/ct-1', {
      headers: { Authorization: `Bearer ${agentToken}` },
    });
    expect(getRes.status()).toBe(200);
    const contract = (await getRes.json()).data || (await getRes.json());
    expect(contract.status).toBe('SIGNED_ACTIVE');
    expect(contract.signatureHash).toBe(signData.signatureHash);
  });

  test('2.5. PostgreSQL Payments: Ghi nhận thanh toán đợt và lưu vết vào bảng PaymentTransaction', async ({ request }) => {
    const ipnRes = await request.post('http://localhost:4000/api/v1/payments/vietqr-ipn', {
      data: {
        transactionId: 'TX_DOCKER_REAL_' + Date.now(),
        amount: 500000000,
        content: 'DONG TIEN DOT 1 HD-8802 AQUA CITY',
        bankCode: 'TCB',
        accountNumber: '190333444555',
      },
    });

    expect(ipnRes.status()).toBe(200);
    const ipnData = await ipnRes.json();
    expect(ipnData.success).toBe(true);

    // Truy vấn bảng PaymentTransaction trong PostgreSQL
    const txRes = await request.get('http://localhost:4000/api/v1/payments/transactions', {
      headers: { Authorization: `Bearer ${accountantToken}` },
    });
    expect(txRes.status()).toBe(200);
    const txs = (await txRes.json()).data || (await txRes.json());
    expect(Array.isArray(txs)).toBe(true);
    expect(txs.length).toBeGreaterThanOrEqual(1);
    expect(txs[0].status).toBe('RECONCILED');
  });
});
