import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'P01' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'NovaWorld Phan Thiet' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Phan Thiết, Bình Thuận' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Novaland' })
  @IsString()
  @IsNotEmpty()
  developer: string;

  @ApiProperty({ example: 'Biệt thự nghỉ dưỡng' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  totalUnits: number;

  @ApiProperty({ example: 8000000000000 })
  @IsNumber()
  targetRevenue: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1582719508461-905c673771fd' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 10.8711 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 107.9942 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
