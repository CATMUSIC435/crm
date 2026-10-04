import { ResaleListingEntity } from './resale-listing.entity';
import { ClientDemandEntity } from './client-demand.entity';

export interface MatchResult {
  listing: ResaleListingEntity;
  score: number;
  matchReasons: string[];
}

export class MatchmakingEngine {
  /**
   * Tính toán điểm tương thích giữa Nhu cầu Khách hàng và Giỏ hàng Thứ cấp (0 - 100)
   */
  public static calculateMatchScore(demand: ClientDemandEntity, listing: ResaleListingEntity): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // 1. Loại giao dịch (Bán vs Thuê)
    if (demand.demandType !== listing.type) {
      return { score: 0, reasons: ['Khác hình thức giao dịch (Mua bán vs Cho thuê)'] };
    }

    // 2. Dự án mục tiêu (Trọng số 35 điểm)
    const isProjectMatched = demand.targetProjects.length === 0 || 
      demand.targetProjects.some(p => listing.projectName.toLowerCase().includes(p.toLowerCase()));
    
    if (isProjectMatched) {
      score += 35;
      reasons.push(`Thuộc dự án mong muốn: ${listing.projectName} (+35đ)`);
    }

    // 3. Tương thích khoảng giá (Trọng số 35 điểm)
    const price = listing.askingPrice;
    if (price >= demand.minPrice && price <= demand.maxPrice) {
      score += 35;
      reasons.push('Giá bán nằm trọn trong ngân sách dự kiến (+35đ)');
    } else if (price >= demand.minPrice * 0.9 && price <= demand.maxPrice * 1.1) {
      score += 20;
      reasons.push('Giá bán chênh lệch dưới 10% ngân sách (+20đ)');
    }

    // 4. Số phòng ngủ (Trọng số 20 điểm)
    if (demand.bedrooms === listing.bedrooms) {
      score += 20;
      reasons.push(`Đúng số phòng ngủ yêu cầu: ${listing.bedrooms}PN (+20đ)`);
    } else if (Math.abs(demand.bedrooms - listing.bedrooms) === 1) {
      score += 10;
      reasons.push(`Số phòng ngủ chênh lệch 1 phòng (+10đ)`);
    }

    // 5. Mức độ cấp bách (Bonus 10 điểm)
    if (demand.urgency.includes('gấp') || demand.urgency.includes('tuần')) {
      score += 10;
      reasons.push('Khách cần giao dịch gấp trong tuần (+10đ)');
    } else {
      score += 5;
    }

    return {
      score: Math.min(score, 100),
      reasons,
    };
  }

  public static matchDemandWithListings(demand: ClientDemandEntity, listings: ResaleListingEntity[]): MatchResult[] {
    const results: MatchResult[] = [];

    for (const listing of listings) {
      if (listing.status !== 'active') continue;
      const { score, reasons } = this.calculateMatchScore(demand, listing);
      if (score >= 40) {
        results.push({ listing, score, matchReasons: reasons });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }
}
