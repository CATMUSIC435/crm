import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'unit-id-1', description: 'ID căn hộ muốn giữ chỗ' })
  @IsString()
  @IsNotEmpty()
  unitId: string;

  @ApiProperty({ example: 'cust-id-1', description: 'ID khách hàng đặt cọc' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: 'p1', description: 'ID dự án' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 100000000, description: 'Số tiền đặt cọc (VNĐ)' })
  @IsNumber()
  @Min(50000000, { message: 'Tiền cọc tối thiểu 50,000,000 VNĐ' })
  depositAmount: number;

  @ApiProperty({ example: 'Giữ chỗ có hoàn lại', enum: ['Giữ chỗ có hoàn lại', 'Giữ chỗ không hoàn lại', 'Ký HĐ Cọc'] })
  @IsString()
  bookingType: string;

  @ApiPropertyOptional({ example: 'high', enum: ['normal', 'high', 'urgent'] })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'Khách thanh toán chuyển khoản VietQR' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'https://cdn.novacrm.vn/unc-sample.jpg' })
  @IsOptional()
  @IsString()
  paymentProofUrl?: string;
}

export class ApproveBookingDto {
  @ApiPropertyOptional({ example: 'Đã kiểm tra chứng từ hợp lệ, duyệt khóa căn' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class RejectBookingDto {
  @ApiProperty({ example: 'Chứng từ chuyển tiền không hợp lệ, sai cú pháp' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class ExtendSlaDto {
  @ApiProperty({ example: 30, description: 'Số phút gia hạn thêm (VD: 30 phút)' })
  @IsNumber()
  minutes: number;

  @ApiPropertyOptional({ example: 'Chờ khách hàng bổ sung sao kê ủy nhiệm chi ngân hàng' })
  @IsOptional()
  @IsString()
  reason?: string;
}
