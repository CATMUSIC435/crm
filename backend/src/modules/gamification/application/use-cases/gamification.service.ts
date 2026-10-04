import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { GamificationUseCase } from '../ports/in/gamification.use-case';
import { GAMIFICATION_REPOSITORY, GamificationRepositoryPort } from '../ports/out/gamification-repository.port';
import {
  GamificationQuestEntity,
  GamificationBadgeEntity,
  GamificationRewardEntity,
  LeaderboardAgentEntity,
} from '../../domain/gamification.entity';

@Injectable()
export class GamificationService implements GamificationUseCase {
  constructor(
    @Inject(GAMIFICATION_REPOSITORY)
    private readonly repo: GamificationRepositoryPort,
  ) {}

  async getQuests(): Promise<GamificationQuestEntity[]> {
    return await this.repo.findQuests();
  }

  async claimQuest(questId: number, userId: string = 'usr-admin-001'): Promise<{ success: boolean; expAwarded: number; newExp: number; newLevel: number }> {
    const quest = await this.repo.findQuestByQuestId(questId);
    if (!quest) throw new NotFoundException('Nhiệm vụ không tồn tại');
    if (quest.rewardClaimed) throw new BadRequestException('Nhiệm vụ này đã nhận thưởng');
    if (quest.current < quest.max) throw new BadRequestException('Chưa hoàn thành đủ tiến độ nhiệm vụ');

    await this.repo.markQuestClaimed(questId);
    const updated = await this.repo.awardUserExp(userId, quest.exp);

    return {
      success: true,
      expAwarded: quest.exp,
      newExp: updated.newExp,
      newLevel: updated.newLevel,
    };
  }

  async getBadges(): Promise<GamificationBadgeEntity[]> {
    return await this.repo.findBadges();
  }

  async getRewards(): Promise<GamificationRewardEntity[]> {
    return await this.repo.findRewards();
  }

  async redeemReward(rewardId: string, userId: string = 'usr-admin-001'): Promise<{ success: boolean; reward: GamificationRewardEntity; remainingExp: number }> {
    const reward = await this.repo.findRewardById(rewardId);
    if (!reward) throw new NotFoundException('Phần thưởng không tồn tại');
    if (reward.stock <= 0) throw new BadRequestException('Phần thưởng này đã hết quà');

    const userExp = await this.repo.getUserExp(userId);
    if (userExp.exp < reward.costExp) {
      throw new BadRequestException(`Bạn cần ${reward.costExp} EXP để đổi quà này (Hiện có ${userExp.exp} EXP).`);
    }

    const { remainingExp } = await this.repo.deductUserExp(userId, reward.costExp);
    await this.repo.decrementRewardStock(rewardId);

    return {
      success: true,
      reward,
      remainingExp,
    };
  }

  async getLeaderboard(period: 'week' | 'month' | 'quarter' = 'month'): Promise<LeaderboardAgentEntity[]> {
    return await this.repo.getLeaderboardAgents();
  }
}
