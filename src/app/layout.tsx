import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'UniSystem - Đồ án chuyên ngành CSE · HK261',
  description: 'Nền tảng rà soát bằng chứng, chấm điểm theo rubric và đối soát đề án sinh viên',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <body className="h-full flex overflow-hidden bg-[#F8FAFC]">
        <Suspense fallback={<aside className="w-64 bg-white border-r border-gray-200 shrink-0" />}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <Suspense fallback={<div className="p-8 text-center text-gray-400 text-xs">Đang tải...</div>}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
