import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

// Thứ bậc vai trò trong hệ sinh thái NovaCRM (Càng cao càng có nhiều đặc quyền quản trị)
export const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100, // Quản trị toàn sàn tối cao (bypass mọi rào cản)
  ADMIN: 80,       // Quản trị viên chi nhánh / sàn
  DIRECTOR: 60,    // Giám đốc khối bán hàng
  TEAM_LEADER: 40, // Trưởng phòng kinh doanh
  ACCOUNTANT: 40,  // Kế toán đối soát tài chính
  AGENT: 20,       // Chuyên viên môi giới cá nhân
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu endpoint không yêu cầu vai trò cụ thể, cho phép mọi người dùng đã xác thực
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('Yêu cầu xác thực phiên đăng nhập trước khi thực hiện thao tác');
    }

    // 1. SUPER_ADMIN có toàn quyền trên toàn bộ các endpoint
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    // 2. Kiểm tra trực tiếp vai trò yêu cầu
    if (requiredRoles.includes(user.role)) {
      return true;
    }

    // 3. Kiểm tra tính kế thừa quản lý: ADMIN được phép thực hiện các thao tác của DIRECTOR và TEAM_LEADER
    if (user.role === 'ADMIN' && (requiredRoles.includes('DIRECTOR') || requiredRoles.includes('TEAM_LEADER'))) {
      return true;
    }

    // Từ chối quyền truy cập với thông báo chi tiết
    throw new ForbiddenException(
      `Quyền truy cập bị từ chối: Người dùng [${user.email || user.id}] mang vai trò [${user.role}], nhưng thao tác này yêu cầu một trong các vai trò: [${requiredRoles.join(', ')}]`
    );
  }
}
