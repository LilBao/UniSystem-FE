'use client';

import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Shield,
  UserCheck,
  UserPlus,
  UserMinus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services';
import { CourseRole, GlobalRole, GroupRole } from '@/types';

type ActiveSection = 'me' | 'group' | 'course' | 'system';

const GLOBAL_ROLE_LABELS: Record<GlobalRole, string> = {
  admin: 'Quản trị viên',
  instructor: 'Giảng viên',
  student: 'Sinh viên',
  user: 'Người dùng',
};

const COURSE_ROLE_LABELS: Record<CourseRole, string> = {
  instructor: 'Giảng viên',
  ta: 'Trợ giảng',
  reviewer: 'Giảng viên chấm bài',
  student: 'Sinh viên',
};

const GROUP_ROLE_LABELS: Record<GroupRole, string> = {
  leader: 'Nhóm trưởng',
  member: 'Thành viên',
};

export default function MembersManagementPage() {
  const { user, refreshProfile } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('me');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [projectId, setProjectId] = useState(
    user?.group_memberships?.[0]?.project_id ||
    process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID ||
    '00000000-0000-4000-8000-000000000003'
  );

  const [groupId, setGroupId] = useState(
    user?.group_memberships?.[0]?.group_id ||
    process.env.NEXT_PUBLIC_DEFAULT_GROUP_ID ||
    '00000000-0000-4000-8000-000000000004'
  );
  const [groupTargetUserId, setGroupTargetUserId] = useState('');
  const [groupRole, setGroupRole] = useState<GroupRole>('member');

  const [courseId, setCourseId] = useState(
    user?.course_memberships?.[0]?.course_id ||
    process.env.NEXT_PUBLIC_DEFAULT_COURSE_ID ||
    '00000000-0000-4000-8000-000000000002'
  );
  const [courseTargetUserId, setCourseTargetUserId] = useState('');
  const [courseRole, setCourseRole] = useState<CourseRole>('student');

  const [systemTargetUserId, setSystemTargetUserId] = useState('');
  const [globalRole, setGlobalRole] = useState<GlobalRole>('student');
  const [isActiveAccount, setIsActiveAccount] = useState(true);

  const clearFeedback = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleRefreshMe = async () => {
    clearFeedback();
    setLoadingAction(true);
    try {
      await refreshProfile();
      setSuccessMsg('Đã cập nhật thông tin cá nhân, lớp học và nhóm đồ án mới nhất.');
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Không thể tải thông tin cá nhân.'
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAssignGroupMember = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!groupTargetUserId.trim()) {
      setErrorMsg('Vui lòng nhập mã người dùng cần thêm hoặc cập nhật vai trò.');
      return;
    }
    setLoadingAction(true);
    try {
      const res = await authService.assignGroupRole(
        projectId.trim(),
        groupId.trim(),
        groupTargetUserId.trim(),
        { role: groupRole }
      );
      setSuccessMsg(
        `Đã cập nhật thành viên vào nhóm với vai trò "${GROUP_ROLE_LABELS[res.role]}".`
      );
      await refreshProfile();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể cập nhật thành viên nhóm. Vui lòng kiểm tra lại quyền hạn hoặc thông tin.'
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRemoveGroupMember = async () => {
    clearFeedback();
    if (!groupTargetUserId.trim()) {
      setErrorMsg('Vui lòng nhập mã người dùng cần xóa khỏi nhóm.');
      return;
    }
    setLoadingAction(true);
    try {
      await authService.removeGroupMember(
        projectId.trim(),
        groupId.trim(),
        groupTargetUserId.trim()
      );
      setSuccessMsg('Đã xóa thành viên khỏi nhóm đồ án.');
      await refreshProfile();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể xóa thành viên khỏi nhóm.'
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAssignCourseMember = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!courseTargetUserId.trim()) {
      setErrorMsg('Vui lòng nhập mã người dùng cần phân vào lớp học.');
      return;
    }
    setLoadingAction(true);
    try {
      const res = await authService.assignCourseRole(
        courseId.trim(),
        courseTargetUserId.trim(),
        { role: courseRole }
      );
      setSuccessMsg(
        `Đã phân quyền người dùng vào lớp học với vai trò "${COURSE_ROLE_LABELS[res.role]}".`
      );
      await refreshProfile();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể thêm hoặc đổi vai trò trong lớp học.'
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRemoveCourseMember = async () => {
    clearFeedback();
    if (!courseTargetUserId.trim()) {
      setErrorMsg('Vui lòng nhập mã người dùng cần xóa khỏi lớp học.');
      return;
    }
    setLoadingAction(true);
    try {
      await authService.removeCourseMember(
        courseId.trim(),
        courseTargetUserId.trim()
      );
      setSuccessMsg('Đã xóa thành viên khỏi lớp học.');
      await refreshProfile();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể xóa thành viên khỏi lớp học.'
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateGlobalRole = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!systemTargetUserId.trim()) {
      setErrorMsg('Vui lòng nhập mã người dùng cần thay đổi vai trò.');
      return;
    }
    setLoadingAction(true);
    try {
      const res = await authService.updateUserGlobalRole(
        systemTargetUserId.trim(),
        {
          global_role: globalRole,
          is_active: isActiveAccount,
        }
      );
      setSuccessMsg(
        `Đã cập nhật vai trò hệ thống của "${res.display_name}" thành "${GLOBAL_ROLE_LABELS[res.global_role]}".`
      );
      await refreshProfile();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể cập nhật vai trò hệ thống.'
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const tabs: Array<{ id: ActiveSection; label: string; icon: React.ElementType }> = [
    { id: 'me', label: 'Hồ sơ & Nhóm của tôi', icon: UserCheck },
    { id: 'group', label: 'Thành viên nhóm đồ án', icon: Users },
    { id: 'course', label: 'Thành viên lớp học', icon: BookOpen },
    { id: 'system', label: 'Phân quyền hệ thống', icon: Shield },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar breadcrumbs={[{ label: 'Quản lý thành viên & Nhóm' }]} />

      <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Tiêu đề trang */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Quản lý thành viên & Nhóm đồ án
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Xem danh sách lớp và nhóm đang tham gia, thêm thành viên vào nhóm đồ án, lớp học và phân quyền tài khoản.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshMe}
            disabled={loadingAction}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Làm mới thông tin
          </Button>
        </div>

        {/* Thanh chuyển mục */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200/90 shadow-2xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  clearFeedback();
                  setActiveSection(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isActive
                  ? 'bg-[#0F5B46] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Thông báo kết quả / lỗi */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* MỤC 1: HỒ SƠ CÁ NHÂN, LỚP HỌC & NHÓM ĐANG THAM GIA */}
        {activeSection === 'me' && user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Thông tin cá nhân */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Thông tin tài khoản
                </h3>
                <Badge variant="success">
                  {GLOBAL_ROLE_LABELS[user.global_role] || 'Thành viên'}
                </Badge>
              </div>

              <div className="space-y-3 text-xs pt-1">
                <div>
                  <span className="text-gray-400 block text-[11px]">Họ và tên</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {user.display_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Địa chỉ email</span>
                  <span className="font-medium text-gray-800">{user.email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">
                    Mã người dùng của bạn
                  </span>
                  <div className="mt-1 flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                    <span className="font-mono text-[11px] text-gray-700 truncate">
                      {user.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(user.id);
                        setSuccessMsg('Đã sao chép mã người dùng của bạn.');
                      }}
                      className="text-[11px] font-semibold text-[#0F5B46] hover:underline shrink-0 cursor-pointer"
                    >
                      Sao chép
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Danh sách lớp học và nhóm đồ án đang tham gia */}
            <div className="lg:col-span-2 space-y-6">
              <Card padding="md" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Lớp học đang tham gia
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Các khóa học bạn đã được phân công hoặc đăng ký
                    </p>
                  </div>
                  <Badge variant="info">{user.course_memberships.length} lớp</Badge>
                </div>

                {user.course_memberships.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-gray-50 border border-dashed border-gray-200 text-xs text-gray-400">
                    Tài khoản của bạn hiện chưa tham gia lớp học nào.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {user.course_memberships.map((cm) => (
                      <div
                        key={cm.course_id}
                        className="p-3.5 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50"
                      >
                        <div>
                          <div className="text-xs font-bold text-gray-900">
                            {cm.course_code ? `${cm.course_code} · ` : ''}
                            {cm.course_name || 'Lớp học phần'}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {cm.term ? `Học kỳ ${cm.term} · ` : ''}
                            Vai trò: <b>{COURSE_ROLE_LABELS[cm.role] || cm.role}</b>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="info">
                            {COURSE_ROLE_LABELS[cm.role] || cm.role}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCourseId(cm.course_id);
                              setActiveSection('course');
                            }}
                          >
                            Quản lý lớp
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card padding="md" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Nhóm đồ án đang tham gia
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Danh sách các nhóm đồ án mà bạn là Nhóm trưởng hoặc Thành viên
                    </p>
                  </div>
                  <Badge variant="success">{user.group_memberships.length} nhóm</Badge>
                </div>

                {user.group_memberships.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-gray-50 border border-dashed border-gray-200 text-xs text-gray-400">
                    Bạn chưa tham gia nhóm đồ án nào.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {user.group_memberships.map((gm) => (
                      <div
                        key={gm.group_id}
                        className="p-3.5 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50"
                      >
                        <div>
                          <div className="text-xs font-bold text-gray-900">
                            {gm.group_name || 'Nhóm đồ án'}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Vai trò: <b>{GROUP_ROLE_LABELS[gm.role] || gm.role}</b>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={gm.role === 'leader' ? 'success' : 'neutral'}
                          >
                            {GROUP_ROLE_LABELS[gm.role] || gm.role}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProjectId(gm.project_id);
                              setGroupId(gm.group_id);
                              setActiveSection('group');
                            }}
                          >
                            Quản lý thành viên
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* MỤC 2: QUẢN LÝ THÀNH VIÊN NHÓM ĐỒ ÁN */}
        {activeSection === 'group' && (
          <Card padding="md" className="max-w-2xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Thêm thành viên hoặc đổi vai trò trong nhóm đồ án
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Dành cho Giảng viên, Trợ giảng, Quản trị viên hoặc Nhóm trưởng của nhóm để thêm sinh viên vào nhóm, chuyển quyền Nhóm trưởng hoặc xóa thành viên khỏi nhóm.
              </p>
            </div>

            {user && user.group_memberships.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Chọn nhanh từ nhóm của bạn
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.group_memberships.map((gm) => (
                    <button
                      key={gm.group_id}
                      type="button"
                      onClick={() => {
                        setProjectId(gm.project_id);
                        setGroupId(gm.group_id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${groupId === gm.group_id
                        ? 'bg-[#EBF8F2] border-[#0F5B46] text-[#0F5B46] font-semibold'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {gm.group_name || 'Nhóm đồ án'} ({GROUP_ROLE_LABELS[gm.role]})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleAssignGroupMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mã đề án
                  </label>
                  <input
                    type="text"
                    required
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="Nhập mã đề án..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mã nhóm đồ án
                  </label>
                  <input
                    type="text"
                    required
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    placeholder="Nhập mã nhóm..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mã người dùng (Sinh viên) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={groupTargetUserId}
                    onChange={(e) => setGroupTargetUserId(e.target.value)}
                    placeholder="Nhập mã người dùng cần thêm hoặc xóa..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Vai trò trong nhóm
                  </label>
                  <select
                    value={groupRole}
                    onChange={(e) => setGroupRole(e.target.value as GroupRole)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  >
                    <option value="member">Thành viên</option>
                    <option value="leader">Nhóm trưởng</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleRemoveGroupMember}
                  disabled={loadingAction}
                  icon={<UserMinus className="w-4 h-4" />}
                >
                  Xóa khỏi nhóm
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loadingAction}
                  icon={<UserPlus className="w-4 h-4" />}
                >
                  {loadingAction ? 'Đang xử lý...' : 'Lưu thành viên nhóm'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* MỤC 3: QUẢN LÝ THÀNH VIÊN LỚP HỌC */}
        {activeSection === 'course' && (
          <Card padding="md" className="max-w-2xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Quản lý thành viên trong khóa học
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Thêm Giảng viên, Trợ giảng, Giảng viên chấm bài hoặc Sinh viên vào lớp học phần, hoặc xóa thành viên khỏi lớp.
              </p>
            </div>

            {user && user.course_memberships.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Chọn nhanh từ lớp học của bạn
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.course_memberships.map((cm) => (
                    <button
                      key={cm.course_id}
                      type="button"
                      onClick={() => setCourseId(cm.course_id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${courseId === cm.course_id
                        ? 'bg-[#EBF8F2] border-[#0F5B46] text-[#0F5B46] font-semibold'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {cm.course_code || cm.course_name || 'Lớp học'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleAssignCourseMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mã khóa học / lớp học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="Nhập mã khóa học..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mã người dùng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={courseTargetUserId}
                    onChange={(e) => setCourseTargetUserId(e.target.value)}
                    placeholder="Nhập mã người dùng cần thêm hoặc xóa..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Vai trò trong lớp
                  </label>
                  <select
                    value={courseRole}
                    onChange={(e) => setCourseRole(e.target.value as CourseRole)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  >
                    <option value="student">Sinh viên</option>
                    <option value="ta">Trợ giảng</option>
                    <option value="reviewer">Giảng viên chấm bài</option>
                    <option value="instructor">Giảng viên phụ trách</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleRemoveCourseMember}
                  disabled={loadingAction}
                  icon={<UserMinus className="w-4 h-4" />}
                >
                  Xóa khỏi lớp học
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loadingAction}
                  icon={<UserPlus className="w-4 h-4" />}
                >
                  {loadingAction ? 'Đang xử lý...' : 'Lưu thành viên lớp học'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* MỤC 4: CẤP QUYỀN TOÀN HỆ THỐNG */}
        {activeSection === 'system' && (
          <Card padding="md" className="max-w-2xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Cấp quyền tài khoản trên toàn hệ thống
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Dành cho Quản trị viên để thay đổi vai trò chính của người dùng (Sinh viên, Giảng viên, Quản trị viên) hoặc kích hoạt / tạm khóa tài khoản.
              </p>
            </div>

            <form onSubmit={handleUpdateGlobalRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mã người dùng cần phân quyền <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={systemTargetUserId}
                  onChange={(e) => setSystemTargetUserId(e.target.value)}
                  placeholder="Nhập mã người dùng..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Vai trò hệ thống
                  </label>
                  <select
                    value={globalRole}
                    onChange={(e) => setGlobalRole(e.target.value as GlobalRole)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  >
                    <option value="student">Sinh viên</option>
                    <option value="instructor">Giảng viên</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="user">Người dùng cơ bản</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Trạng thái tài khoản
                  </label>
                  <select
                    value={isActiveAccount ? 'active' : 'inactive'}
                    onChange={(e) => setIsActiveAccount(e.target.value === 'active')}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Tạm khóa</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loadingAction}
                  icon={<Shield className="w-4 h-4" />}
                >
                  {loadingAction ? 'Đang cập nhật...' : 'Cập nhật quyền hệ thống'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

