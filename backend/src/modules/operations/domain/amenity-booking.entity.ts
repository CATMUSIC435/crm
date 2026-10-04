export type AmenityBookingStatus = 'da_xac_nhan' | 'da_checkin' | 'da_huy';

export class AmenityBookingEntity {
  constructor(
    public readonly id: string,
    public readonly amenityType: string,
    public readonly propertyCode: string,
    public readonly residentName: string,
    public readonly residentPhone: string | null,
    public readonly bookingDate: string,
    public readonly timeSlot: string,
    public readonly guestsCount: number,
    public status: AmenityBookingStatus = 'da_xac_nhan',
  ) {}

  public checkIn(): void {
    this.status = 'da_checkin';
  }

  public cancel(): void {
    this.status = 'da_huy';
  }
}
