'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Code2,
  CheckCircle2,
  ArrowRight,
  ListOrdered,
  Link2,
  ShieldCheck,
  UploadCloud,
  FileCheck,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { evaluationService } from '@/services';

export default function CreateEvaluationPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState('Hệ thống gợi ý học phần');
  const [groupName, setGroupName] = useState('Nhóm 08');
  const [classCode, setClassCode] = useState('Đồ án chuyên ngành · HK261');
  const [reportFile, setReportFile] = useState({
    name: 'bao-cao-nhom-08.pdf',
    details: '32 trang · 4.2 MB',
  });
  const [sourceFile, setSourceFile] = useState({
    name: 'source-nhom-08.zip',
    details: '186 tệp · 8.7 MB',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = async () => {
    setIsSubmitting(true);
    try {
      await evaluationService.createEvaluation({
        projectName,
        groupName,
        classCode,
        reportFileName: reportFile.name,
        sourceFileName: sourceFile.name,
      });
      router.push('/rubric-setting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Tạo phiên đánh giá' }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Tạo phiên đánh giá
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Chuẩn bị đầu vào và chọn phạm vi phân tích cho bài nộp.
          </p>
        </div>

        {/* Stepper Wizard */}
        <div className="flex items-center gap-6 py-2">
          {/* Step 1 */}
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#0F5B46] text-white text-xs font-bold flex items-center justify-center">
              01
            </span>
            <span className="text-xs font-semibold text-gray-900">
              Thông tin & tài liệu
            </span>
          </div>
          <div className="w-8 h-[1px] bg-gray-200" />
          {/* Step 2 */}
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center">
              02
            </span>
            <span className="text-xs font-medium text-gray-500">
              Rubric & cấu hình
            </span>
          </div>
          <div className="w-8 h-[1px] bg-gray-200" />
          {/* Step 3 */}
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center">
              03
            </span>
            <span className="text-xs font-medium text-gray-500">
              Phân tích & xem kết quả
            </span>
          </div>
        </div>

        {/* Main Grid: Form (2 cols) & Guidelines (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Cols: Inputs and Files */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="md" className="space-y-6">
              {/* Thông tin bài nộp */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Thông tin bài nộp
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Tên đề án
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Mã nhóm
                      </label>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Lớp học
                      </label>
                      <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tài liệu đánh giá */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Tài liệu đánh giá
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload Card 1: Báo cáo đề án */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F5B46] flex items-center justify-center mb-3">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-semibold text-gray-900">Báo cáo đề án</div>
                      <div className="text-[11px] text-gray-500 mb-3">Tải báo cáo định dạng PDF</div>
                    </div>
                    {/* Attached file status */}
                    <div className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          {reportFile.name}
                        </div>
                        <div className="text-[10px] text-gray-500">{reportFile.details}</div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                  </div>

                  {/* Upload Card 2: Mã nguồn */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F5B46] flex items-center justify-center mb-3">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-semibold text-gray-900">Mã nguồn</div>
                      <div className="text-[11px] text-gray-500 mb-3">Tải gói mã nguồn ZIP</div>
                    </div>
                    {/* Attached file status */}
                    <div className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          {sourceFile.name}
                        </div>
                        <div className="text-[10px] text-gray-500">{sourceFile.details}</div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Ready Status Box */}
                <div className="mt-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3.5 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-gray-900">Đầu vào sẵn sàng</span>
                    <span className="text-gray-600 block mt-0.5">
                      Báo cáo và mã nguồn đã được gắn với cùng một lần nộp.
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push('/overview')}
                >
                  Lưu bản nháp
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Tiếp tục: Rubric
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Col: Guidelines & Progress Overview */}
          <div className="space-y-6">
            {/* Guidelines Card */}
            <Card padding="md">
              <h3 className="text-sm font-semibold text-gray-900">
                Bài nộp sẽ được kiểm tra
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-4">
                Mỗi kết quả đi kèm bằng chứng nguồn
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <ListOrdered className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">
                      Đánh giá theo rubric
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Điểm thành phần và giải trình
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">
                      Kiểm định trích dẫn
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Claim, nguồn và mức tin cậy
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">
                      Đối soát code – báo cáo
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Kiểm tra tuyên bố triển khai
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">
                      Tín hiệu văn bản AI
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Tùy chọn · báo cáo độc lập
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pipeline progress tracking */}
            <Card padding="md">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Theo dõi tiến trình
              </h3>
              <ol className="space-y-2.5 text-xs text-gray-600 list-decimal list-inside pl-1">
                <li>Đọc cấu trúc PDF và mã nguồn</li>
                <li>Phân tích các chiều đánh giá</li>
                <li>Tổng hợp để giảng viên duyệt</li>
              </ol>
              <p className="text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100 leading-relaxed">
                Khi xử lý thất bại, bài nộp được giữ lại để thử lại hoặc bổ sung tệp.
              </p>
            </Card>
          </div>
        </div>

        {/* Mockup footer indicator */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-4 uppercase tracking-widest font-mono">
          <span>GRADEFOLIO / PROPOSAL V2</span>
          <span>MOCKUP 02 / 07</span>
        </div>
      </div>
    </div>
  );
}
