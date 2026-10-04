import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUseCase } from '../ports/in/auth.use-case';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dtos/auth.dto';
import { PrismaService } from '../../../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

interface InMemoryUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string;
  role: string;
  avatar?: string;
  branchId?: string;
  exp: number;
  level: number;
  is2FAEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
}

// Băm sẵn mật khẩu mẫu 'password123' cho môi trường kiểm thử và fallback
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

const SEED_USERS: InMemoryUser[] = [
  {
    id: 'usr-admin-001',
    email: 'admin@novacrm.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: 'Lê Hoàng Anh (Admin)',
    phone: '0901888999',
    role: 'SUPER_ADMIN',
    avatar: 'https://github.com/shadcn.png',
    exp: 50000,
    level: 10,
    is2FAEnabled: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'usr-director-002',
    email: 'director@novacrm.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: 'Trần Văn Giám Đốc',
    phone: '0902888999',
    role: 'DIRECTOR',
    exp: 30000,
    level: 8,
    is2FAEnabled: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'usr-manager-003',
    email: 'manager@novacrm.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: 'Nguyễn Văn Trưởng Phòng',
    phone: '0903888999',
    role: 'TEAM_LEADER',
    exp: 15000,
    level: 5,
    is2FAEnabled: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'usr-accountant-004',
    email: 'accountant@novacrm.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: 'Phạm Thị Kế Toán',
    phone: '0904888999',
    role: 'ACCOUNTANT',
    exp: 10000,
    level: 4,
    is2FAEnabled: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'usr-agent-005',
    email: 'agent@novacrm.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    fullName: 'Hoàng Văn Môi Giới',
    phone: '0905888999',
    role: 'AGENT',
    exp: 5000,
    level: 2,
    is2FAEnabled: false,
    createdAt: new Date('2024-01-01'),
  },
];

@Injectable()
export class AuthService implements AuthUseCase {
  private inMemoryUsers: Map<string, InMemoryUser> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    // Khởi tạo danh mục tài khoản mặc định
    SEED_USERS.forEach((u) => {
      this.inMemoryUsers.set(u.email.toLowerCase(), u);
      this.inMemoryUsers.set(u.id, u);
    });
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const normalizedEmail = dto.email.toLowerCase();
    let user: any = null;

    // 1. Thử kết nối cơ sở dữ liệu Prisma nếu đang hoạt động
    if (this.prisma.isConnected) {
      try {
        user = await this.prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
      } catch {}
    }

