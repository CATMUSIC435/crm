import { BookingTicketEntity } from './booking-ticket.entity';

describe('BookingTicketEntity (Domain Logic)', () => {
  const createMockTicket = (stage: any = 'INIT_SALE', expiresMinutes = 15) => {
    return new BookingTicketEntity(
      'uuid-123',
      'BK-1001',
      'unit-01',
      'cust-01',
      'proj-01',
      'agent-01',
      100_000_000,
      'Có hoàn lại',
      stage,
      'VIP',
      new Date(Date.now() + expiresMinutes * 60 * 1000),
      undefined,
      undefined,
      [],
    );
  };

  it('nên cho phép Trưởng phòng phê duyệt bước đầu tiên', () => {
    const ticket = createMockTicket('INIT_SALE');
    ticket.approveBy('TEAM_LEADER', 'Trần Quản Lý', 'Hồ sơ khách hàng VIP đầy đủ');
    expect(ticket.stage).toBe('MANAGER_APPROVED');
    expect(ticket.approvalHistory.length).toBe(1);
    expect(ticket.approvalHistory[0].action).toBe('approved');
  });

  it('nên ném lỗi nếu nhân viên sai quyền cố tình duyệt', () => {
    const ticket = createMockTicket('INIT_SALE');
    expect(() => {
      ticket.approveBy('AGENT', 'Nguyễn Sale', 'Tự duyệt');
    }).toThrow('Chỉ Trưởng phòng kinh doanh mới có quyền duyệt bước 1');
  });

  it('nên chuyển sang DONE_LOCKED khi Kế toán xác nhận', () => {
    const ticket = createMockTicket('DIRECTOR_APPROVED');
    ticket.approveBy('ACCOUNTANT', 'Kế Toán Trưởng', 'Đã nhận đủ 100M vào tài khoản Techcombank');
    expect(ticket.stage).toBe('DONE_LOCKED');
    expect(ticket.isExpired()).toBe(false);
  });

  it('nên phát hiện vé đã hết hạn SLA 15 phút', () => {
    const ticket = createMockTicket('INIT_SALE', -5); // Hết hạn từ 5 phút trước
    expect(ticket.isExpired()).toBe(true);
    expect(() => {
      ticket.approveBy('TEAM_LEADER', 'Quản lý', 'Duyệt trễ');
    }).toThrow('Hồ sơ booking đã quá hạn SLA 15 phút');
  });

  it('nên cho phép gia hạn thời gian SLA thành công', () => {
    const ticket = createMockTicket('INIT_SALE', 5);
    const oldTime = ticket.expiresAt.getTime();
    ticket.extendSLA(30, 'Giám Đốc', 'Khách VIP đang đi công tác');
    expect(ticket.expiresAt.getTime()).toBeGreaterThan(oldTime);
  });
});
