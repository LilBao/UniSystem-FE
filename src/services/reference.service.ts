import api from './api';
import { ReferenceResolutionSummary } from '@/types';

export const referenceService = {
  async resolveReferences(submissionId: string): Promise<ReferenceResolutionSummary> {
    const response = await api.post<Record<string, number>>(
      `/api/v1/submissions/${submissionId}/references/resolve`
    );
    const data = response.data;
    return {
      total: data.total ?? 0,
      resolved: data.resolved ?? 0,
      ambiguous: data.ambiguous ?? 0,
      not_found: data.not_found ?? 0,
      unresolved: data.unresolved ?? 0,
    };
  },
};
