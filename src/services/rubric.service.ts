import api from './api';
import { RubricConfig } from '@/types';

export const rubricService = {
  async getRubricConfig(): Promise<RubricConfig> {
    const response = await api.get<RubricConfig>('/api/v1/rubrics/active');
    return response.data;
  },

  async saveRubricConfig(config: RubricConfig): Promise<RubricConfig> {
    const response = await api.post<RubricConfig>('/api/v1/rubrics', config);
    return response.data;
  },
};
