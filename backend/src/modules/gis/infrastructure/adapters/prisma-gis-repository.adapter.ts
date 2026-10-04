import { Injectable } from '@nestjs/common';
import { GisRepositoryPort } from '../../application/ports/out/gis-repository.port';
import { GisLayerEntity, ZoningMasterplanDetail } from '../../domain/gis-layer.entity';
import { PrismaService } from '../../../../database/prisma.service';

const ZONING_DATA_STORE: Record<string, ZoningMasterplanDetail> = {
  p1: {
    projectId: 'p1',
    projectName: 'NovaWorld Phan Thiet',
    decisionNumber: 'QĐ số 1826/QĐ-UBND',
    approvalDate: '15/08/2021',
    issuingAuthority: 'UBND Tỉnh Bình Thuận',
    scale: '1.000 Hecta (Siêu thành phố Biển)',
    buildingDensity: '25.6%',
    greenAndAmenityRatio: '55.4% (Sân Golf PGA 36 hố, Công viên 16ha)',
    farCoefficient: '1.2 lần',
    maxFloors: 'Biệt thự 1 - 3 tầng, Khách sạn 5 - 10 tầng',
    legalStatus: 'Quy hoạch chi tiết 1/500 hoàn thiện, Sổ hồng từng phân khu biệt thự',
    landUseTerm: 'Đất thương mại dịch vụ 50 năm & Lâu dài theo quy hoạch',
    infrastructureHighlights: [
      'Đường Hàm Kiệm - Tiến Thành kết nối trực diện Cao tốc Dầu Giây - Phan Thiết',
      'Đường bờ biển 7km với đại lộ thương mại Bikini Beach',
      'Cảng du thuyền quốc tế và sân bay Phan Thiết (dự kiến hoàn thành)',
    ],
    zoningClassification: 'Đất dịch vụ du lịch thương mại & Đô thị nghỉ dưỡng sinh thái',
  },
  p2: {
    projectId: 'p2',
    projectName: 'Aqua City',
    decisionNumber: 'QĐ số 3671/QĐ-UBND',
    approvalDate: '22/11/2020',
    issuingAuthority: 'UBND Tỉnh Đồng Nai',
    scale: '1.000 Hecta (Đô thị sinh thái thông minh)',
    buildingDensity: '30.0%',
    greenAndAmenityRatio: '70.0% (32km bờ sông Đồng Nai bao bọc)',
    farCoefficient: '1.8 lần',
    maxFloors: 'Nhà phố, Biệt thự, Shophouse 1 trệt 2 - 3 lầu',
    legalStatus: 'Phê duyệt điều chỉnh tổng thể 1/500, ngân hàng VPBank & MBBank cam kết bảo lãnh',
    landUseTerm: 'Sở hữu lâu dài (Sổ hồng từng căn)',
    infrastructureHighlights: [
      'Trục Hương Lộ 2 (60m) kết nối trực tiếp Cao tốc TP.HCM - Long Thành',
      'Cầu Vàm Cái Sứt hoàn thiện kết nối giao thông huyết mạch liên vùng',
      'Cách sân bay Quốc tế Long Thành chỉ 15 phút di chuyển',
    ],
    zoningClassification: 'Đất ở đô thị sinh thái kết hợp thương mại dịch vụ ven sông',
  },
  p3: {
    projectId: 'p3',
    projectName: 'The Grand Manhattan',
    decisionNumber: 'QĐ số 4125/QĐ-UBND',
    approvalDate: '10/04/2019',
    issuingAuthority: 'UBND Quận 1 & Sở Xây Dựng TP.HCM',
    scale: '1.4 Hecta (Tổ hợp Tháp đôi Căn hộ & Khách sạn 5*)',
    buildingDensity: '49.7%',
    greenAndAmenityRatio: '4.200 m² Công viên nội khu & Tiện ích resort tầng 3',
    farCoefficient: '8.5 lần',
    maxFloors: '39 tầng nổi + 4 tầng hầm đỗ xe thông minh',
    legalStatus: 'Giấy phép xây dựng đầy đủ, Đủ điều kiện bán nhà ở hình thành trong tương lai',
    landUseTerm: 'Lâu dài với người Việt Nam, 50 năm với người nước ngoài',
    infrastructureHighlights: [
      'Tọa lạc 2 mặt tiền Cô Giang - Cô Bắc, lõi trung tâm Quận 1',
      'Cách Ga ngầm Bến Thành (Metro Số 1) chỉ 800m',
      'Liền kề đại lộ Võ Văn Kiệt và hầm Thủ Thiêm kết nối TP. Thủ Đức',
    ],
    zoningClassification: 'Đất ở hỗn hợp kết hợp dịch vụ thương mại cao cấp',
  },
  p4: {
    projectId: 'p4',
    projectName: 'Eco Retreat Long An',
    decisionNumber: 'QĐ số 2145/QĐ-UBND',
    approvalDate: '08/03/2022',
    issuingAuthority: 'UBND Tỉnh Long An',
    scale: '220 Hecta (Đô thị sinh thái nghỉ dưỡng)',
    buildingDensity: '24.0%',
    greenAndAmenityRatio: '65.0% Cảnh quan ven sông Vàm Cỏ Đông',
    farCoefficient: '1.5 lần',
    maxFloors: 'Nhà phố vườn 3 tầng, Biệt thự đảo 2 - 3 tầng',
    legalStatus: 'Chấp thuận chủ trương đầu tư & phê duyệt 1/500 chuẩn mực',
    landUseTerm: 'Sổ hồng lâu dài',
    infrastructureHighlights: [
      'Nằm trên trục Vành Đai 4 và Cao tốc Bến Lức - Long Thành',
      'Cách Trung tâm TP.HCM 30 phút di chuyển',
    ],
    zoningClassification: 'Đất đô thị sinh thái kết hợp du lịch trải nghiệm',
  },
};

