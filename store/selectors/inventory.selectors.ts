import { InventoryItem } from '@/types';

export const selectFilteredUnits = (
  units: InventoryItem[],
  filters: { projectId: string; status: string; bedrooms: number | 'all'; maxPrice: number | 'all' }
) => {
  return units.filter((unit) => {
    const matchProject = filters.projectId === 'all' || unit.projectId === filters.projectId;
    const matchStatus = filters.status === 'all' || unit.status === filters.status;
    const matchBeds = filters.bedrooms === 'all' || unit.bedrooms === filters.bedrooms;
    const matchPrice = filters.maxPrice === 'all' || unit.price <= filters.maxPrice;
    return matchProject && matchStatus && matchBeds && matchPrice;
  });
};

export const selectInventoryStatusBreakdown = (units: InventoryItem[]) => {
  return units.reduce(
    (acc, unit) => {
      acc[unit.status] = (acc[unit.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
};
