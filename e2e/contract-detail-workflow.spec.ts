import { test, expect } from '@playwright/test';

test.describe('Phân Hệ Quản Trị Hợp Đồng & e-Sign Chi Tiết (/contracts/[id])', () => {
  let adminToken: string = 'demo_admin_jwt_token';

  test.beforeAll(async ({ request }) => {
    try {
      const res = await request.post('http://localhost:4000/api/v1/auth/login', {
        data: { email: 'admin@novacrm.com', password: 'password123' },
      });
      if (res.status() === 200) {
        const body = await res.json();
        adminToken = body.data?.accessToken || body.accessToken || adminToken;
      }
    } catch {
      // Backend fallback
    }
  });

  test.beforeEach(async ({ context }) => {
    // Cài đặt Cookie Auth để vượt qua Next.js middleware
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

  test('TC-01: Hiển thị đầy đủ dữ liệu động của hợp đồng ct1, không có dữ liệu HTML gắn cứng', async ({ page }) => {
    await page.goto('/contracts/ct1');
    await page.waitForLoadState('networkidle');

    // 1. Kiểm tra tiêu đề và mã HĐ
    await expect(page.locator('h1:has-text("Hợp Đồng")')).toContainText('Hợp Đồng: HD-921');
    await expect(page.locator('text=Hợp đồng mua bán').first()).toBeVisible();
    await expect(page.locator('text=Đã Ký Chính Thức').first()).toBeVisible();

    // 2. Kiểm tra thông tin Bên Mua (Bên B) lấy từ customer dynamic object
    await expect(page.locator('text=Nguyễn Văn Tuấn').first()).toBeVisible();
    await expect(page.locator('text=KH-001').first()).toBeVisible();
    await expect(page.locator('text=0901234567').first()).toBeVisible();
    await expect(page.locator('text=079088192831').first()).toBeVisible();
    await expect(page.locator('text=Số 12 Bến Nghé, Quận 1, TP. Hồ Chí Minh').first()).toBeVisible();

    // 3. Kiểm tra thông tin BĐS
    await expect(page.locator('text=NVW-01.01').first()).toBeVisible();
    await expect(page.locator('text=250 m²').first()).toBeVisible();
    await expect(page.locator('text=NovaWorld Phan Thiet').first()).toBeVisible();

    // 4. Kiểm tra văn bản xem trước pháp lý
    await expect(page.locator('h3:has-text("HỢP ĐỒNG MUA BÁN")').first()).toBeVisible();
    await expect(page.locator('text=Trần Văn Sếp (Tổng Giám Đốc)').first()).toBeVisible();
    await expect(page.locator('text=ĐÃ KÝ SỐ SHA-256').first()).toBeVisible();
  });

  test('TC-02: Luồng Thu tiền đợt thanh toán qua Modal và cập nhật trạng thái', async ({ page }) => {
    await page.goto('/contracts/ct1');
    await page.waitForLoadState('networkidle');

    // Tìm đợt 6 (chưa thu) và bấm Thu tiền
    const dot6Row = page.locator('tr:has-text("Đợt 6")');
    await expect(dot6Row).toBeVisible();
    await expect(dot6Row).toContainText('Chưa đến hạn');

    const payButton = dot6Row.locator('button:has-text("Thu tiền")');
    await payButton.click();

    // Modal Thu tiền xuất hiện
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Xác Nhận Thu Tiền Đợt 6');
    await expect(modal.locator('input').first()).toHaveValue('HD-921');
    await expect(modal.locator('input').nth(1)).toHaveValue('Nguyễn Văn Tuấn');

    // Điền thông tin biên lai & phương thức
    const invoiceInput = modal.locator('input').nth(3); // Invoice code
    await invoiceInput.fill('INV-VCB-TEST-8899');

    // Bấm xác nhận thu tiền
    const submitBtn = modal.locator('button[type="submit"]');
    await submitBtn.click();

    // Kiểm tra toast thông báo
    await expect(page.locator('text=Đã ghi nhận thu thành công Đợt 6')).toBeVisible();

    // Kiểm tra dòng Đợt 6 đã cập nhật sang "Đã thu"
    await expect(dot6Row).toContainText('Đã thu');
    await expect(dot6Row).toContainText('Hoàn tất');
  });

  test('TC-03: Luồng Ký số điện tử (e-Sign) trên hợp đồng ct2', async ({ page }) => {
    await page.goto('/contracts/ct2');
    await page.waitForLoadState('networkidle');

    // Kiểm tra trạng thái ban đầu: Chờ Phê Duyệt
    await expect(page.locator('h1:has-text("Hợp Đồng")')).toContainText('Hợp Đồng: DC-922');
    await expect(page.locator('text=Chờ Phê Duyệt').first()).toBeVisible();

    // Nút "Phê Duyệt & Ký HĐ" hiển thị
    const signBtn = page.locator('button:has-text("Phê Duyệt & Ký HĐ")');
    await expect(signBtn).toBeVisible();
    await signBtn.click();

    // Modal e-Sign xuất hiện
    const signModal = page.locator('div[role="dialog"]');
    await expect(signModal).toBeVisible();
    await expect(signModal).toContainText('Ký Số Điện Tử e-Sign Hợp Đồng');

    // Checkbox đồng ý cam kết pháp lý
    const checkbox = signModal.locator('input[type="checkbox"]');
    await checkbox.check();

    // Bấm Ký số
    const confirmBtn = signModal.locator('button:has-text("Ký Số & Phê Duyệt Ngay")');
    await confirmBtn.click();

    // Kiểm tra trạng thái chuyển sang Đã Ký
    await expect(page.locator('text=Đã ký số điện tử thành công')).toBeVisible();
    await expect(page.locator('text=Đã Ký Chính Thức').first()).toBeVisible();
    await expect(page.locator('text=ĐÃ KÝ SỐ SHA-256').first()).toBeVisible();
  });

  test('TC-04: Luồng Tải lên hồ sơ pháp lý mới và đồng bộ danh sách đính kèm', async ({ page }) => {
    await page.goto('/contracts/ct1');
    await page.waitForLoadState('networkidle');

    // Bấm nút Tải Lên Tài Liệu Mới
    const uploadBtn = page.locator('button:has-text("+ Tải Lên Tài Liệu Mới")');
    await uploadBtn.click();

    // Modal đính kèm tài liệu mở ra
    const uploadModal = page.locator('div[role="dialog"]');
    await expect(uploadModal).toBeVisible();
    await expect(uploadModal).toContainText('Đính Kèm Tài Liệu Pháp Lý Mới');

    // Nhập tên file mới
    const fileNameInput = uploadModal.locator('input[placeholder*="BienBan_NghiemThu"]');
    await fileNameInput.fill('GiayPhepXayDung_GiaiDoan2.pdf');

    // Submit
    const saveBtn = uploadModal.locator('button:has-text("Xác Nhận Lưu")');
    await saveBtn.click();

    // Kiểm tra toast thông báo
    await expect(page.locator('text=Đã tải lên và lưu trữ thành công tài liệu')).toBeVisible();

    // File mới xuất hiện ngay trong Card Hồ Sơ Đính Kèm
    await expect(page.getByText('GiayPhepXayDung_GiaiDoan2.pdf', { exact: true })).toBeVisible();
  });

  test('TC-05: Luồng Thêm Phụ Lục Đợt Thanh Toán Mới', async ({ page }) => {
    await page.goto('/contracts/ct1');
    await page.waitForLoadState('networkidle');

    // Bấm nút Thêm Phụ Lục Đợt Thu
    const addMilestoneBtn = page.locator('button:has-text("Thêm Phụ Lục Đợt Thu")');
    await addMilestoneBtn.click();

    // Modal phụ lục mở ra
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Thêm Phụ Lục Đợt Thanh Toán');

    // Nhập mốc tiến độ
    const milestoneInput = modal.locator('input[placeholder*="VD: Nghiệm thu"]');
    await milestoneInput.fill('Đợt 7 - Nghiệm thu hoàn thiện gói cảnh quan sân vườn VIP');

    // Submit
    const submitBtn = modal.locator('button:has-text("Bổ Sung Đợt Thu")');
    await submitBtn.click();

    // Kiểm tra toast và bảng có thêm dòng mới
    await expect(page.locator('text=Đã bổ sung thành công Phụ lục đợt thanh toán')).toBeVisible();
    await expect(page.locator('tbody tr:has-text("Đợt 7 - Nghiệm thu hoàn thiện gói cảnh quan sân vườn VIP")')).toBeVisible();
  });

  test('TC-06: Luồng Gửi Email Khách Hàng', async ({ page }) => {
    await page.goto('/contracts/ct1');
    await page.waitForLoadState('networkidle');

    const emailBtn = page.locator('button:has-text("Gửi Email Khách")');
    await emailBtn.click();

    const emailModal = page.locator('div[role="dialog"]');
    await expect(emailModal).toBeVisible();
    await expect(emailModal).toContainText('Gửi Email Thông Báo Hợp Đồng');

    const sendBtn = emailModal.locator('button:has-text("Gửi Ngay")');
    await sendBtn.click();

    await expect(page.locator('text=Đã gửi thành công hồ sơ HĐ')).toBeVisible();
  });

  test('TC-07: Phân quyền RBAC - Vai trò AGENT bị giới hạn quyền thu tiền trực tiếp và ký số Bên A', async ({ page }) => {
    await page.goto('/contracts/ct1');
    await page.waitForLoadState('networkidle');

    // Đổi vai trò sang AGENT
    const roleSelect = page.locator('select').first();
    await roleSelect.selectOption('AGENT');
    await expect(page.locator('text=Đã chuyển sang vai trò: AGENT')).toBeVisible();

    // 1. Kiểm tra trên HĐ ct2 (chờ duyệt)
    await page.goto('/contracts/ct2');
    await page.waitForLoadState('networkidle');

    // Đổi role sang AGENT lại
    const roleSelectCt2 = page.locator('select').first();
    await roleSelectCt2.selectOption('AGENT');

    // Bấm nút Phê duyệt & Ký HĐ với vai trò AGENT -> Báo lỗi phân quyền
    const signBtn = page.locator('button:has-text("Phê Duyệt & Ký HĐ")');
    await signBtn.click();
    await expect(page.locator('text=Chỉ Giám Đốc (DIRECTOR) hoặc ADMIN mới có quyền ký số')).toBeVisible();

    // 2. Mở modal thu tiền với role AGENT
    const row = page.locator('tr:has-text("Đợt 3")');
    const requestBtn = row.locator('button:has-text("Yêu cầu thu")');
    await expect(requestBtn).toBeVisible();
    await requestBtn.click();

    // Modal thu tiền có thông báo quyền AGENT và nút là Gửi Yêu Cầu
    const paymentModal = page.locator('div[role="dialog"]');
    await expect(paymentModal).toContainText('Lưu ý quyền Chuyên viên Sale (AGENT)');
    await expect(paymentModal.locator('button:has-text("Gửi Yêu Cầu Kế Toán")')).toBeVisible();
  });

});
