import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super_secret_novacrm_jwt_key_2026_enterprise_production'),
    });
  }

  async validate(payload: any) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Token không hợp lệ hoặc thiếu thông tin định danh');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, role: true, fullName: true, branchId: true },
      });

      if (user) {
        return user;
      }
    } catch {
      // Trường hợp kết nối database bị gián đoạn, fallback an toàn từ thông tin JWT payload
    }

    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role, 
      fullName: payload.name || payload.email 
    };
  }
}
