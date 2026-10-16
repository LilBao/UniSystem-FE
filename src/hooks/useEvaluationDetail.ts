'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  EvaluationItem,
  CitationClaim,
  CodeAuditClaim,
  AiSignalAnalysis,
  RubricConfig,
} from '@/types';
import {
  evaluationService,
  citationService,
  codeAuditService,
  aiSignalService,
  rubricService,
} from '@/services';

export function useEvaluationDetail(id: string) {
  const [evaluation, setEvaluation] = useState<EvaluationItem | null>(null);
  const [rubric, setRubric] = useState<RubricConfig | null>(null);
  const [citations, setCitations] = useState<CitationClaim[]>([]);
  const [codeAuditClaims, setCodeAuditClaims] = useState<CodeAuditClaim[]>([]);
  const [aiSignal, setAiSignal] = useState<AiSignalAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [evalData, rubricData, citationData, codeData, aiData] = await Promise.all([
        evaluationService.getEvaluationById(id),
        rubricService.getRubricConfig(),
        citationService.getCitations(id),
        codeAuditService.getCodeAuditClaims(id),
        aiSignalService.getAiSignal(id),
      ]);

      setEvaluation(evalData);
      setRubric(rubricData);
      setCitations(citationData);
      setCodeAuditClaims(codeData);
      setAiSignal(aiData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải chi tiết bài nộp');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    evaluation,
    setEvaluation,
    rubric,
    citations,
    setCitations,
    codeAuditClaims,
    setCodeAuditClaims,
    aiSignal,
    loading,
    error,
    refetch: loadAllData,
  };
}
