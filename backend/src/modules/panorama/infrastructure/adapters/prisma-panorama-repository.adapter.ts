import { Injectable } from '@nestjs/common';
import { PanoramaRepositoryPort } from '../../application/ports/out/panorama-repository.port';
import { PanoramaTourEntity } from '../../domain/panorama-tour.entity';
import { PrismaService } from '../../../../database/prisma.service';

const INITIAL_TOUR_PROJECTS: Record<string, any> = {
  p1: {
    id: 'p1',
    projectId: 'p1',
    name: 'NovaWorld Phan Thiet',
    developer: 'Novaland',
    unitCode: 'NVW-01.01',
    unitTitle: 'Biệt Thự Đơn Lập Florida 01.01 Hướng Biển',
    type: 'Biệt thự biển đơn lập',
    price: 25000000000,
    area: 250,
    bedrooms: 4,
    bathrooms: 4,
    location: 'Tiến Thành, Phan Thiết, Bình Thuận',
    rooms: [
      {
        id: 'p1-living',
        name: 'Phòng Khách Panorama',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
        preset: 'living_room',
        measurements: { width: '8.5m', height: '3.6m', area: '45.2 m²' },
        portals: [
          { position: [4, 0, -2], label: 'Sang Phòng Ngủ Master', targetRoomId: 'p1-master' },
          { position: [-4, 0, 1], label: 'Ra Hồ Bơi Vô Cực', targetRoomId: 'p1-pool' },
        ],
        specs: [
          {
            position: [2.5, 0.5, -3],
            title: 'Sofa Da Bò Ý Poltrona Frau',
            subtitle: 'Bộ sưu tập Archibald Limited Edition',
            brand: 'Poltrona Frau',
            origin: 'Tolentino, Italy',
            warranty: '10 năm chính hãng',
            description: 'Khung gỗ sồi tự nhiên, bọc da Pelle Frau® cao cấp kháng khuẩn và tia UV.',
          },
          {
            position: [-2.8, -0.2, -2.5],
            title: 'Hệ Thống Đèn Chùm Pha Lê Baccarat',
            subtitle: 'Zenith 24 Lights Chandelier',
            brand: 'Baccarat',
            origin: 'Baccarat, France',
            warranty: 'Bảo hành vĩnh viễn cấu trúc pha lê',
            description: 'Pha lê chế tác thủ công tinh xảo, tích hợp công nghệ Smart Dimmable.',
          },
        ],
      },
      {
        id: 'p1-master',
        name: 'Phòng Ngủ Master View Biển',
        thumbnail: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&q=80',
        preset: 'bedroom',
        measurements: { width: '7.2m', height: '3.4m', area: '38.5 m²' },
        portals: [{ position: [-3.5, 0, 2], label: 'Về Phòng Khách', targetRoomId: 'p1-living' }],
        specs: [
          {
            position: [0, -0.5, -3.2],
            title: 'Giường Nệm Hoàng Gia Hästens 2000T',
            subtitle: 'Handcrafted Masterpiece',
            brand: 'Hästens',
            origin: 'Köping, Sweden',
            warranty: '25 năm cam kết độ lún võng',
            description: '100% sợi len tự nhiên, lông đuôi ngựa và vải cotton jacquard cao cấp.',
          },
        ],
      },
    ],
    zones: [
      {
        id: 'z1',
        name: 'Phân Khu Florida 1 & 2',
        totalUnits: 1200,
        soldPercent: 94,
        priceFrom: '7.5 Tỷ',
        height: 12,
        color: '#f97316',
        description: 'Kiến trúc phong cách Mỹ ven biển sôi động.',
      },
      {
        id: 'z2',
        name: 'PGA Golf Villas',
        totalUnits: 524,
        soldPercent: 88,
        priceFrom: '15 Tỷ',
        height: 16,
        color: '#10b981',
        description: 'Đặc quyền nằm trọn trong lòng Sân Golf PGA 36 hố tiêu chuẩn quốc tế.',
      },
    ],
  },
  p2: {
    id: 'p2',
    projectId: 'p2',
    name: 'Aqua City',
    developer: 'Novaland',
    unitCode: 'AQC-05.12',
    unitTitle: 'Shophouse Marina Grand Walk Ven Sông',
    type: 'Shophouse thương mại ven sông',
    price: 18500000000,
    area: 160,
    bedrooms: 3,
    bathrooms: 4,
    location: 'Long Hưng, Biên Hòa, Đồng Nai',
    rooms: [
      {
        id: 'p2-commercial',
        name: 'Tầng Trệt Kinh Doanh F&B',
        thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80',
        preset: 'living_room',
        measurements: { width: '6.0m', height: '4.2m', area: '72.0 m²' },
        portals: [],
        specs: [
          {
            position: [1.5, 0, -2],
            title: 'Kính Low-E Cản Nhiệt Eurowindow',
            subtitle: 'Double Glazing Solar Control',
            brand: 'Eurowindow',
            origin: 'Việt Nam & Đức',
            warranty: '10 năm',
            description: 'Kính dán 2 lớp cản 99% tia UV và giảm tiếng ồn 45dB.',
          },
        ],
      },
    ],
    zones: [
      {
        id: 'az1',
        name: 'The Suite (Sun Harbor 1)',
        totalUnits: 800,
        soldPercent: 98,
        priceFrom: '12 Tỷ',
        height: 14,
        color: '#6366f1',
        description: 'Bến du thuyền Aqua Marina tiêu chuẩn quốc tế.',
      },
    ],
  },
  p3: {
    id: 'p3',
    projectId: 'p3',
    name: 'The Grand Manhattan',
    developer: 'Novaland',
    unitCode: 'TGM-18.04',
    unitTitle: 'Sky Penthouse Duplex Triệu Đô Lõi Quận 1',
    type: 'Penthouse Duplex',
    price: 45000000000,
    area: 320,
    bedrooms: 4,
    bathrooms: 5,
    location: '17 Cô Bắc - Cô Giang, Quận 1, TP.HCM',
    rooms: [
      {
        id: 'p3-penthouse',
        name: 'Phòng Khách Duplex Thông Tầng',
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
        preset: 'living_room',
        measurements: { width: '10.5m', height: '6.5m', area: '85.0 m²' },
        portals: [],
        specs: [
          {
            position: [2.0, 1.2, -3.0],
            title: 'Hệ Thống Thiết Bị Vệ Sinh Mạ Vàng Grohe Grandera',
            subtitle: 'Warm Sunset 24K PVD Coating',
            brand: 'Grohe',
            origin: 'Hemer, Germany',
            warranty: '15 năm',
            description: 'Đỉnh cao sen tắm nhiệt độ ổn định và cảm biến thông minh.',
          },
        ],
      },
    ],
    zones: [
      {
        id: 'gm1',
        name: 'Tháp Manhattan & Tháp Pasteur',
        totalUnits: 967,
        soldPercent: 91,
        priceFrom: '15 Tỷ',
        height: 39,
        color: '#e11d48',
        description: '39 tầng căn hộ hạng sang và khách sạn 5 sao quốc tế.',
      },
    ],
  },
};

