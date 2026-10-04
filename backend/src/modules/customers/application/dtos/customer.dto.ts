import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Nguyễn Văn Tuấn' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '0901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'tuan.nguyen@investor.vn' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '079085001234', description: 'Số CCCD 12 số' })
  @IsOptional()
  @IsString()
  idCardNumber?: string;

  @ApiPropertyOptional({ example: 'POTENTIAL', enum: ['DIAMOND_VVIP', 'PLATINUM_VIP', 'POTENTIAL', 'NEW'] })
  @IsOptional()
  @IsString()
  rank?: string;
}

export class FilterCustomerDto {
  @ApiPropertyOptional({ example: 'Tuấn' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'DIAMOND_VVIP' })
  @IsOptional()
  @IsString()
  rank?: string;

  @ApiPropertyOptional({ example: 'Đã giao dịch' })
  @IsOptional()
  @IsString()
  status?: string;
}
