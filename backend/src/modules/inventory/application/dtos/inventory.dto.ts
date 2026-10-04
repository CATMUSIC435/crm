import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterInventoryDto {
  @ApiPropertyOptional({ example: 'p1', description: 'ID dự án' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ example: 'AVAILABLE', enum: ['AVAILABLE', 'BOOKING', 'SOLD', 'LOCKED'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Biệt thự biển' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 5000000000 })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ example: 30000000000 })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ example: 'NVW' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class BatchLockDto {
  @ApiProperty({ example: ['unit-id-1', 'unit-id-2'], description: 'Danh sách ID căn hộ cần thao tác' })
  @IsArray()
  @IsNotEmpty()
  unitIds: string[];

  @ApiProperty({ example: 'LOCKED', enum: ['AVAILABLE', 'LOCKED'] })
  @IsEnum(['AVAILABLE', 'LOCKED'])
  targetStatus: 'AVAILABLE' | 'LOCKED';
}

export class CreateInventoryDto {
  @ApiProperty({ example: 'NVW-01.01' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'p1' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 'Biệt thự biển' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 18500000000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 200 })
  @IsNumber()
  area: number;

  @ApiPropertyOptional({ example: 'Khu Florida' })
  @IsOptional()
  @IsString()
  tower?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  floor?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @ApiPropertyOptional({ example: 'Đông Nam' })
  @IsOptional()
  @IsString()
  direction?: string;

  @ApiPropertyOptional({ example: 'Full nội thất' })
  @IsOptional()
  @IsString()
  handoverStandard?: string;
}
