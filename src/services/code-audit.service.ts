import api from './api';
import { CodeAuditClaim } from '@/types';
import { mockCodeAuditClaims } from './mockData';

export const codeAuditService = {
  // Get code vs report audit claims
  async getCodeAuditClaims(evaluationId?: string): Promise<CodeAuditClaim[]> {
    try {
      const response = await api.get<CodeAuditClaim[]>(`/evaluations/${evaluationId || 'nhom-08'}/code-audit`);
      return response.data;
    } catch {
      return mockCodeAuditClaims;
    }
  },

  // Request clarification from students
  async requestClarification(claimId: string, message: string): Promise<boolean> {
    try {
      await api.post(`/code-audit/${claimId}/request-clarify`, { message });
      return true;
    } catch {
      return true;
    }
  },

  // Mark claim as verified by teacher
  async markVerified(claimId: string): Promise<boolean> {
    try {
      await api.patch(`/code-audit/${claimId}/verify`, { verified: true });
      return true;
    } catch {
      return true;
    }
  },
};
