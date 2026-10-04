import { Controller, Get, Post, Patch, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HANDOVER_USE_CASE, HandoverUseCase, CreateHandoverDto, CreateDefectDto } from '../../application/ports/in/handover.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { HandoverStatus, PinkBookStage } from '../../domain/handover-ticket.entity';

@ApiTags('Giai đoạn 4: Bàn giao & Snagging Defect (Handover Engine)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/handover')
export class HandoverController {
  constructor(
    @Inject(HANDOVER_USE_CASE)
    private readonly handoverUseCase: HandoverUseCase,
  ) {}

  @Get('tickets')
  @ApiOperation({ summary: 'Lấy danh sách tất cả hồ sơ bàn giao & tình trạng lỗi snagging' })
  async getAllTickets() {
    return await this.handoverUseCase.getAllTickets();
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Chi tiết hồ sơ bàn giao và danh sách lỗi công trình' })
  async getTicketById(@Param('id') id: string) {
    return await this.handoverUseCase.getTicketById(id);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Khởi tạo hồ sơ nghiệm thu bàn giao mới' })
  async createTicket(@Body() dto: CreateHandoverDto) {
    return await this.handoverUseCase.createTicket(dto);
  }

  @Get('checklist-template')
  @ApiOperation({ summary: 'Lấy bộ 50 tiêu chí kỹ thuật nghiệm thu tiêu chuẩn đại đô thị' })
  getChecklistTemplate() {
    return this.handoverUseCase.getChecklistTemplate();
  }

  @Post('tickets/:id/checklist')
  @ApiOperation({ summary: 'Gửi kết quả nghiệm thu 50 tiêu chí thực tế công trình' })
  async submitChecklist(@Param('id') id: string, @Body('checklist') checklist: any[]) {
    return await this.handoverUseCase.submitInspectionChecklist(id, checklist);
  }

  @Post('defects')
  @ApiOperation({ summary: 'Ghi nhận lỗi công trình cần khắc phục (Snagging Defect)' })
  async addDefect(@Body() dto: CreateDefectDto) {
    return await this.handoverUseCase.addDefect(dto);
  }

  @Patch('defects/:id/status')
  @ApiOperation({ summary: 'Cập nhật tiến độ khắc phục lỗi (Đang xử lý / Đã khắc phục)' })
  async updateDefectStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return await this.handoverUseCase.updateDefectStatus(id, status);
  }

  @Patch('tickets/:id/pink-book')
  @ApiOperation({ summary: 'Cập nhật tiến độ cấp sổ hồng qua 5 giai đoạn pháp lý' })
  async updatePinkBook(
    @Param('id') id: string,
    @Body('stage') stage: PinkBookStage,
    @Body('pinkBookNumber') pinkBookNumber?: string,
  ) {
    return await this.handoverUseCase.updatePinkBookStage(id, stage, pinkBookNumber);
  }

  @Patch('tickets/:id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái hồ sơ nghiệm thu' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: HandoverStatus,
  ) {
    return await this.handoverUseCase.updateTicketStatus(id, status);
  }

  @Post('tickets/:id/sign-off')
  @ApiOperation({ summary: 'Ký số biên bản bàn giao căn hộ giữa khách hàng và CĐT' })
  async signOff(
    @Param('id') id: string,
    @Body('signedDate') signedDate: string,
  ) {
    return await this.handoverUseCase.signOffHandover(id, signedDate);
  }
}
