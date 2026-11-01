'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  FileText,
  ListOrdered,
  Users,
  CheckCircle2,
  GraduationCap,
  LogOut,
  LogIn,
  KeyRound,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { authService } from '@/services';
import { Permission } from '@/types';

const ALL_PERMISSION_ITEMS: Array<{
  permission: Permission;
  label: string;
  category: string;
}> = [
    { permission: 'submission:create', label: 'Tạo bài nộp mới', category: 'Bài nộp' },
    { permission: 'submission:upload', label: 'Tải tệp báo cáo & mã nguồn', category: 'Bài nộp' },
    { permission: 'submission:submit', label: 'Gửi bài nộp để xử lý', category: 'Bài nộp' },
    { permission: 'submission:read', label: 'Xem thông tin bài nộp', category: 'Bài nộp' },
    { permission: 'evaluation:read', label: 'Xem kết quả đánh giá', category: 'Chấm điểm' },
    { permission: 'evaluation:override', label: 'Chỉnh sửa điểm số', category: 'Chấm điểm' },
    { permission: 'evaluation:publish', label: 'Phê duyệt & công bố kết quả', category: 'Chấm điểm' },
    { permission: 'pipeline:run', label: 'Chạy phân tích bài nộp', category: 'Phân tích' },
    { permission: 'pipeline:read', label: 'Xem tiến trình phân tích', category: 'Phân tích' },
    { permission: 'rubric:read', label: 'Xem tiêu chí chấm điểm', category: 'Tiêu chí' },
    { permission: 'rubric:manage', label: 'Thiết lập tiêu chí chấm điểm', category: 'Tiêu chí' },
    { permission: 'rubric:publish', label: 'Áp dụng bộ tiêu chí chấm', category: 'Tiêu chí' },
    { permission: 'group:read', label: 'Xem thông tin nhóm đồ án', category: 'Nhóm & Lớp' },
    { permission: 'group:create', label: 'Tạo nhóm đồ án mới', category: 'Nhóm & Lớp' },
    { permission: 'group:manage_members', label: 'Quản lý thành viên nhóm đồ án', category: 'Nhóm & Lớp' },
    { permission: 'course:read', label: 'Xem thông tin lớp học', category: 'Nhóm & Lớp' },
    { permission: 'course:create', label: 'Tạo lớp học mới', category: 'Nhóm & Lớp' },
    { permission: 'course:update', label: 'Cập nhật thông tin lớp học', category: 'Nhóm & Lớp' },
    { permission: 'course:manage_members', label: 'Quản lý thành viên lớp học', category: 'Nhóm & Lớp' },
    { permission: 'project:read', label: 'Xem thông tin đề án', category: 'Nhóm & Lớp' },
    { permission: 'project:manage', label: 'Quản lý đề án', category: 'Nhóm & Lớp' },
    { permission: 'user:read', label: 'Xem hồ sơ tài khoản', category: 'Hệ thống' },
    { permission: 'user:manage', label: 'Quản lý người dùng hệ thống', category: 'Hệ thống' },
    { permission: 'audit:read', label: 'Xem nhật ký hoạt động', category: 'Hệ thống' },
  ];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'rbac' | 'password'>('profile');

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Danh sách quyền thực tế được đồng bộ từ Backend
  const [serverEffectivePerms, setServerEffectivePerms] = useState<Permission[]>([]);

  useEffect(() => {
    if (!isAccountModalOpen || activeTab !== 'rbac' || !user) return;
    let active = true;
    authService
      .checkPermission({
        permission: 'user:read',
        course_id: user.course_memberships?.[0]?.course_id || null,
        group_id: user.group_memberships?.[0]?.group_id || null,
      })
      .then((res) => {
        if (active && Array.isArray(res.effective_permissions)) {
          setServerEffectivePerms(res.effective_permissions);
        }
      })
      .catch(() => {
        // Fallback sử dụng danh sách quyền từ hồ sơ user hiện tại
      });
    return () => {
      active = false;
    };
  }, [isAccountModalOpen, activeTab, user]);

  const grantedPermissions = useMemo(() => {
    const set = new Set<Permission>();
    if (!user) return set;
    if (user.global_role === 'admin') {
      ALL_PERMISSION_ITEMS.forEach((item) => set.add(item.permission));
      return set;
    }
    user.permissions?.forEach((p) => set.add(p));
    user.course_memberships?.forEach((cm) =>
      cm.permissions?.forEach((p) => set.add(p))
    );
    user.group_memberships?.forEach((gm) =>
      gm.permissions?.forEach((p) => set.add(p))
    );
    serverEffectivePerms.forEach((p) => set.add(p));
    return set;
  }, [user, serverEffectivePerms]);

  const initials =
    user?.display_name
      ?.split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'US';

  const roleDisplay: Record<string, string> = {
    instructor: 'Giảng viên',
    student: 'Sinh viên',
    admin: 'Quản trị viên',
    user: 'Người dùng',
  };

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
      label: 'Thành viên & Nhóm',
      href: '/members',
      icon: Users,
      isActive: pathname.startsWith('/members'),
    },
  ];

  const handleChangePassword = async () => {
    setPasswordStatus(null);
    setPasswordError(null);
    try {
      await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setPasswordStatus('Đã cập nhật mật khẩu thành công.');
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : 'Đổi mật khẩu thất bại.'
      );
    }
  };

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
            </span>
          </div>
        </div>

        {/* Space: Không gian học thuật */}
        <div className="p-4">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 px-1">
            {user?.global_role === 'student' ? 'Không gian sinh viên' : 'Không gian giảng viên'}
          </span>
          <div className="bg-[#F8FAFC] border border-gray-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EBF8F2] text-[#0F5B46] font-bold text-xs flex items-center justify-center border border-[#BBF7D0]">
              BK
            </div>
            <div>
              <div className="font-semibold text-xs text-gray-900">Khoa CSE</div>
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${item.isActive
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

        {/* User Profile & Auth Actions */}
        <div className="border-t border-gray-100 pt-3 space-y-2">
          {isAuthenticated && user ? (
            <>
              <div
                onClick={() => setIsAccountModalOpen(true)}
                className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                title="Bấm để xem thông tin tài khoản"
              >
                <div className="w-8 h-8 rounded-full bg-[#EBF8F2] text-[#0F5B46] border border-[#BBF7D0] font-bold text-xs flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {user.display_name}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    {roleDisplay[user.global_role] || 'Thành viên'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-1">
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="flex-1 text-center py-1.5 px-2 rounded-lg text-[11px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/80 transition-colors cursor-pointer"
                >
                  Tài khoản
                </button>
                <button
                  onClick={() => {
                    logout();
                    router.push('/signin');
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200/80 transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/signin"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0F5B46] text-white text-xs font-semibold hover:bg-[#0B4C39] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center py-2 px-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                <span>Đăng ký</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Thông tin tài khoản */}
      {user && (
        <Modal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          title="Thông tin tài khoản"
          footer={
            <>
              <Button
                variant="primary"
                onClick={() => {
                  setIsAccountModalOpen(false);
                  router.push('/members');
                }}
              >
                Quản lý Thành viên & Nhóm
              </Button>
              <Button variant="outline" onClick={() => setIsAccountModalOpen(false)}>
                Đóng
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'profile'
                  ? 'bg-white text-[#0F5B46] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Hồ sơ cá nhân
              </button>
              <button
                onClick={() => setActiveTab('rbac')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'rbac'
                  ? 'bg-white text-[#0F5B46] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Quyền truy cập
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'password'
                  ? 'bg-white text-[#0F5B46] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Đổi mật khẩu
              </button>
            </div>

            {activeTab === 'profile' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">
                      {user.display_name}
                    </span>
                    <Badge variant="success" size="sm">
                      {roleDisplay[user.global_role] || 'Thành viên'}
                    </Badge>
                  </div>
                  <div className="text-gray-500">{user.email}</div>
                </div>

                <div>
                  <div className="font-semibold text-gray-700 mb-1.5">
                    Lớp học tham gia:
                  </div>
                  {user.course_memberships.length === 0 ? (
                    <div className="text-gray-400 italic">Chưa tham gia lớp học nào</div>
                  ) : (
                    user.course_memberships.map((cm) => (
                      <div
                        key={cm.course_id}
                        className="p-2.5 rounded-lg border border-gray-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">
                            {cm.course_code} · {cm.course_name}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Học kỳ {cm.term}
                          </div>
                        </div>
                        <Badge variant="info" size="sm">
                          {roleDisplay[cm.role] || cm.role}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>

                {user.group_memberships.length > 0 && (
                  <div>
                    <div className="font-semibold text-gray-700 mb-1.5">
                      Nhóm đồ án:
                    </div>
                    {user.group_memberships.map((gm) => (
                      <div
                        key={gm.group_id}
                        className="p-2.5 rounded-lg border border-gray-200 flex items-center justify-between"
                      >
                        <span className="font-semibold text-gray-900">
                          {gm.group_name}
                        </span>
                        <Badge variant="success" size="sm">
                          {gm.role === 'leader' ? 'Nhóm trưởng' : 'Thành viên'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rbac' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-gray-500">
                  <span>Danh sách quyền thao tác của tài khoản hiện tại:</span>
                  <span className="font-semibold text-[#0F5B46]">
                    Được cấp {grantedPermissions.size} / {ALL_PERMISSION_ITEMS.length} quyền
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                      <tr className="text-[11px] font-semibold text-gray-500">
                        <th className="py-2.5 px-3.5">Quyền thao tác</th>
                        <th className="py-2.5 px-3 text-center w-24">Nhóm</th>
                        <th className="py-2.5 px-3.5 text-center w-24">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {ALL_PERMISSION_ITEMS.map((item) => {
                        const allowed = grantedPermissions.has(item.permission);
                        return (
                          <tr
                            key={item.permission}
                            className="hover:bg-gray-50/70 transition-colors"
                          >
                            <td className="py-2.5 px-3.5 font-medium text-gray-800">
                              {item.label}
                            </td>
                            <td className="py-2.5 px-3 text-center text-[11px] text-gray-500">
                              {item.category}
                            </td>
                            <td className="py-2.5 px-3.5 text-center">
                              {allowed ? (
                                <span
                                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700"
                                  title="Được phép"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600"
                                  title="Không có quyền"
                                >
                                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Mật khẩu mới (ít nhất 8 ký tự, gồm chữ và số)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                {passwordError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800">
                    {passwordError}
                  </div>
                )}
                {passwordStatus && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                    {passwordStatus}
                  </div>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleChangePassword}
                  icon={<KeyRound className="w-3.5 h-3.5" />}
                >
                  Cập nhật mật khẩu
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </aside>
  );
};
