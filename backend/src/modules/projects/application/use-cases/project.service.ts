import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ProjectUseCase } from '../ports/in/project.use-case';
import { CreateProjectDto } from '../dtos/project.dto';
import { PrismaService } from '../../../../database/prisma.service';

const SEED_PROJECTS = [
  {
    id: 'p1',
    code: 'P01',
    name: 'NovaWorld Phan Thiet',
    location: 'Phan Thiết, Bình Thuận',
    developer: 'Novaland',
    type: 'Biệt thự nghỉ dưỡng',
    totalUnits: 10000,
    targetRevenue: 8000000000000,
    status: 'OPENING',
    thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    latitude: 10.8711,
    longitude: 107.9942,
    _count: { units: 10000, bookings: 120, contracts: 6500 },
  },
  {
    id: 'p2',
    code: 'P02',
    name: 'Aqua City',
    location: 'Biên Hòa, Đồng Nai',
    developer: 'Novaland',
    type: 'Nhà phố thương mại',
    totalUnits: 15000,
    targetRevenue: 15000000000000,
    status: 'HANDED_OVER',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    latitude: 10.9022,
    longitude: 106.8433,
    _count: { units: 15000, bookings: 50, contracts: 12000 },
  },
  {
    id: 'p3',
    code: 'P03',
    name: 'The Grand Manhattan',
    location: 'Quận 1, TP.HCM',
    developer: 'Novaland',
    type: 'Căn hộ cao cấp',
    totalUnits: 1000,
    targetRevenue: 10000000000000,
    status: 'UPCOMING',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    latitude: 10.7626,
    longitude: 106.6952,
    _count: { units: 1000, bookings: 35, contracts: 800 },
  },
  {
    id: 'p4',
    code: 'P04',
    name: 'Vinhomes Grand Park',
    location: 'TP. Thủ Đức, TP.HCM',
    developer: 'Vingroup',
    type: 'Căn hộ cao cấp',
    totalUnits: 44000,
    targetRevenue: 40000000000000,
    status: 'OPENING',
    thumbnail: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
    latitude: 10.8444,
    longitude: 106.8375,
    _count: { units: 44000, bookings: 250, contracts: 41000 },
  },
  {
    id: 'p5',
    code: 'P05',
    name: 'The Global City',
    location: 'An Phú, TP. Thủ Đức',
    developer: 'Masterise Homes',
    type: 'Nhà phố thương mại',
    totalUnits: 1800,
    targetRevenue: 25000000000000,
    status: 'OPENING',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    latitude: 10.7938,
    longitude: 106.7656,
    _count: { units: 1800, bookings: 80, contracts: 1400 },
  },
];

@Injectable()
export class ProjectService implements ProjectUseCase {
  private inMemoryProjects: any[] = [...SEED_PROJECTS];

  constructor(private readonly prisma: PrismaService) {}

  async getProjects(status?: string) {
    if (this.prisma.isConnected) {
      try {
        const where: any = status ? { status } : {};
        const res = await this.prisma.project.findMany({
          where,
          include: {
            _count: {
              select: { units: true, bookings: true, contracts: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        if (res && res.length > 0) return res;
      } catch {}
    }

    // Fallback bộ nhớ nếu DB chưa nạp hoặc offline
    if (status) {
      return this.inMemoryProjects.filter((p) => p.status === status);
    }
    return this.inMemoryProjects;
  }

  async getProjectDetail(id: string) {
    if (this.prisma.isConnected) {
      try {
        const project = await this.prisma.project.findUnique({
          where: { id },
          include: {
            units: { take: 100 },
            _count: { select: { units: true, bookings: true, contracts: true } },
          },
        });
        if (project) return project;
      } catch {}
    }

    const found = this.inMemoryProjects.find((p) => p.id === id || p.code === id);
    if (!found) {
      throw new NotFoundException(`Không tìm thấy đại dự án với ID: ${id}`);
    }
    return {
      ...found,
      units: [],
      aiAnalysis: {
        summary: `Đại dự án ${found.name} vị trí đắc địa tại ${found.location}.`,
        rating: 'STRONG BUY',
        confidence: 94,
        paybackPeriod: '8.5 Năm',
        capitalGain: '+18% / năm',
      },
    };
  }

  async createProject(dto: CreateProjectDto) {
    if (this.prisma.isConnected) {
      try {
        const existing = await this.prisma.project.findUnique({ where: { code: dto.code } });
        if (existing) {
          throw new ConflictException(`Mã dự án ${dto.code} đã tồn tại trong hệ thống`);
        }

        return await this.prisma.project.create({
          data: {
            code: dto.code,
            name: dto.name,
            location: dto.location,
            developer: dto.developer,
            type: dto.type,
            totalUnits: dto.totalUnits,
            targetRevenue: dto.targetRevenue,
            thumbnail: dto.thumbnail,
            latitude: dto.latitude,
            longitude: dto.longitude,
          },
        });
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
      }
    }

    const newProject = {
      id: `p-${Date.now()}`,
      code: dto.code,
      name: dto.name,
      location: dto.location,
      developer: dto.developer,
      type: dto.type,
      totalUnits: dto.totalUnits || 0,
      targetRevenue: dto.targetRevenue || 0,
      status: 'UPCOMING',
      thumbnail: dto.thumbnail || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      latitude: dto.latitude || 10.7769,
      longitude: dto.longitude || 106.7009,
      _count: { units: 0, bookings: 0, contracts: 0 },
    };
    this.inMemoryProjects.unshift(newProject);
    return newProject;
  }
}
