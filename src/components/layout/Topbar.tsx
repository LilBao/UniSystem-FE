'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopbarProps {
  breadcrumbs?: BreadcrumbItem[];
}

export const Topbar: React.FC<TopbarProps> = ({ breadcrumbs = [] }) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200/90 px-6 flex items-center justify-between shrink-0">
      {/* Breadcrumb Trail */}
      <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <Link href="/overview" className="hover:text-gray-900 transition-colors">
          Đồ án chuyên ngành
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-gray-900 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-semibold">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium border border-gray-200/70">
          Dữ liệu minh họa
        </span>
        <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center">
          LX
        </div>
      </div>
    </header>
  );
};
