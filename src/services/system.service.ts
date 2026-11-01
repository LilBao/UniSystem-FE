import api from './api';
import { HealthResponse } from '@/types';

export const systemService = {
  async checkHealth(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  },
};
