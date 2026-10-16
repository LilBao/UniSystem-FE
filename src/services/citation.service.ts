import api from './api';
import { CitationClaim } from '@/types';
import { mockCitations } from './mockData';

export const citationService = {
  // Get citation claims for an evaluation
  async getCitations(evaluationId?: string): Promise<CitationClaim[]> {
    try {
      const response = await api.get<CitationClaim[]>(`/evaluations/${evaluationId || 'nhom-08'}/citations`);
      return response.data;
    } catch {
      return mockCitations;
    }
  },

  // Mark claim as reviewed
  async markViewed(claimId: string): Promise<boolean> {
    try {
      await api.patch(`/citations/${claimId}/review`, { viewed: true });
      return true;
    } catch {
      return true;
    }
  },

  // Add teacher note to claim
  async addNote(claimId: string, note: string): Promise<boolean> {
    try {
      await api.post(`/citations/${claimId}/note`, { note });
      return true;
    } catch {
      return true;
    }
  },
};
