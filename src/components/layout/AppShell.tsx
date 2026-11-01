'use client';

import React, { Suspense, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const AUTH_PATHS = ['/signin', '/signup', '/login', '/register'];

const AuthGuardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const shouldBlock =
    loading || (!isAuthenticated && !isAuthPage) || (isAuthenticated && isAuthPage);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && !isAuthPage) {
      router.replace('/signin');
    } else if (isAuthenticated && isAuthPage) {
      router.replace('/overview');
    }
  }, [isAuthenticated, loading, isAuthPage, router]);

  return (
    <>
      {shouldBlock && (
        <div className="fixed inset-0 z-50 min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0F5B46] flex items-center justify-center text-white shadow-sm animate-pulse">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="text-xs font-medium text-gray-500">
            {loading ? 'Đang kiểm tra phiên đăng nhập...' : 'Đang chuyển hướng...'}
          </div>
        </div>
      )}

      {isAuthPage ? (
        <main
          aria-hidden={shouldBlock}
          className={`flex-1 flex flex-col min-w-0 min-h-screen w-full overflow-y-auto bg-[#F8FAFC] ${
            shouldBlock ? ' invisible pointer-events-none select-none' : ''
          }`}
        >
          <Suspense
            fallback={
              <div className="p-8 text-center text-gray-400 text-xs">Đang tải...</div>
            }
          >
            {children}
          </Suspense>
        </main>
      ) : (
        <div
          aria-hidden={shouldBlock}
          className={`flex min-h-screen w-full ${
            shouldBlock ? 'invisible pointer-events-none select-none' : ''
          }`}
        >
          <Suspense
            fallback={<aside className="w-64 bg-white border-r border-gray-200 shrink-0" />}
          >
            <Sidebar />
          </Suspense>
          <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
            <Suspense
              fallback={
                <div className="p-8 text-center text-gray-400 text-xs">Đang tải...</div>
              }
            >
              {children}
            </Suspense>
          </main>
        </div>
      )}
    </>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AuthGuardShell>{children}</AuthGuardShell>
    </AuthProvider>
  );
};
