import { Controller, Post, Body, Get, UseGuards, Inject, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AUTH_USE_CASE, AuthUseCase } from '../../application/ports/in/auth.use-case';
import { LoginDto, RegisterDto, AuthResponseDto, RefreshTokenDto, ChangePasswordDto, Verify2FaDto } from '../../application/dtos/auth.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

@ApiTags('Xác Thực & Phân Quyền Tài Khoản (Auth & RBAC)')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    @Inject(AUTH_USE_CASE)
    private readonly authUseCase: AuthUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập hệ thống cấp quyền Access Token & Refresh Token' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return await this.authUseCase.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản môi giới kinh doanh mới' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authUseCase.register(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Làm mới Access Token thông qua Refresh Token hợp lệ' })
  @ApiResponse({ status: 200, description: 'Cấp cặp token mới' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return await this.authUseCase.refreshToken(dto.refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ của tài khoản đang đăng nhập' })
  async getProfile(@CurrentUser('id') userId: string) {
    return await this.authUseCase.getProfile(userId);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đổi mật khẩu người dùng đang đăng nhập' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return await this.authUseCase.changePassword(userId, dto);
  }

  @Post('2fa/generate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Khởi tạo mã bí mật và URI QR-Code xác thực 2 bước (2FA)' })
  async generate2FA(@CurrentUser('id') userId: string) {
    return await this.authUseCase.generate2FA(userId);
  }

  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xác thực OTP 6 số và kích hoạt bảo mật 2 bước 2FA' })
  async verify2FA(
    @CurrentUser('id') userId: string,
    @Body() dto: Verify2FaDto,
  ) {
    return await this.authUseCase.verify2FA(userId, dto.code);
  }
}
