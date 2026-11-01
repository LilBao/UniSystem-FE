import api from './api';
import { CodeAuditClaim } from '@/types';

export const codeAuditService = {
  async getCodeAuditClaims(evaluationId: string): Promise<CodeAuditClaim[]> {
    const response = await api.get<CodeAuditClaim[]>(
      `/api/v1/evaluations/${evaluationId}/code-audit`
    );
    return response.data;
  },

  async requestClarification(claimId: string, message: string): Promise<boolean> {
    await api.post(`/api/v1/code-audit/${claimId}/request-clarify`, { message });
    return true;
  },

  async markVerified(claimId: string): Promise<boolean> {
    await api.patch(`/api/v1/code-audit/${claimId}/verify`, { verified: true });
    return true;
  },
};
