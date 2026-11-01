'use client';

import React, { useState, useRef } from 'react';
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
  Play,
  AlertCircle,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  submissionService,
  uploadService,
} from '@/services';
import { useAuth } from '@/context/AuthContext';
import { PipelineRunResponse } from '@/types';

export default function CreateEvaluationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const reportInputRef = useRef<HTMLInputElement | null>(null);
  const sourceInputRef = useRef<HTMLInputElement | null>(null);

  const [submissionId, setSubmissionId] = useState<string>('');
  const [projectId] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID || '00000000-0000-4000-8000-000000000003'
  );
  const [groupId] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_GROUP_ID || '00000000-0000-4000-8000-000000000004'
  );
  const [rubricVersionId] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_RUBRIC_VERSION_ID || '00000000-0000-4000-8000-000000000005'
  );
  const [attemptNo] = useState(1);

  const [projectName, setProjectName] = useState('Hệ thống gợi ý học phần');
  const [groupName, setGroupName] = useState('Nhóm 08');
  const [classCode, setClassCode] = useState('Đồ án chuyên ngành · HK261');

  const [reportFile, setReportFile] = useState<{
    name: string;
    details: string;
    sha256?: string;
    objectUri?: string;
  } | null>(null);

  const [sourceFile, setSourceFile] = useState<{
    name: string;
    details: string;
    sha256?: string;
    objectUri?: string;
  } | null>(null);

  const [uploadingKind, setUploadingKind] = useState<'report_pdf' | 'source_archive' | null>(null);
  const [layer1Run, setLayer1Run] = useState<PipelineRunResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const ensureSubmissionCreated = async (): Promise<string> => {
    if (submissionId) return submissionId;
    const created = await submissionService.createSubmission({
      project_id: projectId.trim(),
      group_id: groupId.trim(),
      submitted_by_user_id:
        user?.id ||
        process.env.NEXT_PUBLIC_DEFAULT_USER_ID ||
        '00000000-0000-4000-8000-000000000001',
      rubric_version_id: rubricVersionId.trim(),
      attempt_no: attemptNo,
    });
    setSubmissionId(created.id);
    return created.id;
  };

  const handleFileChange = async (
    kind: 'report_pdf' | 'source_archive',
    file?: File
  ) => {
    if (!file) return;
    setApiError(null);
    setUploadingKind(kind);
    try {
      const activeSubId = await ensureSubmissionCreated();

      const uploaded = await uploadService.uploadSubmissionFile(
        activeSubId,
        kind,
        file
      );

      await submissionService.registerArtifact(activeSubId, {
        kind,
        version_no: 1,
        object_uri: uploaded.object_uri,
        media_type: uploaded.media_type,
        byte_size: uploaded.byte_size,
        sha256: uploaded.sha256,
        metadata: { original_filename: uploaded.original_filename },
      });

      const sizeMb = (uploaded.byte_size / (1024 * 1024)).toFixed(2);
      if (kind === 'report_pdf') {
        setReportFile({
          name: uploaded.original_filename,
          details: `PDF · ${sizeMb} MB`,
          sha256: uploaded.sha256,
          objectUri: uploaded.object_uri,
        });
      } else {
        setSourceFile({
          name: uploaded.original_filename,
          details: `Archive · ${sizeMb} MB`,
          sha256: uploaded.sha256,
          objectUri: uploaded.object_uri,
        });
      }
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : 'Lỗi khi tải tệp lên Backend'
      );
    } finally {
      setUploadingKind(null);
    }
  };

  const handleTriggerLayer1 = async () => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const activeSubId = await ensureSubmissionCreated();
      const run = await submissionService.submitSubmission(activeSubId);
      setLayer1Run(run);
      return activeSubId;
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : 'Lỗi khi kích hoạt Layer 1 Preprocessing'
      );
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    const subId = await handleTriggerLayer1();
    if (subId) {
      router.push(`/evaluations/${subId}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Tạo phiên đánh giá' }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Tạo phiên đánh giá
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Điền thông tin nhóm và tải lên tệp báo cáo PDF cùng mã nguồn để bắt đầu đánh giá.
            </p>
          </div>
        </div>

        {apiError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Không thể thực hiện thao tác:</span>
              <span>{apiError}</span>
            </div>
          </div>
        )}

        {/* Stepper Wizard */}
        <div className="flex items-center gap-6 py-2">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#0F5B46] text-white text-xs font-bold flex items-center justify-center">
              01
            </span>
            <span className="text-xs font-semibold text-gray-900">
              Thông tin & tài liệu
            </span>
          </div>
          <div className="w-8 h-[1px] bg-gray-200" />
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center">
              02
            </span>
            <span className="text-xs font-medium text-gray-500">
              Rubric & cấu hình
            </span>
          </div>
          <div className="w-8 h-[1px] bg-gray-200" />
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center">
              03
            </span>
            <span className="text-xs font-medium text-gray-500">
              Phân tích & xem kết quả
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Tài liệu đính kèm
                  </h3>
                </div>

                {/* Hidden file inputs */}
                <input
                  ref={reportInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange('report_pdf', e.target.files?.[0])
                  }
                />
                <input
                  ref={sourceInputRef}
                  type="file"
                  accept=".zip,.tar,.gz"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange('source_archive', e.target.files?.[0])
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F5B46] flex items-center justify-center mb-2">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-semibold text-gray-900">
                          Báo cáo đề án (PDF)
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Tải lên báo cáo định dạng PDF
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => reportInputRef.current?.click()}
                        disabled={uploadingKind !== null}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[11px] font-medium text-[#0F5B46] hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{uploadingKind === 'report_pdf' ? 'Đang tải...' : 'Chọn PDF'}</span>
                      </button>
                    </div>

                    {reportFile ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-semibold text-gray-900 truncate">
                              {reportFile.name}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {reportFile.details}
                            </div>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-dashed border-gray-200 rounded-lg p-3 text-center text-[11px] text-gray-400">
                        Chưa chọn tệp PDF
                      </div>
                    )}
                  </div>

                  {/*Mã nguồn */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F5B46] flex items-center justify-center mb-2">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-semibold text-gray-900">
                          Mã nguồn (ZIP)
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Tải lên gói mã nguồn nén
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => sourceInputRef.current?.click()}
                        disabled={uploadingKind !== null}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[11px] font-medium text-[#0F5B46] hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>
                          {uploadingKind === 'source_archive' ? 'Đang tải...' : 'Chọn ZIP'}
                        </span>
                      </button>
                    </div>

                    {sourceFile ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-semibold text-gray-900 truncate">
                              {sourceFile.name}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {sourceFile.details}
                            </div>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-dashed border-gray-200 rounded-lg p-3 text-center text-[11px] text-gray-400">
                        Chưa chọn tệp ZIP
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Status Box */}
                <div className="mt-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-semibold text-gray-900">
                        {layer1Run
                          ? 'Đã gửi yêu cầu xử lý bài nộp'
                          : submissionId
                            ? 'Đã khởi tạo hồ sơ bài nộp'
                            : 'Sẵn sàng xử lý bài nộp'}
                      </span>
                      <span className="text-gray-600 block mt-0.5">
                        {layer1Run
                          ? 'Hệ thống đang trích xuất dữ liệu từ báo cáo và mã nguồn.'
                          : 'Tải lên tệp đính kèm và bấm "Kiểm tra tệp nộp" hoặc "Nộp & Mở phiên đánh giá".'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTriggerLayer1}
                    disabled={isSubmitting}
                    icon={<Play className="w-3.5 h-3.5" />}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Kiểm tra tệp nộp'}
                  </Button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push('/overview')}
                >
                  Quay lại
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Nộp & Mở phiên đánh giá
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Col: Guidelines & Progress Overview */}
          <div className="space-y-6">
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
                      Đối chiếu nội dung trích dẫn và nguồn tài liệu
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
                      So sánh mô tả trong báo cáo với mã nguồn thực tế
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
      </div>
    </div>
  );
}
