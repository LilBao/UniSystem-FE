'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  GitCommit,
  Network,
  Play,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { EvaluationSubNav } from '@/components/layout/EvaluationSubNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useEvaluationDetail } from '@/hooks/useEvaluationDetail';
import { codeAuditService, pipelineService } from '@/services';
import {
  VisualGraphResponse,
  GraphFilterMode,
  PipelineRunResponse,
} from '@/types';

function CodeAuditContent() {
  const params = useParams();
  const evaluationId = (params?.id as string) || '';

  const { codeAuditClaims } = useEvaluationDetail(evaluationId);
  const [selectedClaimIndex, setSelectedClaimIndex] = useState(0);
  const [activePipelineStage, setActivePipelineStage] = useState(1);
  const [isClarifyModalOpen, setIsClarifyModalOpen] = useState(false);
  const [clarifyMessage, setClarifyMessage] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);

  // Pipeline 3 & Visual Graph State (GET /api/v1/submissions/{id}/pipelines/p3/graph)
  const [graphFilter, setGraphFilter] = useState<GraphFilterMode>('all');
  const [minImportance, setMinImportance] = useState<number>(0);
  const [visualGraph, setVisualGraph] = useState<VisualGraphResponse | null>(null);
  const [p3Run, setP3Run] = useState<PipelineRunResponse | null>(null);
  const [runningP3, setRunningP3] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const claim = codeAuditClaims[selectedClaimIndex] || codeAuditClaims[0];

  const loadGraph = useCallback(async () => {
    if (!evaluationId) return;
    try {
      setApiError(null);
      const data = await pipelineService.getPipeline3Graph(evaluationId, {
        filter: graphFilter,
        min_importance: minImportance,
      });
      setVisualGraph(data);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error
          ? err.message
          : 'Không thể tải Visual Graph từ Backend'
      );
    }
  }, [evaluationId, graphFilter, minImportance]);

  useEffect(() => {
    if (!evaluationId) return;
    let active = true;
    pipelineService
      .getPipeline3Graph(evaluationId, {
        filter: graphFilter,
        min_importance: minImportance,
      })
      .then((data) => {
        if (active) {
          setVisualGraph(data);
          setApiError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setApiError(
            err instanceof Error
              ? err.message
              : 'Không thể tải Visual Graph từ Backend'
          );
        }
      });
    return () => {
      active = false;
    };
  }, [evaluationId, graphFilter, minImportance]);

  const handleRunPipeline3 = async () => {
    setApiError(null);
    setRunningP3(true);
    try {
      const run = await pipelineService.runPipeline3(evaluationId);
      setP3Run(run);
      await loadGraph();
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : 'Lỗi khi gọi POST /pipelines/p3'
      );
    } finally {
      setRunningP3(false);
    }
  };

  const handleClarifySubmit = async () => {
    if (!claim) return;
    setApiError(null);
    try {
      await codeAuditService.requestClarification(claim.id, clarifyMessage);
      setIsClarifyModalOpen(false);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : 'Lỗi khi gửi yêu cầu làm rõ'
      );
    }
  };

  const handleMarkReviewed = async () => {
    if (!claim) return;
    setApiError(null);
    try {
      await codeAuditService.markVerified(claim.id);
      setIsReviewed(true);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : 'Lỗi khi xác nhận đã xem xét'
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Đối soát code – báo cáo' }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Đối soát code – báo cáo
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Kiểm tra sự tương thích giữa nội dung mô tả trong báo cáo và mã nguồn thực tế.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunPipeline3}
            disabled={runningP3}
            icon={<Play className="w-3.5 h-3.5" />}
          >
            {runningP3 ? 'Đang phân tích...' : 'Phân tích mã nguồn'}
          </Button>
        </div>

        {/* Sub Navigation */}
        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <EvaluationSubNav evaluationId={evaluationId} />
        </Suspense>

        {apiError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {p3Run && (
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                Hoàn tất
              </Badge>
              <span className="text-gray-700">
                Đã cập nhật kết quả đối soát và sơ đồ liên kết mã nguồn.
              </span>
            </div>
          </div>
        )}

        {/* 3 Status Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#15803D]">
              {visualGraph
                ? visualGraph.metrics.total_nodes - visualGraph.metrics.mismatched_nodes_count
                : codeAuditClaims.filter((c) => c.status === 'match').length}
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Khớp mã nguồn
              </div>
              <div className="text-[11px] text-gray-500">Đúng với mô tả trong báo cáo</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#B45309]">
              {visualGraph
                ? visualGraph.metrics.important_nodes_count
                : codeAuditClaims.filter((c) => c.status === 'clarify').length}
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Mục quan trọng / Cần làm rõ
              </div>
              <div className="text-[11px] text-gray-500">Cần giảng viên xem xét thêm</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#B91C1C]">
              {visualGraph
                ? visualGraph.metrics.mismatched_nodes_count
                : codeAuditClaims.filter((c) => c.status === 'mismatch').length}
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Chưa khớp
              </div>
              <div className="text-[11px] text-gray-500">Khác với nội dung báo cáo</div>
            </div>
          </div>
        </div>

        {/* Các bước kiểm tra */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Quy trình đối chiếu
            </h3>
            {codeAuditClaims.length > 1 && (
              <div className="flex items-center gap-1.5">
                {codeAuditClaims.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClaimIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${selectedClaimIndex === idx
                      ? 'bg-[#0F5B46] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {c.claimCode.split('·')[0].trim()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setActivePipelineStage(1)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${activePipelineStage === 1
                ? 'border-[#0F5B46] bg-[#F0FDF4]'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className="text-xs font-bold text-gray-900 mb-1">
                01 Đọc cấu trúc mã nguồn
              </div>
              <div className="text-[11px] text-[#0F5B46] font-medium">
                Quét thư mục, hàm và lớp trong dự án
              </div>
            </div>

            <div
              onClick={() => setActivePipelineStage(2)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${activePipelineStage === 2
                ? 'border-[#0F5B46] bg-[#F0FDF4]'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className="text-xs font-bold text-gray-900 mb-1">
                02 Đối chiếu nội dung
              </div>
              <div className="text-[11px] text-gray-500">
                So sánh mô tả báo cáo với cách cài đặt
              </div>
            </div>

            <div
              onClick={() => setActivePipelineStage(3)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${activePipelineStage === 3
                ? 'border-[#0F5B46] bg-[#F0FDF4]'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className="text-xs font-bold text-gray-900 mb-1">
                03 Kiểm tra chạy thử
              </div>
              <div className="text-[11px] text-gray-500">
                Xác minh các thành phần quan trọng
              </div>
            </div>
          </div>
        </Card>

        {/* Split Comparison Cards: Báo cáo vs Mã nguồn */}
        {claim && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <Card padding="md" className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Mô tả trong báo cáo
                  </h3>
                  <Badge
                    variant={
                      claim.status === 'mismatch'
                        ? 'danger'
                        : claim.status === 'clarify'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {claim.status === 'mismatch'
                      ? 'Chưa khớp'
                      : claim.status === 'clarify'
                        ? 'Cần làm rõ'
                        : 'Khớp'}
                  </Badge>
                </div>

                <div className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase">
                  {claim.claimCode}
                </div>

                <div className="text-xs text-gray-900 leading-relaxed font-serif italic bg-gray-50 p-3.5 rounded-lg border border-gray-200/80">
                  {claim.reportStatement}
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-1">
                  <span className="font-semibold text-amber-900 block">
                    Nhận xét đối chiếu
                  </span>
                  <p className="text-amber-800 leading-relaxed">
                    {claim.findingDescription}
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="md" className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Đoạn mã tương ứng
                  </h3>
                  <Badge variant="info">Mã nguồn</Badge>
                </div>

                <div className="text-[11px] text-[#0F5B46] font-medium flex items-center gap-1.5 font-mono">
                  <GitCommit className="w-3.5 h-3.5" />
                  <span>{claim.sourceCodeFile}</span>
                </div>

                <div className="bg-[#0F172A] rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner leading-relaxed border border-slate-800">
                  <pre>{claim.sourceCodeSnippet}</pre>
                </div>

                <div className="text-[11px] text-gray-500 font-mono">
                  {claim.tracePath}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Sơ đồ liên kết báo cáo & mã nguồn */}
        <Card padding="md" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EBF8F2] text-[#0F5B46] flex items-center justify-center">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Sơ đồ liên kết báo cáo & mã nguồn
                </h3>
                {visualGraph ? (
                  <p className="text-xs text-gray-500">
                    Mức độ khớp tổng thể:{' '}
                    <b className="text-[#0F5B46]">
                      {(visualGraph.metrics.consistency_score * 100).toFixed(0)}%
                    </b>{' '}
                    · {visualGraph.metrics.total_nodes} thành phần ·{' '}
                    {visualGraph.metrics.total_edges} liên kết
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Hiển thị mối liên hệ giữa các nội dung trình bày trong báo cáo và tệp mã nguồn.
                  </p>
                )}
              </div>
            </div>

            {/* Bộ lọc */}
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'all', label: 'Tất cả' },
                  { id: 'mismatches_only', label: 'Chỉ mục chưa khớp' },
                  { id: 'important_only', label: 'Mục quan trọng' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setGraphFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${graphFilter === tab.id
                    ? 'bg-[#0F5B46] text-white font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}

              <select
                value={minImportance}
                onChange={(e) => setMinImportance(Number(e.target.value))}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700"
              >
                <option value={0}>Mọi mức độ</option>
                <option value={0.6}>Mức quan trọng vừa</option>
                <option value={0.85}>Mức quan trọng cao</option>
              </select>
            </div>
          </div>

          {visualGraph ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {visualGraph.nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${node.data.has_mismatch
                      ? 'border-red-200 bg-red-50/30'
                      : 'border-gray-200 bg-gray-50/40'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-gray-200 font-semibold text-gray-600">
                        {node.data.kind}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Độ ưu tiên: {(node.data.importance_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900">{node.data.label}</div>
                    {node.data.snippet && (
                      <div className="text-[11px] font-mono text-gray-600 bg-white p-2 rounded border border-gray-200/70 truncate">
                        {node.data.snippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {visualGraph.mismatch_witnesses.length > 0 && (
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      Các điểm khác biệt phát hiện được ({visualGraph.mismatch_witnesses.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {visualGraph.mismatch_witnesses.map((mw) => (
                      <div
                        key={mw.claim_id}
                        className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-amber-900">
                            {mw.code_location.path}:{mw.code_location.start_line}
                          </span>
                          <Badge
                            variant={mw.severity === 'CRITICAL' ? 'danger' : 'warning'}
                            size="sm"
                          >
                            {mw.severity === 'CRITICAL' ? 'Quan trọng' : 'Cần lưu ý'}
                          </Badge>
                        </div>
                        <div className="text-gray-800">
                          <b>Trong báo cáo:</b> {mw.expected_behavior}
                        </div>
                        <div className="text-gray-800">
                          <b>Trong mã nguồn:</b> {mw.actual_behavior}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">
              Chưa có dữ liệu sơ đồ liên kết cho bài nộp này.
            </div>
          )}
        </Card>

        {/* Bottom Verification Banner */}
        <Card padding="md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Trạng thái kiểm tra chạy thử: {claim?.executionStatus || 'Chưa chạy'}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Nếu chưa có môi trường chạy thử, giữ trạng thái &quot;chưa xác minh&quot; để giảng viên xem xét.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsClarifyModalOpen(true)}
              >
                Yêu cầu làm rõ
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleMarkReviewed}
                icon={<CheckCircle className="w-3.5 h-3.5" />}
              >
                {isReviewed ? 'Đã xem xét' : 'Đánh dấu đã xem'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Clarify Modal */}
        <Modal
          isOpen={isClarifyModalOpen}
          onClose={() => setIsClarifyModalOpen(false)}
          title="Yêu cầu nhóm sinh viên làm rõ mã nguồn"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsClarifyModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleClarifySubmit}>
                Gửi yêu cầu
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <label className="block text-xs font-medium text-gray-700">
              Nội dung cần sinh viên giải thích thêm
            </label>
            <textarea
              rows={4}
              value={clarifyMessage}
              onChange={(e) => setClarifyMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default function CodeAuditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400 text-xs">Đang tải...</div>}>
      <CodeAuditContent />
    </Suspense>
  );
}