@Injectable()
export class PrismaGisRepositoryAdapter implements GisRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLayers(): Promise<GisLayerEntity[]> {
    if (!this.prisma.isConnected) {
      return this.getMockLayers();
    }

    try {
      const records = await this.prisma.gisLayer.findMany();
      if (records.length === 0) {
        return this.getMockLayers();
      }
      return records.map(
        (r) =>
          new GisLayerEntity(
            r.id,
            r.code,
            r.name,
            r.category as any,
            r.color || '#6366f1',
            r.badge || '',
            r.geoJson,
          ),
      );
    } catch {
      return this.getMockLayers();
    }
  }

  async getLayerByCode(code: string): Promise<GisLayerEntity | null> {
    const layers = await this.getAllLayers();
    return layers.find((l) => l.code === code) || null;
  }

  async getProjectsSpatial(): Promise<any[]> {
    if (!this.prisma.isConnected) {
      return this.getMockProjectsSpatial();
    }

    try {
      const raw = await this.prisma.project.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          location: true,
          developer: true,
          type: true,
          status: true,
          latitude: true,
          longitude: true,
          gisPolygonJson: true,
          aiAnalysis: true,
          targetRevenue: true,
          actualRevenue: true,
        },
      });

      return raw.map((p) => ({
        ...p,
        latitude: p.latitude || this.getDefaultLat(p.code),
        longitude: p.longitude || this.getDefaultLng(p.code),
        targetRevenue: Number(p.targetRevenue),
        actualRevenue: Number(p.actualRevenue),
      }));
    } catch {
      return this.getMockProjectsSpatial();
    }
  }

  async findProjectsWithinRadius(lat: number, lng: number, radiusKm: number): Promise<any[]> {
    const all = await this.getProjectsSpatial();
    return all.filter((p) => {
      if (!p.latitude || !p.longitude) return false;
      const d = this.calculateDistance(lat, lng, p.latitude, p.longitude);
      return d <= radiusKm;
    });
  }

  async getZoningByProjectId(projectId: string): Promise<ZoningMasterplanDetail | null> {
    // Tìm theo id hoặc code (p1, P01)
    const normalizedKey = projectId.toLowerCase().replace('0', '');
    return ZONING_DATA_STORE[normalizedKey] || ZONING_DATA_STORE[projectId] || null;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  private getDefaultLat(code: string): number {
    switch (code) {
      case 'P01': return 10.8231; // NovaWorld Phan Thiet
      case 'P02': return 10.9125; // Aqua City Đồng Nai
      case 'P03': return 10.7601; // The Grand Manhattan Quận 1
      case 'P04': return 10.6385; // Long An
      default: return 10.7769;    // TP.HCM Center
    }
  }

  private getDefaultLng(code: string): number {
    switch (code) {
      case 'P01': return 108.0645;
      case 'P02': return 106.8850;
      case 'P03': return 106.6948;
      case 'P04': return 106.4950;
      default: return 106.7009;
    }
  }

  private getMockLayers(): GisLayerEntity[] {
    return [
      new GisLayerEntity('1', 'metro-1', 'Tuyến Metro Số 1 (Bến Thành - Suối Tiên)', 'TRANSPORT', '#ef4444', '19.7 km', {
        type: 'LineString',
        coordinates: [[106.6983, 10.7725], [106.7032, 10.7765], [106.7215, 10.7950], [106.8042, 10.8580]],
      }),
      new GisLayerEntity('2', 'ringroad-3', 'Tuyến Vành Đai 3 TP.HCM', 'TRANSPORT', '#f97316', '76.3 km', {
        type: 'LineString',
        coordinates: [[106.6120, 10.7200], [106.7500, 10.8300], [106.8500, 10.9200]],
      }),
      new GisLayerEntity('3', 'highway-daugiay-phanthiet', 'Cao tốc Dầu Giây - Phan Thiết', 'TRANSPORT', '#10b981', '99 km', {
        type: 'LineString',
        coordinates: [[107.0500, 10.9200], [107.5000, 10.8800], [108.0600, 10.8200]],
      }),
      new GisLayerEntity('4', 'airport-longthanh', 'Quy hoạch Sân bay Quốc tế Long Thành', 'AIRPORT', '#f59e0b', '5.000 ha', {
        type: 'Polygon',
        coordinates: [[[106.9800, 10.7500], [107.0300, 10.7500], [107.0300, 10.8000], [106.9800, 10.8000], [106.9800, 10.7500]]],
      }),
      new GisLayerEntity('5', 'landprice-heatmap', 'Bản đồ Giá đất Heatmap', 'HEATMAP', '#f43f5e', 'Realtime', {
        type: 'PointCollection',
        features: [
          { coordinates: [106.6948, 10.7601], value: 450 }, // Triệu/m2
          { coordinates: [106.8850, 10.9125], value: 95 },
          { coordinates: [108.0645, 10.8231], value: 75 },
        ],
      }),
    ];
  }

  private getMockProjectsSpatial(): any[] {
    return [
      {
        id: 'p1',
        code: 'P01',
        name: 'NovaWorld Phan Thiet',
        location: 'Tiến Thành, TP. Phan Thiết, Bình Thuận',
        developer: 'Tập đoàn Novaland',
        type: 'Đô thị Du lịch Nghỉ dưỡng Sinh thái',
        status: 'OPENING',
        latitude: 10.8231,
        longitude: 108.0645,
        targetRevenue: 45000000000000,
        actualRevenue: 18200000000000,
      },
      {
        id: 'p2',
        code: 'P02',
        name: 'Aqua City',
        location: 'Long Hưng, TP. Biên Hòa, Tỉnh Đồng Nai',
        developer: 'Tập đoàn Novaland',
        type: 'Đô thị Sinh thái Thông minh',
        status: 'OPENING',
        latitude: 10.9125,
        longitude: 106.8850,
        targetRevenue: 30000000000000,
        actualRevenue: 14500000000000,
      },
      {
        id: 'p3',
        code: 'P03',
        name: 'The Grand Manhattan',
        location: '17 Cô Bắc - Cô Giang, Phường Cô Giang, Quận 1, TP.HCM',
        developer: 'Tập đoàn Novaland',
        type: 'Căn hộ Hạng sang & Khách sạn 5*',
        status: 'OPENING',
        latitude: 10.7601,
        longitude: 106.6948,
        targetRevenue: 12000000000000,
        actualRevenue: 8900000000000,
      },
    ];
  }
}
