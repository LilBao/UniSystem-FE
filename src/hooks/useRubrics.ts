'use client';

import { useState, useEffect, useCallback } from 'react';
import { RubricConfig } from '@/types';
import { rubricService } from '@/services';

export function useRubrics() {
  const [rubricConfig, setRubricConfig] = useState<RubricConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRubric = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await rubricService.getRubricConfig();
      setRubricConfig(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải cấu hình rubric');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRubric = async (updated: RubricConfig) => {
    try {
      setSaving(true);
      const result = await rubricService.saveRubricConfig(updated);
      setRubricConfig(result);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu rubric');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchRubric();
  }, [fetchRubric]);

  return {
    rubricConfig,
    setRubricConfig,
    loading,
    saving,
    error,
    saveRubric,
    refetch: fetchRubric,
  };
}
