import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateContractDto {
  @ApiProperty({ example: 'Hợp đồng mua bán', enum: ['Thỏa thuận giữ chỗ', 'Hợp đồng đặt cọc', 'Hợp đồng mua bán'] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'cust-id-1' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: 'unit-id-1' })
  @IsString()
  @IsNotEmpty()
  unitId: string;

  @ApiProperty({ example: 'p1' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 18500000000 })
  @IsNumber()
  value: number;
}

export class SignContractDto {
  @ApiProperty({ example: 'Nguyễn Văn Tuấn', description: 'Tên người đại diện ký hợp đồng' })
  @IsString()
  @IsNotEmpty()
  signerName: string;
}

export class RecordPaymentDto {
  @ApiProperty({ example: 1850000000, description: 'Số tiền thanh toán đợt tiếp theo' })
  @IsNumber()
  amount: number;
}
