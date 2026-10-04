import { Controller, Get, Post, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GAMIFICATION_USE_CASE, GamificationUseCase } from '../../application/ports/in/gamification.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Giai đoạn 5: Đua top & Thi đua kinh doanh (Gamification & Leaderboard)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/gamification')
export class GamificationController {
  constructor(
    @Inject(GAMIFICATION_USE_CASE)
    private readonly useCase: GamificationUseCase,
  ) {}

  @Get('quests')
  @ApiOperation({ summary: 'Lấy danh mục nhiệm vụ kinh doanh (Hàng ngày, Tuần, Săn Boss)' })
  async getQuests() {
    return await this.useCase.getQuests();
  }

  @Post('quests/:questId/claim')
  @ApiOperation({ summary: 'Nhận thưởng EXP sau khi hoàn thành nhiệm vụ' })
  async claimQuest(@Param('questId') questId: string, @Body('userId') userId?: string) {
    return await this.useCase.claimQuest(Number(questId), userId);
  }

  @Get('badges')
  @ApiOperation({ summary: 'Bộ sưu tập huy hiệu danh dự môi giới xuất sắc' })
  async getBadges() {
    return await this.useCase.getBadges();
  }

  @Get('rewards')
  @ApiOperation({ summary: 'Kho quà tặng đổi điểm EXP doanh nghiệp' })
  async getRewards() {
    return await this.useCase.getRewards();
  }

  @Post('rewards/:rewardId/redeem')
  @ApiOperation({ summary: 'Đổi điểm EXP lấy quà tặng' })
  async redeemReward(@Param('rewardId') rewardId: string, @Body('userId') userId?: string) {
    return await this.useCase.redeemReward(rewardId, userId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Bảng xếp hạng chiến binh kinh doanh hàng đầu' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'quarter'] })
  async getLeaderboard(@Query('period') period?: 'week' | 'month' | 'quarter') {
    return await this.useCase.getLeaderboard(period);
  }
}
