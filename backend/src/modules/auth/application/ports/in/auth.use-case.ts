import { LoginDto, RegisterDto, AuthResponseDto, ChangePasswordDto } from '../../dtos/auth.dto';

export const AUTH_USE_CASE = Symbol('AUTH_USE_CASE');

export interface AuthUseCase {
  login(dto: LoginDto): Promise<AuthResponseDto>;
  register(dto: RegisterDto): Promise<AuthResponseDto>;
  getProfile(userId: string): Promise<any>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  changePassword(userId: string, dto: ChangePasswordDto): Promise<{ success: boolean; message: string }>;
  generate2FA(userId: string): Promise<{ secret: string; otpauthUrl: string }>;
  verify2FA(userId: string, code: string): Promise<{ success: boolean; message: string }>;
}
