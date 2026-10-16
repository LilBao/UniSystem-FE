import api from './api';
import { EvaluationItem } from '@/types';
import { mockEvaluations } from './mockData';

export const evaluationService = {
  // Get all evaluations with optional filters
  async getEvaluations(params?: { status?: string; search?: string }): Promise<EvaluationItem[]> {
    try {
      const response = await api.get<EvaluationItem[]>('/evaluations', { params });
      return response.data;
    } catch {
      // Return mock data for UI demo / when backend is not connected
      let items = [...mockEvaluations];
      if (params?.search) {
        const query = params.search.toLowerCase();
        items = items.filter(
          (e) =>
            e.projectName.toLowerCase().includes(query) ||
            e.groupName.toLowerCase().includes(query) ||
            e.authors.some((a) => a.toLowerCase().includes(query))
        );
      }
      if (params?.status && params.status !== 'all') {
        items = items.filter((e) => e.status === params.status);
      }
      return items;
    }
  },

  // Get specific evaluation by ID
  async getEvaluationById(id: string): Promise<EvaluationItem | null> {
    try {
      const response = await api.get<EvaluationItem>(`/evaluations/${id}`);
      return response.data;
    } catch {
      const found = mockEvaluations.find((e) => e.id === id);
      return found || mockEvaluations[0];
    }
  },

  // Create new evaluation session
  async createEvaluation(data: Partial<EvaluationItem>): Promise<EvaluationItem> {
    try {
      const response = await api.post<EvaluationItem>('/evaluations', data);
      return response.data;
    } catch {
      const newItem: EvaluationItem = {
        id: `nhom-${Date.now()}`,
        projectName: data.projectName || 'Đề án mới',
        groupName: data.groupName || 'Nhóm mới',
        submittedAt: new Date().toLocaleDateString('vi-VN'),
        submissionRound: 'Lần nộp 01',
        authors: data.authors || ['Sinh viên thực hiện'],
        status: 'needs_review',
        proposedScore: undefined,
        itemsToReview: 'Mới nộp',
        classCode: data.classCode || 'Đồ án chuyên ngành · HK261',
        reportFileName: data.reportFileName || 'bao-cao.pdf',
        sourceFileName: data.sourceFileName || 'source.zip',
      };
      return newItem;
    }
  },

  // Update teacher final decision or comments
  async updateDecision(id: string, payload: { score?: number; comments?: string; status?: string }): Promise<boolean> {
    try {
      await api.patch(`/evaluations/${id}/decision`, payload);
      return true;
    } catch {
      return true;
    }
  },
};
