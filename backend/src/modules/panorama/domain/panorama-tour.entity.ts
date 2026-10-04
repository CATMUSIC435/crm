export interface HotspotSpec {
  position: [number, number, number];
  title: string;
  subtitle: string;
  brand: string;
  origin: string;
  warranty: string;
  description: string;
}

export interface RoomPortal {
  position: [number, number, number];
  label: string;
  targetRoomId: string;
}

export interface RoomData {
  id: string;
  name: string;
  thumbnail: string;
  preset: string;
  measurements: {
    width: string;
    height: string;
    area: string;
  };
  portals: RoomPortal[];
  specs: HotspotSpec[];
}

export interface MasterPlanZone {
  id: string;
  name: string;
  totalUnits: number;
  soldPercent: number;
  priceFrom: string;
  height: number;
  color: string;
  description: string;
}

export class PanoramaTourEntity {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly name: string,
    public readonly developer: string,
    public readonly unitCode: string,
    public readonly unitTitle: string,
    public readonly type: string,
    public readonly price: number,
    public readonly area: number,
    public readonly bedrooms: number,
    public readonly bathrooms: number,
    public readonly location: string,
    public readonly rooms: RoomData[],
    public readonly zones: MasterPlanZone[],
  ) {}

  public getRoomById(roomId: string): RoomData | undefined {
    return this.rooms.find((r) => r.id === roomId);
  }

  public getTotalHotspots(): number {
    return this.rooms.reduce((acc, r) => acc + r.specs.length, 0);
  }
}
