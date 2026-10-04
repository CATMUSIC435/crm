import { Controller, Get, Post, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  SURVEY_USE_CASE,
  SurveyUseCase,
  CreateSurveyCampaignDto,
  SubmitSurveyFeedbackDto,
} from '../../application/ports/in/survey.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Giai đoạn 5: Khảo sát sự hài lòng NPS/CSAT & Ý kiến cư dân (Surveys & Feedback)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/surveys')
export class SurveyController {
  constructor(
    @Inject(SURVEY_USE_CASE)
    private readonly useCase: SurveyUseCase,
  ) {}

  @Get('campaigns')
  @ApiOperation({ summary: 'Lấy danh sách chiến dịch khảo sát NPS/CSAT' })
  async getCampaigns() {
    return await this.useCase.getCampaigns();
  }

  @Post('campaigns')
  @ApiOperation({ summary: 'Tạo chiến dịch khảo sát mới' })
  async createCampaign(@Body() dto: CreateSurveyCampaignDto) {
    return await this.useCase.createCampaign(dto);
  }

  @Post('feedback')
  @ApiOperation({ summary: 'Gửi đánh giá phản hồi từ khách hàng / cư dân' })
  async submitFeedback(@Body() dto: SubmitSurveyFeedbackDto) {
    return await this.useCase.submitFeedback(dto);
  }

  @Get('feedback')
  @ApiOperation({ summary: 'Xem toàn bộ ý kiến đánh giá & phản hồi' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'sentiment', required: false })
  async getFeedbacks(
    @Query('category') category?: string,
    @Query('sentiment') sentiment?: string,
  ) {
    return await this.useCase.getFeedbacks(category, sentiment);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Báo cáo chỉ số CSAT, NPS, phân tích cảm xúc (Sentiment) & tỷ lệ hài lòng' })
  async getMetrics() {
    return await this.useCase.getMetrics();
  }
}
