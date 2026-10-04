import {
  GamificationQuestEntity,
  GamificationBadgeEntity,
  GamificationRewardEntity,
  LeaderboardAgentEntity,
} from '../../../domain/gamification.entity';

export const GAMIFICATION_USE_CASE = Symbol('GAMIFICATION_USE_CASE');

export interface GamificationUseCase {
  getQuests(): Promise<GamificationQuestEntity[]>;
  claimQuest(questId: number, userId?: string): Promise<{ success: boolean; expAwarded: number; newExp: number; newLevel: number }>;
  getBadges(): Promise<GamificationBadgeEntity[]>;
  getRewards(): Promise<GamificationRewardEntity[]>;
  redeemReward(rewardId: string, userId?: string): Promise<{ success: boolean; reward: GamificationRewardEntity; remainingExp: number }>;
  getLeaderboard(period?: 'week' | 'month' | 'quarter'): Promise<LeaderboardAgentEntity[]>;
}
