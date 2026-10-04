import { Controller, Get, Post, Param, Body, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DOCUMENT_AI_USE_CASE, DocumentAiUseCase } from '../../application/ports/in/document-ai.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Trí Tuệ Nhân Tạo OCR Bóc Tách Hồ Sơ (Document-AI)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/document-ai')
export class DocumentAiController {
  constructor(
    @Inject(DOCUMENT_AI_USE_CASE)
    private readonly documentAiUseCase: DocumentAiUseCase,
  ) {}

  @Post('scan')
  @ApiOperation({ summary: 'Bóc tách dữ liệu OCR từ CCCD gắn chip hoặc Sổ hồng' })
  async scanDocument(@Body() body: any) {
    return await this.documentAiUseCase.scanDocument(body);
  }

  @Get('history')
  @ApiOperation({ summary: 'Lịch sử quét tài liệu OCR và độ tin cậy trích xuất' })
  async getHistory() {
    return await this.documentAiUseCase.getHistory();
  }

  @Post(':id/verify-kyc')
  @ApiOperation({ summary: 'Xác thực chuẩn hóa CCCD 12 số và định danh KYC' })
  async verifyKyc(@Param('id') id: string) {
    return await this.documentAiUseCase.verifyKyc(id);
  }
}
