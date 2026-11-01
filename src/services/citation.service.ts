import api from './api';
import { CitationClaim } from '@/types';

export const citationService = {
  async getCitations(evaluationId: string): Promise<CitationClaim[]> {
    const response = await api.get<CitationClaim[]>(
      `/api/v1/evaluations/${evaluationId}/citations`
    );
    return response.data;
  },

  async markViewed(claimId: string): Promise<boolean> {
    await api.patch(`/api/v1/citations/${claimId}/review`, { viewed: true });
    return true;
  },

  async addNote(claimId: string, note: string): Promise<boolean> {
    await api.post(`/api/v1/citations/${claimId}/note`, { note });
    return true;
  },
};
