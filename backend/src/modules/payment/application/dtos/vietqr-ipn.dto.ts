import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class VietQrIpnDto {
  @ApiProperty({ example: 'TXN-9988776655', description: 'Mã tham chiếu giao dịch ngân hàng / Napas' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ example: 100000000, description: 'Số tiền thực nhận (VNĐ)' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'BK-1001 NGUYEN VAN TUAN COC CAN NVW-01.01', description: 'Nội dung chuyển khoản' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'VCB', description: 'Mã ngân hàng nhận tiền' })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiPropertyOptional({ example: '0071000888999', description: 'Số tài khoản thụ hưởng của CĐT' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ example: '2026-10-03 12:20:00' })
  @IsOptional()
  @IsString()
  transactionDate?: string;

  @ApiPropertyOptional({ example: 'd3b07384d113edec49eaa6238ad5ff00', description: 'Chữ ký số xác thực HMAC SHA-256 từ cổng VietQR' })
  @IsOptional()
  @IsString()
  signature?: string;
}
