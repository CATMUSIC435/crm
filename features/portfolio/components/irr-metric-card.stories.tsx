import React from 'react';
import { IrrMetricCard } from './irr-metric-card';

export default {
  title: 'Features/Portfolio/IrrMetricCard',
  component: IrrMetricCard,
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <div className="max-w-md p-4">
        <Story />
      </div>
    ),
  ],
};

export const HighYieldVilla = {
  args: {
    propertyCode: 'NV-Aqua-A102',
    projectName: 'NovaWorld Phan Thiet',
    currentValuation: 28500000000,
    buyPrice: 18500000000,
    irr: 24.5,
    cagr: 15.2,
    rentalYield: 7.8,
    aiRecommendation: 'Tiếp tục tích sản sinh lời',
  },
};

export const UrbanCondoBalanced = {
  args: {
    propertyCode: 'OG-Sky-B205',
    projectName: 'The Origami - Vinhomes Grand Park',
    currentValuation: 4900000000,
    buyPrice: 4200000000,
    irr: 12.8,
    cagr: 8.0,
    rentalYield: 5.5,
    aiRecommendation: 'Cân nhắc tái cấu trúc vốn',
  },
};

export const CommercialShophouse = {
  args: {
    propertyCode: 'AQ-Suite-08',
    projectName: 'Aqua City The Phoenix',
    currentValuation: 21000000000,
    buyPrice: 14800000000,
    irr: 19.3,
    cagr: 12.4,
    rentalYield: 8.9,
    aiRecommendation: 'Gia tăng tỷ trọng đầu tư',
  },
};
