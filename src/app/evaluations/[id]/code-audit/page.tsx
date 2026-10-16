'use client';

import React, { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  GitCommit,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { EvaluationSubNav } from '@/components/layout/EvaluationSubNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useEvaluationDetail } from '@/hooks/useEvaluationDetail';
import { codeAuditService } from '@/services';

function CodeAuditContent() {
  const params = useParams();
  const evaluationId = (params?.id as string) || 'nhom-08';

  const { codeAuditClaims } = useEvaluationDetail(evaluationId);
  const [activePipelineStage, setActivePipelineStage] = useState(1);
  const [isClarifyModalOpen, setIsClarifyModalOpen] = useState(false);
  const [clarifyMessage, setClarifyMessage] = useState(
    'Vui lòng giải thích tại sao trong báo cáo trang 18 ghi dùng Adam lr=0.001 nhưng file train.py lại khởi tạo SGD lr=0.01.'
  );
  const [isReviewed, setIsReviewed] = useState(false);

  const claim = codeAuditClaims[0];

  const handleClarifySubmit = async () => {
    if (!claim) return;
    await codeAuditService.requestClarification(claim.id, clarifyMessage);
    setIsClarifyModalOpen(false);
    alert('Đã gửi yêu cầu làm rõ cho sinh viên!');
  };

  const handleMarkReviewed = async () => {
    if (!claim) return;
    await codeAuditService.markVerified(claim.id);
    setIsReviewed(true);
    alert('Đã ghi nhận giảng viên đã xem xét phát hiện khác biệt!');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Đối soát code – báo cáo' }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Đối soát code – báo cáo
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Nhóm 08 / Hệ thống gợi ý học phần · Mã nguồn a31f8c2 · 12 tuyên bố triển khai.
          </p>
        </div>

        {/* Sub Navigation */}
        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <EvaluationSubNav evaluationId={evaluationId} />
        </Suspense>

        {/* 3 Status Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#15803D]">09</span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Khớp bằng chứng
              </div>
              <div className="text-[11px] text-gray-500">MATCH</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#B45309]">02</span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Cần làm rõ
              </div>
              <div className="text-[11px] text-gray-500">CLARIFY</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#B91C1C]">01</span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Không khớp
              </div>
              <div className="text-[11px] text-gray-500">MISMATCH</div>
            </div>
          </div>
        </div>

        {/* Luồng kiểm chứng Pipeline */}
        <Card padding="md">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Luồng kiểm chứng
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setActivePipelineStage(1)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                activePipelineStage === 1
                  ? 'border-[#0F5B46] bg-[#F0FDF4]'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-xs font-bold text-gray-900 mb-1">
                01 Cấu trúc mã nguồn
              </div>
              <div className="text-[11px] text-[#0F5B46] font-medium font-mono">
                EXTRACTED · truy vết trực tiếp
              </div>
            </div>

            <div
              onClick={() => setActivePipelineStage(2)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                activePipelineStage === 2
                  ? 'border-[#0F5B46] bg-[#F0FDF4]'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-xs font-bold text-gray-900 mb-1">
                02 Đối chiếu ngữ nghĩa
              </div>
              <div className="text-[11px] text-gray-500 font-mono">
                INFERRED / AMBIGUOUS
              </div>
            </div>

            <div
              onClick={() => setActivePipelineStage(3)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                activePipelineStage === 3
                  ? 'border-[#0F5B46] bg-[#F0FDF4]'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-xs font-bold text-gray-900 mb-1">
                03 Kiểm chứng thực thi
              </div>
              <div className="text-[11px] text-gray-500">
                Claim quan trọng · môi trường cô lập
              </div>
            </div>
          </div>
        </Card>

        {/* Split Comparison Cards: Báo cáo vs Mã nguồn */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left: Tuyên bố trong báo cáo */}
          <Card padding="md" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Tuyên bố trong báo cáo
                </h3>
                <Badge variant="danger">Không khớp</Badge>
              </div>

              <div className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase">
                {claim?.claimCode || 'CLAIM #09 · TRANG 18, MỤC 4.1'}
              </div>

              <div className="text-xs text-gray-900 leading-relaxed font-serif italic bg-gray-50 p-3.5 rounded-lg border border-gray-200/80">
                {claim?.reportStatement ||
                  '“Hệ thống sử dụng Adam với learning rate = 0.001 trong quá trình huấn luyện.”'}
              </div>

              {/* Highlight box */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-1">
                <span className="font-semibold text-amber-900 block">
                  Phát hiện khác biệt
                </span>
                <p className="text-amber-800 leading-relaxed">
                  {claim?.findingDescription ||
                    'Báo cáo mô tả Adam, trong khi cấu hình chạy hiện tại khởi tạo SGD. Cần xác nhận đúng phiên bản thí nghiệm.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Right: Bằng chứng mã nguồn */}
          <Card padding="md" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Bằng chứng mã nguồn
                </h3>
                <Badge variant="extracted">EXTRACTED</Badge>
              </div>

              <div className="text-[11px] text-[#0F5B46] font-medium flex items-center gap-1.5 font-mono">
                <GitCommit className="w-3.5 h-3.5" />
                <span>
                  {claim?.sourceCodeFile ||
                    'src/train.py · dòng 42-47 · commit a31f8c2'}
                </span>
              </div>

              {/* Dark Code Terminal */}
              <div className="bg-[#0F172A] rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner leading-relaxed border border-slate-800">
                <pre>{claim?.sourceCodeSnippet}</pre>
              </div>

              <div className="text-[11px] text-gray-500 font-mono">
                {claim?.tracePath || 'Truy vết: cấu hình → optimizer → lời gọi train()'}
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Verification Banner */}
        <Card padding="md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Kiểm chứng thực thi: Chưa chạy
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Nếu thiếu môi trường chạy, giữ trạng thái &quot;chưa xác minh&quot; để giảng viên xem xét.
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
                {isReviewed ? 'Đã xem xét' : 'Đã xem xét'}
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
              Nội dung yêu cầu giải trình
            </label>
            <textarea
              rows={4}
              value={clarifyMessage}
              onChange={(e) => setClarifyMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
            />
          </div>
        </Modal>

        {/* Mockup footer indicator */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-4 uppercase tracking-widest font-mono">
          <span>GRADEFOLIO / PROPOSAL V2</span>
          <span>MOCKUP 06 / 07</span>
        </div>
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
