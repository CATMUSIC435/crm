import {
  GamificationQuestEntity,
  GamificationBadgeEntity,
  GamificationRewardEntity,
  LeaderboardAgentEntity,
} from '../../../domain/gamification.entity';

export const GAMIFICATION_REPOSITORY = Symbol('GAMIFICATION_REPOSITORY');

export interface GamificationRepositoryPort {
  findQuests(): Promise<GamificationQuestEntity[]>;
  findQuestByQuestId(questId: number): Promise<GamificationQuestEntity | null>;
  markQuestClaimed(questId: number): Promise<void>;
  findBadges(): Promise<GamificationBadgeEntity[]>;
  findRewards(): Promise<GamificationRewardEntity[]>;
  findRewardById(id: string): Promise<GamificationRewardEntity | null>;
  decrementRewardStock(id: string): Promise<void>;
  getUserExp(userId: string): Promise<{ exp: number; level: number }>;
  awardUserExp(userId: string, exp: number): Promise<{ newExp: number; newLevel: number }>;
  deductUserExp(userId: string, exp: number): Promise<{ remainingExp: number }>;
  getLeaderboardAgents(): Promise<LeaderboardAgentEntity[]>;
}
