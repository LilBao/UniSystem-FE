'use client';

import React, { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import {
  Check,
  FileText,
  BookOpen,
  MessageSquare,
  RefreshCw,
  Play,
  AlertCircle,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { EvaluationSubNav } from '@/components/layout/EvaluationSubNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useEvaluationDetail } from '@/hooks/useEvaluationDetail';
import {
  citationService,
  referenceService,
  pipelineService,
} from '@/services';
import { ReferenceResolutionSummary, PipelineRunResponse } from '@/types';

function CitationsContent() {
  const params = useParams();
  const evaluationId = (params?.id as string) || '';

  const { citations, setCitations } = useEvaluationDetail(evaluationId);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'needs_review' | 'all'>('needs_review');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [teacherNote, setTeacherNote] = useState('');

  // Backend Reference Resolution & Pipeline 2 state
  const [refResolution, setRefResolution] =
    useState<ReferenceResolutionSummary | null>(null);
  const [p2Run, setP2Run] = useState<PipelineRunResponse | null>(null);
  const [runningAction, setRunningAction] = useState<'resolve' | 'p2' | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const selectedClaim =
    citations.find((c) => c.id === selectedClaimId) || citations[0];

  const filteredClaims =
    filterMode === 'needs_review'
      ? citations.filter((c) => c.status === 'REFUTE' || c.status === 'NEI')
      : citations;

  const handleMarkViewed = async () => {
    if (!selectedClaim) return;
    setApiError(null);
    try {
      await citationService.markViewed(selectedClaim.id);
      setCitations(
        citations.map((c) =>
          c.id === selectedClaim.id ? { ...c, viewed: true } : c
        )
      );
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedClaim) return;
    setApiError(null);
    try {
      await citationService.addNote(selectedClaim.id, teacherNote);
      setIsCommentModalOpen(false);
      setTeacherNote('');
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Lỗi khi lưu ghi chú');
    }
  };

  const handleResolveReferences = async () => {
    setApiError(null);
    setRunningAction('resolve');
    try {
      const summary = await referenceService.resolveReferences(evaluationId);
      setRefResolution(summary);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : 'Lỗi khi gọi POST /references/resolve'
      );
    } finally {
      setRunningAction(null);
    }
  };

  const handleRunPipeline2 = async () => {
    setApiError(null);
    setRunningAction('p2');
    try {
      const run = await pipelineService.runPipeline2(evaluationId);
      setP2Run(run);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : 'Lỗi khi gọi POST /pipelines/p2'
      );
    } finally {
      setRunningAction(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUPPORT':
        return <Badge variant="success">Khớp nguồn</Badge>;
      case 'REFUTE':
        return <Badge variant="danger">Mâu thuẫn</Badge>;
      case 'NEI':
        return <Badge variant="warning">Chưa đủ thông tin</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Kiểm định trích dẫn' }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Kiểm định trích dẫn
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Kiểm tra và đối chiếu các trích dẫn trong báo cáo với tài liệu tham khảo.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResolveReferences}
              disabled={runningAction !== null}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              {runningAction === 'resolve'
                ? 'Đang kiểm tra...'
                : 'Kiểm tra nguồn tham khảo'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRunPipeline2}
              disabled={runningAction !== null}
              icon={<Play className="w-3.5 h-3.5" />}
            >
              {runningAction === 'p2' ? 'Đang phân tích...' : 'Phân tích trích dẫn'}
            </Button>
          </div>
        </div>

        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <EvaluationSubNav evaluationId={evaluationId} />
        </Suspense>

        {apiError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Kết quả kiểm tra nguồn tham khảo nếu đã kích hoạt */}
        {(refResolution || p2Run) && (
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            {refResolution && (
              <div className="flex items-center gap-2 text-gray-800">
                <span>
                  Tổng số mục tham khảo: <b>{refResolution.total}</b> · Đã xác minh:{' '}
                  <b className="text-emerald-700">{refResolution.resolved}</b> · Cần kiểm tra lại:{' '}
                  <b className="text-amber-700">{refResolution.ambiguous}</b> · Chưa tìm thấy:{' '}
                  <b className="text-red-700">{refResolution.not_found}</b>
                </span>
              </div>
            )}
            {p2Run && (
              <div className="flex items-center gap-2 text-gray-800">
                <Badge variant="success" size="sm">
                  Đã gửi yêu cầu phân tích
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* 3 Citation Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#15803D]">
              {citations.filter((c) => c.status === 'SUPPORT').length}
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Khớp nguồn tài liệu
              </div>
              <div className="text-[11px] text-gray-500">Nội dung phù hợp với tài liệu gốc</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#B91C1C]">
              {citations.filter((c) => c.status === 'REFUTE').length}
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Mâu thuẫn với nguồn
              </div>
              <div className="text-[11px] text-gray-500">Khác với nội dung tài liệu gốc</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#B45309]">
              {citations.filter((c) => c.status === 'NEI').length}
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Chưa đủ thông tin
              </div>
              <div className="text-[11px] text-gray-500">Cần kiểm tra thủ công thêm</div>
            </div>
          </div>
        </div>

        {/* 2 Column Details: Left Claims list, Right Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Col: Danh sách trích dẫn */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Danh sách trích dẫn
              </h3>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterMode('needs_review')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filterMode === 'needs_review'
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Cần xem xét
              </button>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filterMode === 'all'
                  ? 'bg-gray-200 text-gray-900 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Tất cả: {citations.length}
              </button>
            </div>

            {/* Claims list */}
            <div className="space-y-3 pt-2">
              {filteredClaims.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  Chưa có dữ liệu trích dẫn. Hãy bấm &quot;Phân tích trích dẫn&quot; để bắt đầu.
                </div>
              ) : (
                filteredClaims.map((claim) => {
                  const isSelected = claim.id === (selectedClaim?.id || '');
                  return (
                    <div
                      key={claim.id}
                      onClick={() => setSelectedClaimId(claim.id)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${isSelected
                        ? 'border-[#0F5B46] bg-[#F0FDF4] shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-gray-900">
                          {claim.claimCode} {claim.title}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2 leading-relaxed">
                        {claim.claimText}
                      </p>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(claim.status)}
                        {claim.viewed && (
                          <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã xem
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Right Col: Đối chiếu bằng chứng */}
          <div className="lg:col-span-2">
            {selectedClaim ? (
              <Card padding="md" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Đối chiếu bằng chứng
                  </h3>
                  {getStatusBadge(selectedClaim.status)}
                </div>

                {/* Section 1: NỘI DUNG TRONG BÁO CÁO */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Nội dung trích dẫn trong báo cáo
                  </span>
                  <div className="bg-red-50/40 border border-red-200/80 rounded-xl p-4 text-xs text-gray-800 leading-relaxed italic font-serif">
                    {selectedClaim.claimText}
                  </div>
                  <div className="text-[11px] text-[#0F5B46] font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{selectedClaim.reportLocation}</span>
                  </div>
                </div>

                {/* Section 2: BẰNG CHỨNG TÀI LIỆU GỐC */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Bằng chứng từ tài liệu gốc
                  </span>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {selectedClaim.sourceQuote}
                  </p>
                  <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{selectedClaim.sourceLocation}</span>
                  </div>
                </div>

                {/* Section 3: Kết luận đối chiếu */}
                <div className="bg-gray-50 border border-gray-200/90 rounded-xl p-4 text-xs space-y-1.5">
                  <div className="font-semibold text-gray-900">
                    {selectedClaim.verdict}
                  </div>
                  <div className="text-gray-500">
                    Độ tin cậy: {selectedClaim.confidence}
                  </div>
                </div>

                <div className="text-[11px] text-gray-400">
                  {selectedClaim.note}
                </div>

                {/* Bottom Action buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={handleMarkViewed}
                    icon={<Check className="w-4 h-4" />}
                  >
                    Đánh dấu đã xem
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCommentModalOpen(true)}
                    icon={<MessageSquare className="w-4 h-4" />}
                  >
                    Thêm nhận xét
                  </Button>
                </div>
              </Card>
            ) : (
              <Card padding="md" className="text-center py-12 text-xs text-gray-400">
                Chọn một mục trích dẫn ở danh sách bên trái để xem chi tiết đối chiếu.
              </Card>
            )}
          </div>
        </div>

        {/* Modal: Nhận xét */}
        <Modal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          title={`Thêm nhận xét cho ${selectedClaim?.claimCode || 'mục trích dẫn'}`}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsCommentModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSaveNote}>
                Lưu ghi chú
              </Button>
            </>
          }
        >
          <textarea
            rows={4}
            value={teacherNote}
            onChange={(e) => setTeacherNote(e.target.value)}
            placeholder="Nhập ghi chú yêu cầu sinh viên đính chính hoặc bổ sung nguồn..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
          />
        </Modal>
      </div>
    </div>
  );
}

export default function CitationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400 text-xs">Đang tải...</div>}>
      <CitationsContent />
    </Suspense>
  );
}
