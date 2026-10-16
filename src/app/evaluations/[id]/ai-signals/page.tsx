'use client';

import React, { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import {
  Info,
  MessageSquare,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { EvaluationSubNav } from '@/components/layout/EvaluationSubNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useEvaluationDetail } from '@/hooks/useEvaluationDetail';
import { aiSignalService } from '@/services';

function AiSignalsContent() {
  const params = useParams();
  const evaluationId = (params?.id as string) || 'nhom-08';

  const { aiSignal } = useEvaluationDetail(evaluationId);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [teacherNote, setTeacherNote] = useState('');

  const handleSaveNote = async () => {
    await aiSignalService.addTeacherNote(evaluationId, teacherNote);
    setIsNoteModalOpen(false);
    alert('Đã lưu ghi chú liêm chính học thuật!');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Tín hiệu văn bản AI' }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Tín hiệu văn bản AI
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Nhóm 08 / Báo cáo liêm chính · Thông tin hỗ trợ giảng viên xem xét.
          </p>
        </div>

        {/* Sub Navigation */}
        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <EvaluationSubNav evaluationId={evaluationId} />
        </Suspense>

        {/* Disclaimer Warning Banner */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-amber-950 block">
              Đây là tín hiệu tham khảo, không phải kết luận vi phạm.
            </span>
            <span className="text-amber-900/80 mt-0.5 block leading-relaxed">
              Không xuất &quot;% AI Generated&quot;, không tự động trừ điểm và không tham gia tính điểm học thuật.
            </span>
          </div>
        </div>

        {/* Top 2 Cards: Mức tín hiệu & Ngữ cảnh phân tích */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Mức tín hiệu */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Mức tín hiệu
              </h3>
              <Badge variant="warning">
                {aiSignal?.levelLabel || 'Moderate · Trung bình'}
              </Badge>
            </div>

            {/* Segmented meter bar */}
            <div className="pt-2">
              <div className="grid grid-cols-3 gap-2 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-300 rounded-l-full" />
                <div className="bg-amber-400 ring-2 ring-amber-500 ring-offset-1" />
                <div className="bg-rose-300 rounded-r-full" />
              </div>
              <div className="flex justify-between text-[11px] font-medium text-gray-400 mt-2">
                <span>Low</span>
                <span className="text-amber-800 font-bold">Moderate</span>
                <span>High</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-xs space-y-1">
              <div className="font-semibold text-gray-800">
                Độ tin cậy: {aiSignal?.confidence || 'Trung bình'}
              </div>
              <p className="text-gray-500 leading-relaxed">
                {aiSignal?.recommendation ||
                  'Cần đối chiếu với ngữ cảnh và trao đổi trực tiếp với sinh viên.'}
              </p>
            </div>
          </Card>

          {/* Card 2: Ngữ cảnh phân tích */}
          <Card padding="md" className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Ngữ cảnh phân tích
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Ngôn ngữ
                </span>
                <span className="font-semibold text-gray-900 mt-1 block">
                  {aiSignal?.language || 'Tiếng Việt'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Miền dữ liệu
                </span>
                <span className="font-semibold text-gray-900 mt-1 block">
                  {aiSignal?.domain || 'Báo cáo kỹ thuật CSE'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Độ dài được phân tích
                </span>
                <span className="font-semibold text-gray-900 mt-1 block">
                  {aiSignal?.analyzedWordCount?.toLocaleString() || '6.420'} từ
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Hiệu chỉnh ngưỡng
                </span>
                <span className="font-semibold text-gray-900 mt-1 block">
                  {aiSignal?.thresholdTuning || 'Theo miền · FPR mục tiêu 5%'}
                </span>
              </div>
            </div>

            <p className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 leading-relaxed">
              {aiSignal?.note ||
                'Chỉ xét phần văn bản phù hợp; loại trừ công thức, caption và đoạn OCR lỗi.'}
            </p>
          </Card>
        </div>

        {/* Bottom 2 Cards: Các đoạn cần xem xét & Cơ sở cảnh báo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Cols: Các đoạn cần xem xét */}
          <div className="lg:col-span-2">
            <Card padding="md" className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Các đoạn cần xem xét
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Bản đồ tín hiệu theo đoạn · Báo cáo trang 8 / 32
                </p>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                {/* Paragraph 1: Low (Greenish) */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-gray-800 font-serif">
                  Mục tiêu của mô hình là hỗ trợ sinh viên lựa chọn học phần phù hợp...
                </div>

                {/* Paragraph 2: Moderate (Yellow) */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-gray-800 font-serif">
                  Trong bối cảnh chuyển đổi số, hệ thống mang đến một giải pháp toàn diện nhằm tối ưu hóa trải nghiệm học tập và nâng cao hiệu quả...
                </div>

                {/* Paragraph 3: Higher signal (Orange) */}
                <div className="p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 text-gray-800 font-serif">
                  Các kết quả cho thấy tiềm năng ứng dụng rộng rãi của phương pháp...
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                Màu thể hiện mức tín hiệu theo đoạn, không thể hiện xác suất vi phạm.
              </div>
            </Card>
          </div>

          {/* Right Col: Cơ sở cảnh báo */}
          <div>
            <Card padding="md" className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Cơ sở cảnh báo
              </h3>

              <ul className="space-y-2 text-xs text-gray-700">
                {aiSignal?.warningReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>

              <p className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 leading-relaxed">
                Văn bản dịch, đã biên tập hoặc khác miền có thể làm giảm độ tin cậy.
              </p>

              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsNoteModalOpen(true)}
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  Thêm ghi chú của giảng viên
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Modal: Ghi chú liêm chính */}
        <Modal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          title="Ghi chú liêm chính học thuật của giảng viên"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsNoteModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSaveNote}>
                Lưu ghi chú
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Ghi chú về việc trao đổi trực tiếp với sinh viên về nội dung văn bản:
            </p>
            <textarea
              rows={4}
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              placeholder="VD: Đã phỏng vấn nhóm sinh viên về phương pháp luận tại trang 8, sinh viên nắm vững bản chất thuật toán..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
            />
          </div>
        </Modal>

        {/* Mockup footer indicator */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-4 uppercase tracking-widest font-mono">
          <span>GRADEFOLIO / PROPOSAL V2</span>
          <span>MOCKUP 07 / 07</span>
        </div>
      </div>
    </div>
  );
}

export default function AiSignalsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400 text-xs">Đang tải...</div>}>
      <AiSignalsContent />
    </Suspense>
  );
}
