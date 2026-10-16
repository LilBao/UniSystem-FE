import api from './api';
import { AiSignalAnalysis } from '@/types';
import { mockAiSignal } from './mockData';

export const aiSignalService = {
  // Get AI signal analysis results
  async getAiSignal(evaluationId?: string): Promise<AiSignalAnalysis> {
    try {
      const response = await api.get<AiSignalAnalysis>(`/evaluations/${evaluationId || 'nhom-08'}/ai-signal`);
      return response.data;
    } catch {
      return mockAiSignal;
    }
  },

  // Add teacher note to AI signal report
  async addTeacherNote(evaluationId: string, note: string): Promise<boolean> {
    try {
      await api.post(`/evaluations/${evaluationId}/ai-signal/note`, { note });
      return true;
    } catch {
      return true;
    }
  },
};
