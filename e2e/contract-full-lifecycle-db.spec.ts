import { test, expect } from '@playwright/test';

test.describe('LUỒNG QUẢN TRỊ HỢP ĐỒNG, DATABASE KẾT NỐI BACKEND & E-SIGN TOÀN DIỆN', () => {
  let adminToken: string = '';

  test.beforeAll(async ({ request }) => {
    // 1. Xác thực với Backend NestJS API và lấy JWT Token quản trị
    const loginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    adminToken = loginBody.data?.accessToken || loginBody.accessToken;
    expect(adminToken).toBeTruthy();

    // 2. Kiểm tra kết nối trực tiếp cơ sở dữ liệu PostgreSQL qua API
    const contractsRes = await request.get('http://localhost:4000/api/v1/contracts', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(contractsRes.status()).toBe(200);
    const contractsData = await contractsRes.json();
    const contractList = contractsData.data || contractsData;
    expect(Array.isArray(contractList)).toBeTruthy();
    expect(contractList.length).toBeGreaterThan(0);
  });

  test.beforeEach(async ({ context }) => {
    // Thiết lập Cookie Auth để truy cập các route được bảo vệ
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { 
        name: 'nova_auth_user', 
        value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN', email: 'admin@novacrm.com' })), 
        domain: 'localhost', 
        path: '/' 
      },
    ]);
  });

  // =========================================================================
  // TRƯỜNG HỢP 1: KẾT NỐI DATABASE THẬT & HYDRATION TRÊN FRONTEND
  // =========================================================================
  test('CASE-01: Hydration động hợp đồng ct-1 trực tiếp từ PostgreSQL Database', async ({ page }) => {
    await page.goto('/contracts/ct-1');
    await page.waitForLoadState('networkidle');

    // 1. Xác minh tiêu đề và mã HĐ lấy từ PostgreSQL
    await expect(page.locator('h1:has-text("Hợp Đồng")')).toContainText('HD-8801');
    await expect(page.locator('text=Hợp đồng mua bán').first()).toBeVisible();

    // 2. Xác minh thông tin khách hàng từ DB
    await expect(page.locator('text=Nguyễn Văn Tuấn').first()).toBeVisible();
    await expect(page.locator('text=0901234567').first()).toBeVisible();

    // 3. Xác minh thông tin bất động sản từ DB
    await expect(page.locator('text=NVW-01.01').first()).toBeVisible();
    await expect(page.locator('text=NovaWorld Phan Thiet').first()).toBeVisible();

    // 4. Xác minh mã băm SHA-256 thực tế được lưu trong DB
    await expect(page.locator('text=ĐÃ KÝ SỐ SHA-256').first()).toBeVisible();
  });

  // =========================================================================
  // TRƯỜNG HỢP 2: LUỒNG THU TIỀN ĐỢT THANH TOÁN QUA MODAL & CẬP NHẬT DÒNG TIỀN
  // =========================================================================
  test('CASE-02: Thu tiền đợt thanh toán qua Modal đối soát dòng tiền và biên lai UNC', async ({ page }) => {
    await page.goto('/contracts/ct1');
    await page.waitForLoadState('networkidle');

    // Tìm dòng đợt 6 (chưa thu)
    const dot6Row = page.locator('tr:has-text("Đợt 6")');
    await expect(dot6Row).toBeVisible();

    // Bấm nút Thu tiền
    const payBtn = dot6Row.locator('button:has-text("Thu tiền")');
    await payBtn.click();

    // Modal thu tiền mở ra
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Xác Nhận Thu Tiền Đợt 6');
    await expect(modal.locator('input').first()).toHaveValue('HD-921');
    await expect(modal.locator('input').nth(1)).toHaveValue('Nguyễn Văn Tuấn');

    // Chọn phương thức Ủy nhiệm chi UNC
    const methodSelect = modal.locator('select');
    await methodSelect.selectOption('Ủy nhiệm chi ngân hàng');

    // Nhập mã biên lai đối soát
    const invoiceInput = modal.locator('input').nth(3);
    await invoiceInput.fill('UNC-VCB-889900');

    // Bấm xác nhận đã thu tiền
    const submitBtn = modal.locator('button[type="submit"]');
    await submitBtn.click();

    // Toast hiển thị thành công
    await expect(page.locator('text=Đã ghi nhận thu thành công Đợt 6')).toBeVisible();

    // Dòng đợt 6 lập tức đổi trạng thái sang "Đã thu"
    await expect(dot6Row).toContainText('Đã thu');
    await expect(dot6Row).toContainText('Hoàn tất');
  });

  // =========================================================================
  // TRƯỜNG HỢP 3: LUỒNG KÝ SỐ ĐIỆN TỬ e-SIGN VỚI MÃ BĂM SHA-256
  // =========================================================================
  test('CASE-03: Ký số điện tử SHA-256 trên hợp đồng ct2 và kiểm tra tính toàn vẹn', async ({ page }) => {
    await page.goto('/contracts/ct2');
    await page.waitForLoadState('networkidle');

    // Hợp đồng ct2 ban đầu ở trạng thái Chờ Phê Duyệt
    await expect(page.locator('h1:has-text("Hợp Đồng")')).toContainText('DC-922');
    await expect(page.locator('text=Chờ Phê Duyệt').first()).toBeVisible();

    // Bấm nút Phê Duyệt & Ký HĐ
    const signBtn = page.locator('button:has-text("Phê Duyệt & Ký HĐ")');
    await expect(signBtn).toBeVisible();
    await signBtn.click();

    // Modal e-Sign xuất hiện
    const signModal = page.locator('div[role="dialog"]');
    await expect(signModal).toBeVisible();
    await expect(signModal).toContainText('Ký Số Điện Tử e-Sign Hợp Đồng');

    // Kiểm tra chặn nếu chưa đồng ý cam kết pháp lý
    const confirmBtn = signModal.locator('button:has-text("Ký Số & Phê Duyệt Ngay")');
    await confirmBtn.click();
    await expect(page.locator('text=Vui lòng đánh dấu xác nhận cam kết pháp lý')).toBeVisible();

    // Chọn nhà cung cấp CA và đánh dấu checkbox
    const caSelect = signModal.locator('select');
    await caSelect.selectOption('VNPT-CA Cloud eSign');

    const termsCheckbox = signModal.locator('input[type="checkbox"]');
    await termsCheckbox.check();

    // Bấm ký số chính thức
    await confirmBtn.click();

    // Kiểm tra trạng thái đã chuyển sang Đã Ký Chính Thức
    await expect(page.locator('text=Đã ký số điện tử thành công')).toBeVisible();
    await expect(page.locator('text=Đã Ký Chính Thức').first()).toBeVisible();
    await expect(page.locator('text=ĐÃ KÝ SỐ SHA-256').first()).toBeVisible();
  });

  // =========================================================================
  // TRƯỜNG HỢP 4: QUẢN LÝ TÀI LIỆU PHÁP LÝ ĐÍNH KÈM & TẢI XUỐNG
  // =========================================================================
  test('CASE-04: Đính kèm tài liệu pháp lý mới và kiểm tra tải file', async ({ page }) => {
    await page.goto('/contracts/ct1');
    await page.waitForLoadState('networkidle');

    // Mở modal tải lên tài liệu
    const uploadBtn = page.locator('button:has-text("+ Tải Lên Tài Liệu Mới")');
    await uploadBtn.click();

    const uploadModal = page.locator('div[role="dialog"]');
    await expect(uploadModal).toBeVisible();

    // Điền tên tài liệu và loại hồ sơ
    const fileNameInput = uploadModal.locator('input[placeholder*="BienBan_NghiemThu"]');
    await fileNameInput.fill('BienBan_NghiemThu_PhanMong_BlockA.pdf');

    const categorySelect = uploadModal.locator('select');
    await categorySelect.selectOption('Biên bản bàn giao');

    // Submit lưu tài liệu
    const saveBtn = uploadModal.locator('button:has-text("Xác Nhận Lưu")');
    await saveBtn.click();

    // Xác minh thông báo và file xuất hiện trong Card Hồ Sơ Đính Kèm
    await expect(page.locator('text=Đã tải lên và lưu trữ thành công tài liệu')).toBeVisible();
    await expect(page.getByText('BienBan_NghiemThu_PhanMong_BlockA.pdf', { exact: true })).toBeVisible();

    // Bấm nút Tải xuống của file mới
    const downloadIconBtn = page.getByRole('button', { name: 'Tải về' }).last();
    await expect(downloadIconBtn).toBeVisible();
    await downloadIconBtn.click();
    await expect(page.locator('text=Đang tải xuống file')).toBeVisible();
  });

  // =========================================================================
  // TRƯỜNG HỢP 5: BỔ SUNG PHỤ LỤC ĐỢT THANH TOÁN (INSTALLMENT ADDENDUM)
  // =========================================================================
  test('CASE-05: Thêm đợt thanh toán phụ lục và cập nhật tiến độ dòng tiền', async ({ page }) => {
    await page.goto('/contracts/ct1');
    await page.waitForLoadState('networkidle');

    // Bấm Thêm Phụ Lục Đợt Thu
    const addBtn = page.locator('button:has-text("Thêm Phụ Lục Đợt Thu")');
    await addBtn.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Thêm Phụ Lục Đợt Thanh Toán');

    // Điền thông tin phụ lục đợt mới
    const milestoneInput = modal.locator('input[placeholder*="VD: Nghiệm thu"]');
    await milestoneInput.fill('Đợt 7 - Phụ lục gói hoàn thiện nội thất Smart Home chuẩn Quốc Tế');

    const percentInput = modal.locator('input[type="number"]');
    await percentInput.fill('10');

    // Submit
    const submitBtn = modal.locator('button:has-text("Bổ Sung Đợt Thu")');
    await submitBtn.click();

    // Toast thành công
    await expect(page.locator('text=Đã bổ sung thành công Phụ lục đợt thanh toán')).toBeVisible();

    // Bảng phụ lục có thêm dòng đợt 7
    await expect(page.locator('tbody tr:has-text("Đợt 7 - Phụ lục gói hoàn thiện nội thất")')).toBeVisible();
  });

  // =========================================================================
  // TRƯỜNG HỢP 6: PHÂN QUYỀN RBAC CHẶT CHẼ THEO VAI TRÒ DOANH NGHIỆP
  // =========================================================================
  test('CASE-06: Phân quyền vai trò AGENT (Khóa ký Bên A, chuyển sang yêu cầu thu)', async ({ page }) => {
    await page.goto('/contracts/ct2');
    await page.waitForLoadState('networkidle');

    // Đổi vai trò sang AGENT
    const roleSelect = page.locator('select').first();
    await roleSelect.selectOption('AGENT');
    await expect(page.locator('text=Đã chuyển sang vai trò: AGENT')).toBeVisible();

    // 1. AGENT bấm nút ký số Bên A -> Báo lỗi phân quyền
    const signBtn = page.locator('button:has-text("Phê Duyệt & Ký HĐ")');
    await signBtn.click();
    await expect(page.locator('text=Chỉ Giám Đốc (DIRECTOR) hoặc ADMIN mới có quyền ký số')).toBeVisible();

    // 2. AGENT mở modal thu tiền -> Nút đổi thành Gửi Yêu Cầu Kế Toán
    const dotRow = page.locator('tr:has-text("Đợt 3")');
    const reqBtn = dotRow.locator('button:has-text("Yêu cầu thu")');
    await expect(reqBtn).toBeVisible();
    await reqBtn.click();

    const paymentModal = page.locator('div[role="dialog"]');
    await expect(paymentModal).toContainText('Lưu ý quyền Chuyên viên Sale (AGENT)');
    await expect(paymentModal.locator('button:has-text("Gửi Yêu Cầu Kế Toán")')).toBeVisible();
  });

  // =========================================================================
  // TRƯỜNG HỢP 7: TRƯỜNG HỢP NGOẠI LỆ (EDGE CASE) - HỢP ĐỒNG KHÔNG TỒN TẠI
  // =========================================================================
  test('CASE-07: Xử lý ngoại lệ khi truy cập ID hợp đồng không tồn tại (404 Fallback)', async ({ page }) => {
    await page.goto('/contracts/ct-invalid-999999');
    await page.waitForLoadState('networkidle');

    // Hiển thị giao diện thông báo lỗi thân thiện
    await expect(page.locator('text=Không tìm thấy hợp đồng!')).toBeVisible();
    await expect(page.locator('text=không tồn tại hoặc đã bị xóa')).toBeVisible();

    // Nút quay lại danh sách hợp đồng hoạt động tốt
    const backBtn = page.locator('button:has-text("Quay lại danh sách")');
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL(/\/contracts/);
  });

});
