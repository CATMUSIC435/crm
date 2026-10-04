export class GisCoordinate {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Vĩ độ không hợp lệ (Phải từ -90 đến 90 độ)');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Kinh độ không hợp lệ (Phải từ -180 đến 180 độ)');
    }
  }

  /**
   * Tính khoảng cách đường chim bay (Haversine Formula) theo kilomet
   */
  public distanceToKm(other: GisCoordinate): number {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = ((other.latitude - this.latitude) * Math.PI) / 180;
    const dLon = ((other.longitude - this.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.latitude * Math.PI) / 180) *
        Math.cos((other.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }
}
