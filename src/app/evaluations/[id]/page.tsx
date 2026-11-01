'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ExternalLink,
  CheckCircle,
  Edit3,
  MessageSquare,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { EvaluationSubNav } from '@/components/layout/EvaluationSubNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useEvaluationDetail } from '@/hooks/useEvaluationDetail';
import { evaluationService } from '@/services';

function EvaluationSummaryContent() {
  const params = useParams();
  const evaluationId = (params?.id as string) || 'nhom-08';

  const {
    evaluation,
    rubric,
    loading,
    setEvaluation,
  } = useEvaluationDetail(evaluationId);

  const [isEditScoreOpen, setIsEditScoreOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [customScore, setCustomScore] = useState(8.23);
  const [teacherComment, setTeacherComment] = useState(
    'Bài làm tốt, kiến trúc mạch lạc. Cần bổ sung giải trình về thuật toán SGD vs Adam và kiểm tra lại tài liệu trích dẫn [07].'
  );
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = async () => {
    await evaluationService.updateDecision(evaluationId, {
      score: customScore,
      comments: teacherComment,
      status: 'completed',
    });
    setIsApproved(true);
    if (evaluation) {
      setEvaluation({ ...evaluation, status: 'completed' });
    }
    alert('Đã phê duyệt đề án thành công!');
  };

  const handleSaveScore = async () => {
    await evaluationService.updateDecision(evaluationId, { score: customScore });
    if (evaluation) {
      setEvaluation({ ...evaluation, proposedScore: customScore });
    }
    setIsEditScoreOpen(false);
  };

  if (loading || !evaluation) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar breadcrumbs={[{ label: 'Chi tiết bài đánh giá' }]} />
        <div className="p-8 text-center text-gray-400">Đang tải thông tin đề án...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: evaluation.projectName }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header Title & Subtitle */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {evaluation.projectName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {evaluation.groupName} · {evaluation.authors.join(', ')} ·{' '}
            {evaluation.submissionRound} · {evaluation.submittedAt}
          </p>
        </div>

        {/* Evaluation Sub Nav */}
        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <EvaluationSubNav evaluationId={evaluationId} />
        </Suspense>

        {/* Top 2 Cards: Score Overview & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Điểm học thuật đề xuất */}
          <Card padding="md" className="flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Điểm học thuật đề xuất
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#0F5B46]">
                  {evaluation.proposedScore?.toFixed(2) || '8.23'}
                </span>
                <span className="text-gray-400 text-lg font-normal">/ 10</span>
              </div>
              <div className="mt-3">
                <Badge variant={isApproved ? 'success' : 'warning'} size="md">
                  {isApproved ? 'Đã phê duyệt' : 'Chờ giảng viên duyệt'}
                </Badge>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <div>Rubric v1 · Đánh giá 3 lần</div>
              <div>Độ dao động điểm tổng: thấp</div>
            </div>
          </Card>

          {/* Card 2: Tóm tắt đánh giá */}
          <Card padding="md" className="lg:col-span-2 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Tóm tắt đánh giá
              </span>
              <p className="text-xs text-gray-700 leading-relaxed">
                Đề án giải quyết bài toán gợi ý học phần bằng phương pháp kết hợp. Báo cáo trình bày rõ kiến trúc và có mã nguồn cho các thành phần chính.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-xs">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
                <span className="font-semibold text-emerald-800 block mb-1">
                  Điểm mạnh
                </span>
                <span className="text-emerald-950/80 leading-relaxed">
                  Thiết kế có mô-đun rõ ràng, phần mô tả giải pháp mạch lạc.
                </span>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
                <span className="font-semibold text-amber-800 block mb-1">
                  Cần cải thiện
                </span>
                <span className="text-amber-950/80 leading-relaxed">
                  Bổ sung thực nghiệm tái lập và kiểm tra 2 trích dẫn.
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle 2 Cards: Điểm theo tiêu chí & Cần xem xét */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Điểm theo tiêu chí */}
          <div className="lg:col-span-2">
            <Card padding="md">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  Điểm theo tiêu chí
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-5">
                Bấm vào bằng chứng để đối chiếu trước khi chỉnh điểm
              </p>

              <div className="space-y-4">
                {rubric?.criteria.map((crit) => {
                  const score = crit.score || 8.0;
                  const percentage = (score / crit.maxScore) * 100;
                  return (
                    <div
                      key={crit.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 text-xs"
                    >
                      <div className="w-48 shrink-0">
                        <span className="font-semibold text-gray-900">{crit.name}</span>
                        <span className="text-gray-400 ml-2">({crit.weight}%)</span>
                      </div>

                      {/* Visual progress bar */}
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#0F5B46] h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-900 w-8 text-right">
                          {score.toFixed(1)}
                        </span>
                      </div>

                      {/* Evidence Link */}
                      <Link
                        href={`/evaluations/${evaluationId}/citations`}
                        className="text-[#0F5B46] hover:underline font-medium flex items-center gap-1 shrink-0 ml-4"
                      >
                        Bằng chứng <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Col: Cần xem xét trước khi duyệt */}
          <div>
            <Card padding="md" className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Cần xem xét trước khi duyệt
              </h3>

              <div className="space-y-3.5 text-xs">
                {/* Issue 1: Trích dẫn */}
                <Link
                  href={`/evaluations/${evaluationId}/citations`}
                  className="block p-3 rounded-lg border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="font-semibold text-gray-900 group-hover:text-amber-800">
                      Trích dẫn chưa được hỗ trợ
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 pl-4 mt-1">
                    2 phản bác · 3 chưa đủ bằng chứng
                  </div>
                </Link>

                {/* Issue 2: Code vs report */}
                <Link
                  href={`/evaluations/${evaluationId}/code-audit`}
                  className="block p-3 rounded-lg border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="font-semibold text-gray-900 group-hover:text-amber-800">
                      Tuyên bố triển khai khác mã nguồn
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 pl-4 mt-1">
                    1 không khớp · 2 cần làm rõ
                  </div>
                </Link>

                {/* Issue 3: AI signal */}
                <Link
                  href={`/evaluations/${evaluationId}/ai-signals`}
                  className="block p-3 rounded-lg border border-gray-200 bg-gray-50/60 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="font-semibold text-gray-900 group-hover:text-gray-800">
                      Tín hiệu văn bản AI: Moderate
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 pl-4 mt-1">
                    Xem riêng · không ảnh hưởng điểm
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Card: Quyết định của giảng viên */}
        <Card padding="md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Quyết định của giảng viên
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Rà soát bằng chứng, nhập nhận xét và xác nhận điểm cuối.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsEditScoreOpen(true)}
                icon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Chỉnh điểm
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsCommentOpen(true)}
                icon={<MessageSquare className="w-3.5 h-3.5" />}
              >
                Lưu nhận xét
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleApprove}
                icon={<CheckCircle className="w-3.5 h-3.5" />}
              >
                Phê duyệt
              </Button>
            </div>
          </div>
        </Card>

        {/* Modal: Chỉnh điểm */}
        <Modal
          isOpen={isEditScoreOpen}
          onClose={() => setIsEditScoreOpen(false)}
          title="Chỉnh sửa điểm số tổng kết"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsEditScoreOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSaveScore}>
                Cập nhật điểm
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Điểm học thuật cuối cùng (Thang 10)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="10"
                value={customScore}
                onChange={(e) => setCustomScore(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-[#0F5B46]"
              />
            </div>
            <p className="text-xs text-gray-500">
              Điểm chỉnh sửa sẽ được lưu vào lịch sử đánh giá của sinh viên và xuất ra bảng điểm chính thức.
            </p>
          </div>
        </Modal>

        {/* Modal: Nhận xét */}
        <Modal
          isOpen={isCommentOpen}
          onClose={() => setIsCommentOpen(false)}
          title="Ghi chú nhận xét của giảng viên"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsCommentOpen(false)}>
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsCommentOpen(false);
                  alert('Đã lưu nhận xét!');
                }}
              >
                Lưu nhận xét
              </Button>
            </>
          }
        >
          <div>
            <textarea
              rows={4}
              value={teacherComment}
              onChange={(e) => setTeacherComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default function EvaluationSummaryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400 text-xs">Đang tải...</div>}>
      <EvaluationSummaryContent />
    </Suspense>
  );
}
