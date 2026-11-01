import api from './api';
import { EvaluationItem } from '@/types';

export const evaluationService = {
  async getEvaluations(params?: { status?: string; search?: string }): Promise<EvaluationItem[]> {
    const response = await api.get<EvaluationItem[]>('/api/v1/evaluations', { params });
    return response.data;
  },

  async getEvaluationById(id: string): Promise<EvaluationItem | null> {
    const response = await api.get<EvaluationItem>(`/api/v1/evaluations/${id}`);
    return response.data;
  },

  async createEvaluation(data: Partial<EvaluationItem>): Promise<EvaluationItem> {
    const response = await api.post<EvaluationItem>('/api/v1/evaluations', data);
    return response.data;
  },

  async updateDecision(
    id: string,
    payload: { score?: number; comments?: string; status?: string }
  ): Promise<boolean> {
    await api.patch(`/api/v1/evaluations/${id}/decision`, payload);
    return true;
  },
};
