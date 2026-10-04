import { CreateContractDto, SignContractDto, RecordPaymentDto } from '../../dtos/contract.dto';

export const CONTRACT_USE_CASE = Symbol('CONTRACT_USE_CASE');

export interface ContractUseCase {
  getContracts(projectId?: string): Promise<any[]>;
  getContractDetail(id: string): Promise<any>;
  createContract(dto: CreateContractDto, creatorId: string): Promise<any>;
  signContract(id: string, dto: SignContractDto, ipAddress: string): Promise<any>;
  recordPayment(id: string, dto: RecordPaymentDto): Promise<any>;
}
