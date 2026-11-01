'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordChecks = useMemo(() => {
    const minLength = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const matchesConfirm =
      password.length > 0 && password === confirmPassword;
    return {
      minLength,
      hasLetter,
      hasDigit,
      matchesConfirm,
      allValid: minLength && hasLetter && hasDigit && matchesConfirm,
    };
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedName = displayName.trim();
    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedName) {
      setError('Họ và tên không được để trống.');
      return;
    }
    if (!EMAIL_PATTERN.test(cleanedEmail)) {
      setError('Địa chỉ email không đúng định dạng (VD: ten@hcmut.edu.vn).');
      return;
    }
    if (!passwordChecks.minLength) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    if (!passwordChecks.hasLetter || !passwordChecks.hasDigit) {
      setError('Mật khẩu phải bao gồm ít nhất 1 chữ cái và 1 chữ số.');
      return;
    }
    if (!passwordChecks.matchesConfirm) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        email: cleanedEmail,
        display_name: cleanedName,
        password,
      });
      router.replace('/overview');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể đăng ký tài khoản. Vui lòng thử lại.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC]">
      {/* BÊN TRÁI: Panel Hướng dẫn Đăng ký */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-[#0F172A] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0F5B46] border border-emerald-400/30 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight leading-none text-white">
                UniSystem
              </h1>
              <span className="text-[11px] text-emerald-300 font-medium block mt-1">
                Hệ thống đánh giá đồ án
              </span>
            </div>
          </div>
        </div>

        {/* Nội dung giữa */}
        <div className="relative z-10 space-y-8 my-auto py-8 max-w-xl">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-200 text-xs font-medium">
              Dành cho Giảng viên & Sinh viên
            </span>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Tạo tài khoản mới để bắt đầu làm việc.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Chỉ mất vài giây để đăng ký tài khoản, tham gia lớp đồ án của bạn và theo dõi toàn bộ quá trình nộp bài cũng như kết quả đánh giá.
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                01
              </span>
              <div>
                <div className="text-xs font-semibold text-white">
                  Điền thông tin cá nhân
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Nhập họ tên hiển thị và địa chỉ email của bạn.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                02
              </span>
              <div>
                <div className="text-xs font-semibold text-white">
                  Nộp báo cáo & mã nguồn
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Tải lên tệp báo cáo PDF và gói mã nguồn ZIP của nhóm đồ án.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                03
              </span>
              <div>
                <div className="text-xs font-semibold text-white">
                  Theo dõi kết quả & nhận xét
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Xem điểm thành phần và các góp ý chi tiết từ giảng viên hướng dẫn.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chân trang bên trái */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Thông tin tài khoản được bảo mật an toàn.</span>
        </div>
      </div>

      {/* BÊN PHẢI: Form Đăng ký */}
      <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-6 sm:p-10 xl:p-14 bg-white overflow-y-auto">
        {/* Thanh trên cùng */}
        <div className="flex items-center justify-between">
          <Link
            href="/signin"
            className="px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-[#0F5B46] hover:bg-emerald-50 hover:border-[#BBF7D0] transition-colors"
          >
            ← Quay lại Đăng nhập
          </Link>

          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#0F5B46] flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-gray-900">UniSystem</span>
          </div>
        </div>

        {/* Nội dung Form chính */}
        <div className="max-w-md w-full mx-auto my-6 space-y-5">
          <div>
            <span className="inline-block text-xs font-semibold text-[#0F5B46] bg-[#EBF8F2] px-3 py-1 rounded-full mb-2.5">
              Tài khoản mới
            </span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Đăng ký tài khoản
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Điền thông tin bên dưới để tạo tài khoản và truy cập ngay vào hệ thống.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-200/90 space-y-4"
          >
            {/* Họ và tên */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="VD: Nguyễn Minh Anh"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Địa chỉ email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten.ho@hcmut.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    maxLength={128}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nhập lại mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                  />
                </div>
              </div>
            </div>

            {/* Điều kiện mật khẩu */}
            <div className="p-3 rounded-xl bg-white border border-gray-200/80 space-y-1.5">
              <div className="text-[11px] font-semibold text-gray-600">
                Yêu cầu mật khẩu:
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div
                  className={`flex items-center gap-1.5 ${passwordChecks.minLength
                    ? 'text-emerald-700 font-medium'
                    : 'text-gray-400'
                    }`}
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Từ 8 ký tự trở lên</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${passwordChecks.hasLetter
                    ? 'text-emerald-700 font-medium'
                    : 'text-gray-400'
                    }`}
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Có ít nhất 1 chữ cái</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${passwordChecks.hasDigit
                    ? 'text-emerald-700 font-medium'
                    : 'text-gray-400'
                    }`}
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Có ít nhất 1 chữ số</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${passwordChecks.matchesConfirm
                    ? 'text-emerald-700 font-medium'
                    : 'text-gray-400'
                    }`}
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Khớp mật khẩu nhập lại</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký & Vào hệ thống'}
            </Button>
          </form>
        </div>

        {/* Chân trang bên phải */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
          <Link
            href="/signin"
            className="text-[#0F5B46] hover:underline font-semibold"
          >
            ← Đã có tài khoản? Đăng nhập
          </Link>
          <span>UniSystem · HK261</span>
        </div>
      </div>
    </div>
  );
}
