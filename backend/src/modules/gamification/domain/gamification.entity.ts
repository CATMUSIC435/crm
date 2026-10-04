export interface GamificationQuestEntity {
  id: string;
  questId: number;
  title: string;
  description: string;
  current: number;
  max: number;
  exp: number;
  category: 'daily' | 'weekly' | 'special' | string;
  rewardClaimed: boolean;
  iconName: string;
}

export interface GamificationBadgeEntity {
  id: string;
  badgeId: number;
  name: string;
  description: string;
  category: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string | null;
  bonusExp: number;
  rarity: 'Phổ biến' | 'Hiếm' | 'Sử thi' | 'Huyền thoại' | string;
}

export interface GamificationRewardEntity {
  id: string;
  title: string;
  costExp: number;
  category: string;
  stock: number;
  description?: string | null;
  image?: string | null;
}

export interface LeaderboardAgentEntity {
  rank: number;
  id: string;
  name: string;
  avatar?: string | null;
  dealsCount: number;
  revenue: number;
  exp: number;
  level: number;
  badgesCount: number;
  teamName: string;
}
