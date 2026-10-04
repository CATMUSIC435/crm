import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@novacrm.com', description: 'Email nhân viên / môi giới' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'NovaCrm@2026', description: 'Mật khẩu đăng nhập' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'nguyen.vana@novacrm.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'NovaCrm@2026' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn Tuấn' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '0901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatar?: string;
  };
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...', description: 'Chuỗi refresh token để gia hạn phiên' })
  @IsString({ message: 'Refresh token phải là chuỗi' })
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  refreshToken: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword@123', description: 'Mật khẩu hiện tại' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
  oldPassword: string;

  @ApiProperty({ example: 'NewSecret@2026', description: 'Mật khẩu mới' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới tối thiểu 6 ký tự' })
  newPassword: string;
}

export class Verify2FaDto {
  @ApiProperty({ example: '123456', description: 'Mã OTP 6 số từ Google Authenticator' })
  @IsString()
  @MinLength(6, { message: 'Mã xác thực gồm 6 chữ số' })
  code: string;
}
