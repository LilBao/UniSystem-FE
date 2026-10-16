'use client';

import { useState, useEffect, useCallback } from 'react';
import { EvaluationItem } from '@/types';
import { evaluationService } from '@/services';

export function useEvaluations(initialStatus = 'all', initialSearch = '') {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState(initialSearch);

  const fetchEvaluations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await evaluationService.getEvaluations({ status, search });
      setEvaluations(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách bài đánh giá');
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  return {
    evaluations,
    loading,
    error,
    status,
    setStatus,
    search,
    setSearch,
    refetch: fetchEvaluations,
  };
}
