import api from './api';
import {
  SubmissionCreate,
  SubmissionResponse,
  ArtifactCreate,
  ArtifactResponse,
  PipelineRunResponse,
} from '@/types';

export const submissionService = {
  async createSubmission(
    body: SubmissionCreate,
    idempotencyKey?: string
  ): Promise<SubmissionResponse> {
    const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined;
    const response = await api.post<SubmissionResponse>('/api/v1/submissions', body, {
      headers,
    });
    return response.data;
  },

  async registerArtifact(
    submissionId: string,
    body: ArtifactCreate
  ): Promise<ArtifactResponse> {
    const response = await api.post<ArtifactResponse>(
      `/api/v1/submissions/${submissionId}/artifacts`,
      body
    );
    return response.data;
  },

  async submitSubmission(submissionId: string): Promise<PipelineRunResponse> {
    const response = await api.post<PipelineRunResponse>(
      `/api/v1/submissions/${submissionId}/submit`
    );
    return response.data;
  },
};
