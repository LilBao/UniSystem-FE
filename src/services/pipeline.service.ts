import api from './api';
import {
  PipelineRunResponse,
  VisualGraphResponse,
  GraphFilterMode,
} from '@/types';

export const pipelineService = {
  async runPipeline2(submissionId: string): Promise<PipelineRunResponse> {
    const response = await api.post<PipelineRunResponse>(
      `/api/v1/submissions/${submissionId}/pipelines/p2`
    );
    return response.data;
  },

  async runPipeline3(submissionId: string): Promise<PipelineRunResponse> {
    const response = await api.post<PipelineRunResponse>(
      `/api/v1/submissions/${submissionId}/pipelines/p3`
    );
    return response.data;
  },

  async getPipeline3Graph(
    submissionId: string,
    params?: { filter?: GraphFilterMode; min_importance?: number }
  ): Promise<VisualGraphResponse> {
    const filter = params?.filter ?? 'all';
    const minImportance = params?.min_importance ?? 0;
    const response = await api.get<VisualGraphResponse>(
      `/api/v1/submissions/${submissionId}/pipelines/p3/graph`,
      {
        params: {
          filter,
          min_importance: minImportance,
        },
      }
    );
    return response.data;
  },
};
