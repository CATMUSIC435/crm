import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Định nghĩa ma trận phân quyền truy cập theo đường dẫn (RBAC Route Rules)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  '/director': ['DIRECTOR', 'ADMIN', 'SUPER_ADMIN'],
  '/manager': ['TEAM_LEADER', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN'],
  '/settings': ['ADMIN', 'SUPER_ADMIN', 'DIRECTOR'],
  '/operations': ['ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'TEAM_LEADER'],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua các tài nguyên tĩnh và API nội bộ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/backend-api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('nova_auth_token')?.value;
  const role = request.cookies.get('nova_auth_role')?.value;

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // 1. Nếu đã đăng nhập mà truy cập trang /login -> chuyển tiếp vào bảng điều khiển cá nhân
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/agent', request.url));
  }

  // 2. Nếu chưa đăng nhập mà truy cập các phân hệ nghiệp vụ nội bộ -> chuyển hướng về /login
  if (!isAuthRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Phân quyền người dùng theo vai trò (RBAC Guard)
  if (token && role) {
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
      if (pathname.startsWith(routePrefix)) {
        // SUPER_ADMIN luôn có toàn quyền truy cập
        if (role === 'SUPER_ADMIN') {
          return NextResponse.next();
        }

        const isAllowed = allowedRoles.includes(role);
        if (!isAllowed) {
          // Người dùng không đủ thẩm quyền -> điều hướng về trang cá nhân kèm cảnh báo
          const redirectUrl = new URL('/agent', request.url);
          redirectUrl.searchParams.set('unauthorized', routePrefix.replace('/', ''));
          return NextResponse.redirect(redirectUrl);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Áp dụng proxy kiểm soát bảo mật trên tất cả các trang
     * Ngoại trừ các static assets, favicon, ảnh đại diện
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
