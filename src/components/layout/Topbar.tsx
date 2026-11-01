'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopbarProps {
  breadcrumbs?: BreadcrumbItem[];
}

export const Topbar: React.FC<TopbarProps> = ({ breadcrumbs = [] }) => {
  const { user, isAuthenticated } = useAuth();

  const initials =
    user?.display_name
      ?.split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'US';

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
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-block text-xs text-gray-600 font-medium">
              {user.display_name}
            </span>
            <div
              title={`${user.display_name} (${user.email})`}
              className="w-7 h-7 rounded-full bg-[#EBF8F2] text-[#0F5B46] border border-[#BBF7D0] font-semibold text-xs flex items-center justify-center"
            >
              {initials}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F5B46] px-3 py-1.5 rounded-lg bg-[#EBF8F2] hover:bg-[#DCFCE7] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng ký</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
