import api from './api';
import { CloudinaryUploadResponse, UploadArtifactKind } from '@/types';

export const uploadService = {
  async uploadSubmissionFile(
    submissionId: string,
    kind: UploadArtifactKind,
    file: File
  ): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('kind', kind);
    formData.append('file', file);

    const response = await api.post<CloudinaryUploadResponse>(
      `/api/v1/submissions/${submissionId}/files`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
