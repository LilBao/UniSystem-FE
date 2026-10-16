'use client';

import React, { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import {
  Check,
  FileText,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { EvaluationSubNav } from '@/components/layout/EvaluationSubNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useEvaluationDetail } from '@/hooks/useEvaluationDetail';
import { citationService } from '@/services';

function CitationsContent() {
  const params = useParams();
  const evaluationId = (params?.id as string) || 'nhom-08';

  const { citations, setCitations } = useEvaluationDetail(evaluationId);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('claim-07');
  const [filterMode, setFilterMode] = useState<'needs_review' | 'all'>('needs_review');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [teacherNote, setTeacherNote] = useState('');

  const selectedClaim =
    citations.find((c) => c.id === selectedClaimId) || citations[0];

  const filteredClaims =
    filterMode === 'needs_review'
      ? citations.filter((c) => c.status === 'REFUTE' || c.status === 'NEI')
      : citations;

  const handleMarkViewed = async () => {
    if (!selectedClaim) return;
    await citationService.markViewed(selectedClaim.id);
    setCitations(
      citations.map((c) =>
        c.id === selectedClaim.id ? { ...c, viewed: true } : c
      )
    );
    alert('Đã đánh dấu xem xét bằng chứng!');
  };

  const handleSaveNote = async () => {
    if (!selectedClaim) return;
    await citationService.addNote(selectedClaim.id, teacherNote);
    setIsCommentModalOpen(false);
    alert('Đã thêm nhận xét cho claim!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUPPORT':
        return <Badge variant="success">SUPPORT</Badge>;
      case 'REFUTE':
        return <Badge variant="danger">REFUTE</Badge>;
      case 'NEI':
        return <Badge variant="warning">NEI</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Kiểm định trích dẫn' }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Kiểm định trích dẫn
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Nhóm 08 / Hệ thống gợi ý học phần · Kiểm tra từng claim với tài liệu được viện dẫn.
          </p>
        </div>

        {/* Sub Navigation */}
        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <EvaluationSubNav evaluationId={evaluationId} />
        </Suspense>

        {/* 3 Citation Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#15803D]">13</span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Được hỗ trợ
              </div>
              <div className="text-[11px] text-gray-500">SUPPORT</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#B91C1C]">02</span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Bị phản bác
              </div>
              <div className="text-[11px] text-gray-500">REFUTE</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <span className="text-3xl font-extrabold text-[#B45309]">03</span>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                Chưa đủ bằng chứng
              </div>
              <div className="text-[11px] text-gray-500">NEI</div>
            </div>
          </div>
        </div>

        {/* 2 Column Details: Left Claims list, Right Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Col: Danh sách claim */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Danh sách claim
              </h3>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterMode('needs_review')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterMode === 'needs_review'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cần xem xét
              </button>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterMode === 'all'
                    ? 'bg-gray-200 text-gray-900 font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tất cả: {citations.length}
              </button>
            </div>

            {/* Claims list */}
            <div className="space-y-3 pt-2">
              {filteredClaims.map((claim) => {
                const isSelected = claim.id === selectedClaimId;
                return (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaimId(claim.id)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
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
              })}
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

                {/* Section 1: CLAIM TRONG BÁO CÁO */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Claim trong báo cáo
                  </span>
                  <div className="bg-red-50/40 border border-red-200/80 rounded-xl p-4 text-xs text-gray-800 leading-relaxed italic font-serif">
                    {selectedClaim.claimText}
                  </div>
                  <div className="text-[11px] text-[#0F5B46] font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{selectedClaim.reportLocation}</span>
                  </div>
                </div>

                {/* Section 2: BẰNG CHỨNG TỪ TÀI LIỆU GỐC */}
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
            ) : null}
          </div>
        </div>

        {/* Modal: Nhận xét cho claim */}
        <Modal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          title={`Thêm nhận xét cho ${selectedClaim?.claimCode || 'claim'}`}
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
            placeholder="Nhập ghi chú yêu cầu sinh viên đính chính hoặc cung cấp thêm bằng chứng..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
          />
        </Modal>

        {/* Mockup footer indicator */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-4 uppercase tracking-widest font-mono">
          <span>GRADEFOLIO / PROPOSAL V2</span>
          <span>MOCKUP 05 / 07</span>
        </div>
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
