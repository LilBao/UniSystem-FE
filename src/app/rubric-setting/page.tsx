'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Plus,
  Trash2,
  Sliders,
  Settings2,
  FileCheck2,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useRubrics } from '@/hooks/useRubrics';
import { RubricCriterion } from '@/types';

export default function RubricSettingPage() {
  const router = useRouter();
  const { rubricConfig, setRubricConfig, loading, saving, saveRubric } = useRubrics();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCriterion, setNewCriterion] = useState<Partial<RubricCriterion>>({
    name: '',
    description: '',
    weight: 10,
    maxScore: 10,
  });

  const totalWeight =
    rubricConfig?.criteria.reduce((acc, curr) => acc + curr.weight, 0) || 0;

  const handleSave = async () => {
    if (!rubricConfig) return;
    const success = await saveRubric(rubricConfig);
    if (success) {
      alert('Đã lưu cấu hình Rubric thành công!');
    }
  };

  const handleAddCriterion = () => {
    if (!rubricConfig || !newCriterion.name) return;
    const added: RubricCriterion = {
      id: `crit-${Date.now()}`,
      name: newCriterion.name,
      description: newCriterion.description || '',
      weight: Number(newCriterion.weight) || 10,
      maxScore: Number(newCriterion.maxScore) || 10,
    };
    setRubricConfig({
      ...rubricConfig,
      criteria: [...rubricConfig.criteria, added],
    });
    setIsAddModalOpen(false);
    setNewCriterion({ name: '', description: '', weight: 10, maxScore: 10 });
  };

  const handleRemoveCriterion = (id: string) => {
    if (!rubricConfig) return;
    setRubricConfig({
      ...rubricConfig,
      criteria: rubricConfig.criteria.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Thiết lập rubric' }]} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header section with Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Thiết lập rubric
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cố định tiêu chí và trọng số để mọi bài nộp được đánh giá nhất quán.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || loading}
            icon={<Check className="w-4 h-4" />}
          >
            Lưu rubric
          </Button>
        </div>

        {loading || !rubricConfig ? (
          <div className="py-12 text-center text-gray-400">Đang tải cấu hình Rubric...</div>
        ) : (
          <>
            {/* Top Config Row */}
            <Card padding="md">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Tên rubric
                  </label>
                  <input
                    type="text"
                    value={rubricConfig.name}
                    onChange={(e) =>
                      setRubricConfig({ ...rubricConfig, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Thang điểm
                  </label>
                  <input
                    type="text"
                    value={rubricConfig.scoreScale}
                    onChange={(e) =>
                      setRubricConfig({ ...rubricConfig, scoreScale: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Áp dụng cho
                  </label>
                  <input
                    type="text"
                    value={rubricConfig.appliedClass}
                    onChange={(e) =>
                      setRubricConfig({ ...rubricConfig, appliedClass: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  />
                </div>
              </div>
            </Card>

            {/* Criteria Table Card */}
            <div className="bg-white rounded-xl border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Tiêu chí đánh giá
                </h3>
                <Badge
                  variant={totalWeight === 100 ? 'success' : 'warning'}
                  size="md"
                >
                  Tổng: {totalWeight}%
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/40">
                      <th className="py-3.5 px-6">Tiêu chí</th>
                      <th className="py-3.5 px-6">Mô tả mức đạt</th>
                      <th className="py-3.5 px-6 text-center">Trọng số</th>
                      <th className="py-3.5 px-6 text-center">Điểm tối đa</th>
                      <th className="py-3.5 px-6 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {rubricConfig.criteria.map((crit) => (
                      <tr key={crit.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-gray-900">
                          {crit.name}
                        </td>
                        <td className="py-4 px-6 text-gray-600 max-w-md">
                          {crit.description}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 font-semibold text-gray-800">
                            {crit.weight}%
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center font-medium text-gray-700">
                          {crit.maxScore}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleRemoveCriterion(crit.id)}
                            className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors"
                            title="Xóa tiêu chí"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  icon={<Plus className="w-4 h-4 text-[#0F5B46]" />}
                  className="text-[#0F5B46] hover:bg-emerald-50 font-semibold"
                >
                  + Thêm tiêu chí
                </Button>
              </div>
            </div>

            {/* Bottom 2 Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Cấu hình chấm điểm */}
              <Card padding="md">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Cấu hình chấm điểm
                </h3>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-700">Số lần đánh giá mỗi tiêu chí</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-lg font-semibold text-gray-800">
                      {rubricConfig.evaluationCountPerCriterion} lần
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-t border-gray-100">
                    <span className="text-gray-700">
                      Hiển thị độ dao động giữa các lần chấm
                    </span>
                    <Check className="w-4 h-4 text-[#0F5B46]" />
                  </div>

                  <div className="pt-2 border-t border-gray-100 text-gray-500">
                    Chuyển giảng viên xem xét khi bất đồng cao.
                  </div>
                </div>
              </Card>

              {/* Card 2: Phân tích nâng cao */}
              <Card padding="md">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Phân tích nâng cao
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <Check className="w-4 h-4 text-[#0F5B46]" />
                    <span>Đối soát code – báo cáo</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <Check className="w-4 h-4 text-[#0F5B46]" />
                    <span>Tín hiệu văn bản AI</span>
                  </div>

                  <p className="pt-3 border-t border-gray-100 text-gray-500 leading-relaxed">
                    Tín hiệu AI không tham gia trọng số hoặc tự động trừ điểm học thuật.
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Modal: Thêm tiêu chí */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Thêm tiêu chí đánh giá mới"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleAddCriterion}>
                Thêm tiêu chí
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tên tiêu chí
              </label>
              <input
                type="text"
                placeholder="VD: Kiểm thử tự động & CI/CD"
                value={newCriterion.name}
                onChange={(e) =>
                  setNewCriterion({ ...newCriterion, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mô tả mức đạt
              </label>
              <textarea
                placeholder="Mô tả tiêu chuẩn đạt yêu cầu..."
                rows={3}
                value={newCriterion.description}
                onChange={(e) =>
                  setNewCriterion({ ...newCriterion, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Trọng số (%)
                </label>
                <input
                  type="number"
                  value={newCriterion.weight}
                  onChange={(e) =>
                    setNewCriterion({
                      ...newCriterion,
                      weight: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Điểm tối đa
                </label>
                <input
                  type="number"
                  value={newCriterion.maxScore}
                  onChange={(e) =>
                    setNewCriterion({
                      ...newCriterion,
                      maxScore: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </Modal>

        {/* Mockup footer indicator */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-4 uppercase tracking-widest font-mono">
          <span>GRADEFOLIO / PROPOSAL V2</span>
          <span>MOCKUP 03 / 07</span>
        </div>
      </div>
    </div>
  );
}
