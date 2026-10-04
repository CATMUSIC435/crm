import { CreateCustomerDto, FilterCustomerDto } from '../../dtos/customer.dto';

export const CUSTOMER_USE_CASE = Symbol('CUSTOMER_USE_CASE');

export interface CustomerUseCase {
  getCustomers(filters: FilterCustomerDto, agentId?: string): Promise<any[]>;
  getCustomerDetail(id: string): Promise<any>;
  createCustomer(dto: CreateCustomerDto, agentId: string): Promise<any>;
}