@Injectable()
export class PrismaPanoramaRepositoryAdapter implements PanoramaRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTours(): Promise<PanoramaTourEntity[]> {
    if (!this.prisma.isConnected) {
      return this.getMockEntities();
    }

    try {
      const records = await this.prisma.panoramaTour.findMany();
      if (records.length === 0) {
        return this.getMockEntities();
      }
      return records.map(
        (r) =>
          new PanoramaTourEntity(
            r.id,
            r.projectId,
            this.getProjectName(r.projectId),
            'Novaland',
            r.unitCode,
            r.unitTitle,
            r.type,
            Number(r.price),
            r.area,
            r.bedrooms,
            r.bathrooms,
            r.location,
            r.rooms as any,
            (r.zones as any) || [],
          ),
      );
    } catch {
      return this.getMockEntities();
    }
  }

  async getTourByProjectId(projectId: string): Promise<PanoramaTourEntity | null> {
    const all = await this.getAllTours();
    return (
      all.find(
        (t) =>
          t.projectId.toLowerCase() === projectId.toLowerCase() ||
          t.unitCode.toLowerCase().includes(projectId.toLowerCase()),
      ) || null
    );
  }

  async saveTour(tour: PanoramaTourEntity): Promise<void> {
    if (!this.prisma.isConnected) return;
    try {
      await this.prisma.panoramaTour.upsert({
        where: { unitCode: tour.unitCode },
        create: {
          id: tour.id,
          projectId: tour.projectId,
          unitCode: tour.unitCode,
          unitTitle: tour.unitTitle,
          type: tour.type,
          price: tour.price,
          area: tour.area,
          bedrooms: tour.bedrooms,
          bathrooms: tour.bathrooms,
          location: tour.location,
          rooms: tour.rooms as any,
          zones: tour.zones as any,
        },
        update: {
          rooms: tour.rooms as any,
          zones: tour.zones as any,
        },
      });
    } catch {
      // In-memory fallback
    }
  }

  private getProjectName(projectId: string): string {
    switch (projectId.toLowerCase()) {
      case 'p1': return 'NovaWorld Phan Thiet';
      case 'p2': return 'Aqua City';
      case 'p3': return 'The Grand Manhattan';
      default: return 'Đại Đô Thị Novaland';
    }
  }

  private getMockEntities(): PanoramaTourEntity[] {
    return Object.values(INITIAL_TOUR_PROJECTS).map(
      (p) =>
        new PanoramaTourEntity(
          p.id,
          p.projectId,
          p.name,
          p.developer,
          p.unitCode,
          p.unitTitle,
          p.type,
          p.price,
          p.area,
          p.bedrooms,
          p.bathrooms,
          p.location,
          p.rooms,
          p.zones,
        ),
    );
  }
}