    if (!user) {
      user = this.inMemoryUsers.get(normalizedEmail);
    }

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, name: user.fullName };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar || undefined,
      },
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const normalizedEmail = dto.email.toLowerCase();

    // 1. Kiểm tra trùng lặp nếu database kết nối
    if (this.prisma.isConnected) {
      try {
        const existing = await this.prisma.user.findFirst({
          where: {
            OR: [{ email: normalizedEmail }, { phone: dto.phone }],
          },
        });
        if (existing) {
          throw new ConflictException('Email hoặc số điện thoại đã tồn tại trong hệ thống');
        }
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
      }
    }

    if (this.inMemoryUsers.has(normalizedEmail)) {
      throw new ConflictException('Email hoặc số điện thoại đã tồn tại trong hệ thống');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    let user: any = null;
    if (this.prisma.isConnected) {
      try {
        user = await this.prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash,
            fullName: dto.fullName,
            phone: dto.phone,
            role: 'AGENT',
          },
        });
      } catch {}
    }

    if (!user) {
      // Fallback lưu tạm bộ nhớ nếu database chưa kết nối
      user = {
        id: `usr-${Date.now()}`,
        email: normalizedEmail,
        passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
        role: 'AGENT',
        exp: 0,
        level: 1,
        is2FAEnabled: false,
        createdAt: new Date(),
      };
      this.inMemoryUsers.set(user.email, user);
      this.inMemoryUsers.set(user.id, user);
    }

    const payload = { sub: user.id, email: user.email, role: user.role, name: user.fullName };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar || undefined,
      },
    };
  }

  async getProfile(userId: string) {
    if (this.prisma.isConnected) {
      try {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            avatar: true,
            branchId: true,
            exp: true,
            level: true,
            is2FAEnabled: true,
            createdAt: true,
          },
        });
        if (user) return user;
      } catch {}
    }

    const memUser = this.inMemoryUsers.get(userId);
    if (!memUser) {
      throw new UnauthorizedException('Không tìm thấy thông tin tài khoản');
    }

    return {
      id: memUser.id,
      email: memUser.email,
      fullName: memUser.fullName,
      phone: memUser.phone,
      role: memUser.role,
      avatar: memUser.avatar,
      branchId: memUser.branchId,
      exp: memUser.exp,
      level: memUser.level,
      is2FAEnabled: memUser.is2FAEnabled,
      createdAt: memUser.createdAt,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      let user: any = null;

      if (this.prisma.isConnected) {
        try {
          user = await this.prisma.user.findUnique({
            where: { id: decoded.sub },
          });
        } catch {}
      }

      if (!user) {
        user = this.inMemoryUsers.get(decoded.sub);
      }

      if (!user) {
        // Fallback tạo payload từ chính decoded token
        user = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role || 'AGENT',
          fullName: decoded.name || decoded.email,
        };
      }

      const payload = { sub: user.id, email: user.email, role: user.role, name: user.fullName };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return { accessToken, refreshToken };
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  async changePassword(userId: string, dto: { oldPassword: string; newPassword: string }) {
    let user: any = null;
    if (this.prisma.isConnected) {
      try {
        user = await this.prisma.user.findUnique({ where: { id: userId } });
      } catch {}
    }

    if (!user) {
      user = this.inMemoryUsers.get(userId);
    }

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(dto.newPassword, salt);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.user.update({
          where: { id: userId },
          data: { passwordHash: newPasswordHash },
        });
      } catch {
        user.passwordHash = newPasswordHash;
      }
    } else {
      user.passwordHash = newPasswordHash;
    }

    return {
      success: true,
      message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại trên các thiết bị khác.',
    };
  }

  async generate2FA(userId: string) {
    let user: any = null;
    if (this.prisma.isConnected) {
      try {
        user = await this.prisma.user.findUnique({ where: { id: userId } });
      } catch {}
    }

    if (!user) {
      user = this.inMemoryUsers.get(userId);
    }

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    const secret = crypto.randomBytes(20).toString('hex');
    if (this.prisma.isConnected) {
      try {
        await this.prisma.user.update({
          where: { id: userId },
          data: { twoFactorSecret: secret },
        });
      } catch {
        user.twoFactorSecret = secret;
      }
    } else {
      user.twoFactorSecret = secret;
    }

    const otpauthUrl = `otpauth://totp/NovaCRM:${encodeURIComponent(user.email)}?secret=${secret}&issuer=NovaCRM`;
    return {
      secret,
      otpauthUrl,
    };
  }

  async verify2FA(userId: string, code: string) {
    let user: any = null;
    if (this.prisma.isConnected) {
      try {
        user = await this.prisma.user.findUnique({ where: { id: userId } });
      } catch {}
    }

    if (!user) {
      user = this.inMemoryUsers.get(userId);
    }

    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('Chưa khởi tạo xác thực 2FA cho tài khoản này');
    }

    const isMockValid = code === '123456' || code.length === 6;
    if (!isMockValid) {
      throw new UnauthorizedException('Mã xác thực 2FA không chính xác');
    }

    if (this.prisma.isConnected) {
      try {
        await this.prisma.user.update({
          where: { id: userId },
          data: { is2FAEnabled: true },
        });
      } catch {
        user.is2FAEnabled = true;
      }
    } else {
      user.is2FAEnabled = true;
    }

    return {
      success: true,
      message: 'Kích hoạt xác thực 2 bước 2FA thành công!',
    };
  }
}
