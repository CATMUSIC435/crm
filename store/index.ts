// Export modular slices
export * from './slices/portfolio.slice';
export * from './slices/inventory.slice';
export * from './slices/booking.slice';
export * from './slices/customers.slice';
export * from './slices/contracts.slice';

// Export selectors
export * from './selectors/portfolio.selectors';
export * from './selectors/inventory.selectors';

// Backwards-compatible main store
export { useStore } from './useStore';
