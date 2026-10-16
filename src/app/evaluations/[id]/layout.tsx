import React, { Suspense } from 'react';

export function generateStaticParams() {
  return [
    { id: 'nhom-08' },
    { id: 'nhom-12' },
    { id: 'nhom-03' },
    { id: 'nhom-15' },
  ];
}

export default function EvaluationDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400 text-xs">Đang tải...</div>}>
      {children}
    </Suspense>
  );
}
