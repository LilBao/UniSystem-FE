'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FileText,
  ListOrdered,
  BarChart2,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Tổng quan',
      href: '/overview',
      icon: LayoutGrid,
      isActive: pathname === '/' || pathname === '/overview',
    },
    {
      label: 'Bài đánh giá',
      href: '/evaluations/nhom-08',
      icon: FileText,
      isActive: pathname.startsWith('/evaluations') || pathname === '/create-evaluation',
    },
    {
      label: 'Rubric',
      href: '/rubric-setting',
      icon: ListOrdered,
      isActive: pathname.startsWith('/rubric-setting'),
    },
    {
      label: 'Báo cáo',
      href: '/overview',
      icon: BarChart2,
      isActive: false,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Logo / Brand Header */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F5B46] flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 tracking-tight leading-none">
              UniSystem
            </h1>
            <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
              DACN · Gradefolio
            </span>
          </div>
        </div>

        {/* Space: Không gian giảng viên */}
        <div className="p-4">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 px-1">
            Không gian giảng viên
          </span>
          <div className="bg-[#F8FAFC] border border-gray-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EBF8F2] text-[#0F5B46] font-bold text-xs flex items-center justify-center border border-[#BBF7D0]">
              BK
            </div>
            <div>
              <div className="font-semibold text-xs text-gray-900">Khoa CSE</div>
              <div className="text-[11px] text-gray-500">Học kỳ 261</div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  item.isActive
                    ? 'bg-[#EBF8F2] text-[#0F5B46] font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.isActive ? 'text-[#0F5B46]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Classes Section */}
        <div className="p-4 mt-2">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 px-1">
            Lớp học
          </span>
          <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F5B46]"></span>
              <span className="text-xs font-semibold text-gray-800">Đồ án chuyên ngành</span>
            </div>
            <div className="text-[11px] text-gray-500 pl-4 mt-0.5">48 bài nộp</div>
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="p-4 space-y-3">
        {/* System Principle Card */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3.5 flex gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-gray-900">Bằng chứng là trọng tâm</div>
            <div className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
              Giảng viên quyết định điểm cuối cùng.
            </div>
          </div>
        </div>

        {/* Teacher Profile */}
        <div className="border-t border-gray-100 pt-3 flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center">
            LX
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-900 truncate">Lê Xuân Bách</div>
            <div className="text-[11px] text-gray-500">Giảng viên</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
