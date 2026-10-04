export interface MarketplaceListingEntity {
  id: string;
  code: string;
  title: string;
  price: number;
  priceFormatted: string;
  commSplit: string;
  f2Commission: string;
  f2CommissionRate: number;
  type: string;
  propertyCategory: string;
  location: string;
  district: string;
  ownerAgency: string;
  ownerAvatar?: string | null;
  ownerPhone?: string | null;
  image?: string | null;
  verified: boolean;
  exclusive: boolean;
  coBrokeringStatus: string;
}

export interface AgencyPartnerEntity {
  id: string;
  name: string;
  code: string;
  tier: string;
  phone: string;
  email?: string | null;
  activeListingsCount: number;
  successfulDealsCount: number;
  totalCommissionShared: number;
  rating: number;
  verified: boolean;
  avatar?: string | null;
  joinedDate: string;
}
