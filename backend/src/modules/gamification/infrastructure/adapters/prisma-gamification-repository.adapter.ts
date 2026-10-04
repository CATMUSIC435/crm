import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { GamificationRepositoryPort } from '../../application/ports/out/gamification-repository.port';
import {
  GamificationQuestEntity,
  GamificationBadgeEntity,
  GamificationRewardEntity,
  LeaderboardAgentEntity,
} from '../../domain/gamification.entity';

@Injectable()
export class PrismaGamificationRepositoryAdapter implements GamificationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findQuests(): Promise<GamificationQuestEntity[]> {
    const list = await this.prisma.gamificationQuest.findMany({
      orderBy: { questId: 'asc' },
    });
    return list.map((q) => ({
      id: q.id,
      questId: q.questId,
      title: q.title,
      description: q.description,
      current: q.current,
      max: q.max,
      exp: q.exp,
      category: q.category,
      rewardClaimed: q.rewardClaimed,
      iconName: q.iconName,
    }));
  }

  async findQuestByQuestId(questId: number): Promise<GamificationQuestEntity | null> {
    const q = await this.prisma.gamificationQuest.findUnique({
      where: { questId },
    });
    if (!q) return null;
    return {
      id: q.id,
      questId: q.questId,
      title: q.title,
      description: q.description,
      current: q.current,
      max: q.max,
      exp: q.exp,
      category: q.category,
      rewardClaimed: q.rewardClaimed,
      iconName: q.iconName,
    };
  }

  async markQuestClaimed(questId: number): Promise<void> {
    await this.prisma.gamificationQuest.update({
      where: { questId },
      data: { rewardClaimed: true },
    });
  }

  async findBadges(): Promise<GamificationBadgeEntity[]> {
    const list = await this.prisma.gamificationBadge.findMany({
      orderBy: { badgeId: 'asc' },
    });
    return list.map((b) => ({
      id: b.id,
      badgeId: b.badgeId,
      name: b.name,
      description: b.description,
      category: b.category,
      color: b.color,
      unlocked: b.unlocked,
      unlockedDate: b.unlockedDate,
      bonusExp: b.bonusExp,
      rarity: b.rarity,
    }));
  }

  async findRewards(): Promise<GamificationRewardEntity[]> {
    const list = await this.prisma.gamificationReward.findMany({
      orderBy: { costExp: 'asc' },
    });
    return list.map((r) => ({
      id: r.id,
      title: r.title,
      costExp: r.costExp,
      category: r.category,
      stock: r.stock,
      description: r.description,
      image: r.image,
    }));
  }

  async findRewardById(id: string): Promise<GamificationRewardEntity | null> {
    const r = await this.prisma.gamificationReward.findUnique({ where: { id } });
    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      costExp: r.costExp,
      category: r.category,
      stock: r.stock,
      description: r.description,
      image: r.image,
    };
  }

  async decrementRewardStock(id: string): Promise<void> {
    await this.prisma.gamificationReward.update({
      where: { id },
      data: { stock: { decrement: 1 } },
    });
  }

  async getUserExp(userId: string): Promise<{ exp: number; level: number }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return { exp: user?.exp || 0, level: user?.level || 1 };
  }

  async awardUserExp(userId: string, exp: number): Promise<{ newExp: number; newLevel: number }> {
    const current = await this.getUserExp(userId);
    const newExp = current.exp + exp;
    const newLevel = Math.max(1, Math.floor(newExp / 3000) + 1);

    await this.prisma.user.update({
      where: { id: userId },
      data: { exp: newExp, level: newLevel },
    });

    return { newExp, newLevel };
  }

  async deductUserExp(userId: string, exp: number): Promise<{ remainingExp: number }> {
    const current = await this.getUserExp(userId);
    const remainingExp = Math.max(0, current.exp - exp);
    await this.prisma.user.update({
      where: { id: userId },
      data: { exp: remainingExp },
    });
    return { remainingExp };
  }

  async getLeaderboardAgents(): Promise<LeaderboardAgentEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { role: { in: ['AGENT', 'TEAM_LEADER', 'SUPER_ADMIN'] } },
      orderBy: { exp: 'desc' },
      take: 10,
    });

    return users.map((u, idx) => ({
      rank: idx + 1,
      id: u.id,
      name: u.fullName,
      avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`,
      dealsCount: Math.max(2, Math.floor(u.exp / 2500)),
      revenue: Math.max(5000000000, u.exp * 2000000),
      exp: u.exp,
      level: u.level,
      badgesCount: Math.min(12, Math.max(1, Math.floor(u.level * 1.5))),
      teamName: u.role === 'TEAM_LEADER' ? 'Diamond Alpha Leader' : 'Chiến Binh Novaland Elite',
    }));
  }
}
