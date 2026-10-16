'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';

interface EvaluationSubNavProps {
  evaluationId: string;
}

export const EvaluationSubNav: React.FC<EvaluationSubNavProps> = ({ evaluationId }) => {
  const pathname = usePathname();

  const tabs = [
    {
      label: 'Tổng hợp',
      href: `/evaluations/${evaluationId}`,
      isActive: pathname === `/evaluations/${evaluationId}`,
    },
    {
      label: 'Trích dẫn',
      href: `/evaluations/${evaluationId}/citations`,
      isActive: pathname.includes('/citations'),
    },
    {
      label: 'Code – báo cáo',
      href: `/evaluations/${evaluationId}/code-audit`,
      isActive: pathname.includes('/code-audit'),
    },
    {
      label: 'Tín hiệu AI',
      href: `/evaluations/${evaluationId}/ai-signals`,
      isActive: pathname.includes('/ai-signals'),
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Tab pills */}
      <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab.isActive
                ? 'bg-[#0F5B46] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Right status badge */}
      <div>
        <Badge variant="warning" size="md">
          Cần xem xét
        </Badge>
      </div>
    </div>
  );
};
