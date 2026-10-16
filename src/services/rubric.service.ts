import api from './api';
import { RubricConfig } from '@/types';
import { mockRubricConfig } from './mockData';

export const rubricService = {
  // Get active rubric settings
  async getRubricConfig(): Promise<RubricConfig> {
    try {
      const response = await api.get<RubricConfig>('/rubrics/active');
      return response.data;
    } catch {
      return mockRubricConfig;
    }
  },

  // Save rubric changes
  async saveRubricConfig(config: RubricConfig): Promise<RubricConfig> {
    try {
      const response = await api.post<RubricConfig>('/rubrics', config);
      return response.data;
    } catch {
      return config;
    }
  },
};
