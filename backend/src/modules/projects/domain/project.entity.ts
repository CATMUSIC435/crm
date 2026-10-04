export class ProjectEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly location: string,
    public readonly developer: string,
    public readonly type: string,
    public readonly totalUnits: number,
    public readonly status: 'UPCOMING' | 'OPENING' | 'HANDED_OVER',
    public readonly targetRevenue: number,
    public actualRevenue: number = 0,
    public readonly thumbnail?: string,
    public readonly launchDate?: Date,
    public readonly handoverDate?: Date,
    public readonly latitude?: number,
    public readonly longitude?: number,
    public readonly aiAnalysis?: any,
  ) {}
}
