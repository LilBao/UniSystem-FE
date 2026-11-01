'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  ArrowRight,
  Info,
  Filter,
  FileCheck,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { MetricCard } from '@/components/ui/MetricCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useEvaluations } from '@/hooks/useEvaluations';
import { EvaluationStatus } from '@/types';

export default function OverviewPage() {
  const router = useRouter();
  const {
    evaluations,
    loading,
    search,
    setSearch,
    status,
    setStatus,
  } = useEvaluations();

  const getStatusBadge = (evalStatus: EvaluationStatus) => {
    switch (evalStatus) {
      case 'needs_review':
        return <Badge variant="warning">Cần xem xét</Badge>;
      case 'analyzing':
        return <Badge variant="info">Đang phân tích</Badge>;
      case 'completed':
        return <Badge variant="success">Đã phê duyệt</Badge>;
      default:
        return <Badge variant="neutral">Bản nháp</Badge>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Tổng quan đánh giá' }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Tổng quan đánh giá
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Một nơi để theo dõi bài nộp, rà soát bằng chứng và hoàn tất phản hồi.
            </p>
          </div>
          <Link href="/create-evaluation">
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
            >
              Tạo đánh giá
            </Button>
          </Link>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Tổng bài nộp"
            value="48"
            description="Đồ án chuyên ngành · HK261"
          />
          <MetricCard
            label="Đã hoàn tất"
            value="32"
            description="Đã được giảng viên phê duyệt"
          />
          <MetricCard
            label="Cần xem xét"
            value="10"
            description="Có bằng chứng cần đối chiếu"
          />
          <MetricCard
            label="Đang phân tích"
            value="06"
            description="4 luồng phân tích đang chạy"
          />
        </div>

        {/* Recent Evaluations Card */}
        <div className="bg-white rounded-xl border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Card Header & Controls */}
          <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Bài đánh giá gần đây
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Ưu tiên các bài cần giảng viên xem xét
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Filter dropdown */}
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#0F5B46] pr-8 appearance-none cursor-pointer"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="needs_review">Cần xem xét</option>
                  <option value="analyzing">Đang phân tích</option>
                  <option value="completed">Đã phê duyệt</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-4 bg-gray-50/50 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên đề án, sinh viên hoặc mã bài nộp..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-xs border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                  <th className="py-3.5 px-6">Đề án / Nhóm</th>
                  <th className="py-3.5 px-6">Trạng thái</th>
                  <th className="py-3.5 px-6">Điểm đề xuất</th>
                  <th className="py-3.5 px-6">Cần xem xét</th>
                  <th className="py-3.5 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Đang tải danh sách bài nộp...
                    </td>
                  </tr>
                ) : evaluations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Không tìm thấy bài nộp nào phù hợp
                    </td>
                  </tr>
                ) : (
                  evaluations.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/evaluations/${item.id}`)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover:bg-[#EBF8F2] group-hover:text-[#0F5B46] transition-colors">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-[#0F5B46] transition-colors">
                              {item.projectName}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              {item.groupName} · Nộp {item.submittedAt}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
                      <td className="py-4 px-6">
                        {item.proposedScore ? (
                          <span className="font-bold text-gray-900">
                            {item.proposedScore.toFixed(2)}{' '}
                            <span className="text-gray-400 font-normal">/ 10</span>
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {item.itemsToReview}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0F5B46] group-hover:translate-x-1 transition-all ml-auto" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/20">
            <div>Hiển thị 4 trong 48 bài nộp</div>
            <div className="flex items-center gap-1 font-medium">
              <button className="px-2 py-1 rounded hover:bg-gray-100 text-gray-400">‹</button>
              <button className="px-2.5 py-1 rounded bg-[#0F5B46] text-white">1</button>
              <button className="px-2.5 py-1 rounded hover:bg-gray-100 text-gray-700">2</button>
              <button className="px-2.5 py-1 rounded hover:bg-gray-100 text-gray-700">3</button>
              <button className="px-2 py-1 rounded hover:bg-gray-100 text-gray-700">›</button>
            </div>
          </div>
        </div>

        {/* System Notice Banner */}
        <div className="bg-[#EBF8F2] border border-[#BBF7D0] rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#0F5B46] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-gray-900 block">
              Mọi điểm số đều đi kèm minh chứng rõ ràng.
            </span>
            <span className="text-gray-600 mt-0.5 block">
              Kết quả kiểm tra văn bản AI chỉ mang tính chất tham khảo và không tự động làm thay đổi điểm số của sinh viên.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
