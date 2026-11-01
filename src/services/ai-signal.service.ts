import api from './api';
import { AiSignalAnalysis } from '@/types';

export const aiSignalService = {
  async getAiSignal(evaluationId: string): Promise<AiSignalAnalysis> {
    const response = await api.get<AiSignalAnalysis>(
      `/api/v1/evaluations/${evaluationId}/ai-signal`
    );
    return response.data;
  },

  async addTeacherNote(evaluationId: string, note: string): Promise<boolean> {
    await api.post(`/api/v1/evaluations/${evaluationId}/ai-signal/note`, { note });
    return true;
  },
};
