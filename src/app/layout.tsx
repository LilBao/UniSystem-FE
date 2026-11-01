import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'UniSystem',
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
