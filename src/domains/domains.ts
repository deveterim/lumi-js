import { HttpClient } from '../common/client';
import { LumiResponse } from '../common/response';
import { DomainItem } from './interfaces/domain';

export class Domains {
  constructor(private readonly client: HttpClient) {}

  async create(payload: { name: string; region?: string }): Promise<LumiResponse<DomainItem>> {
    return this.client.post<DomainItem>('/domains', payload);
  }

  async list(): Promise<LumiResponse<{ data: DomainItem[] }>> {
    return this.client.get<{ data: DomainItem[] }>('/domains');
  }

  async get(id: string): Promise<LumiResponse<DomainItem>> {
    return this.client.get<DomainItem>(`/domains/${id}`);
  }

  async verify(id: string): Promise<LumiResponse<DomainItem>> {
    return this.client.post<DomainItem>(`/domains/${id}/verify`);
  }

  async remove(id: string): Promise<LumiResponse<{ id: string; deleted: boolean }>> {
    return this.client.delete<{ id: string; deleted: boolean }>(`/domains/${id}`);
  }
}
