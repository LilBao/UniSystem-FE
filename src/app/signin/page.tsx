'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  FileText,
  Code2,
  ListOrdered,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(cleanedEmail)) {
      setError('Địa chỉ email không đúng định dạng (VD: ten@hcmut.edu.vn).');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    try {
      setSubmitting(true);
      await login({
        email: cleanedEmail,
        password,
      });
      router.replace('/overview');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC]">
      {/* BÊN TRÁI: Form Đăng nhập */}
      <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-6 sm:p-10 xl:p-14 bg-white border-r border-gray-200/80 overflow-y-auto">
        {/* Thanh trên cùng */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F5B46] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-gray-900 block leading-none">
                UniSystem
              </span>
              <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                Hệ thống đánh giá đồ án
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-gray-500 hidden sm:inline">Chưa có tài khoản?</span>
            <Link
              href="/signup"
              className="px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 font-semibold text-[#0F5B46] hover:bg-emerald-50 hover:border-[#BBF7D0] transition-colors"
            >
              Đăng ký ngay →
            </Link>
          </div>
        </div>

        {/* Nội dung Form chính */}
        <div className="max-w-md w-full mx-auto my-8 space-y-6">
          <div>
            <span className="inline-block text-xs font-semibold text-[#0F5B46] bg-[#EBF8F2] px-3 py-1 rounded-full mb-3">
              Chào mừng quay trở lại
            </span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Đăng nhập hệ thống
            </h2>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Vui lòng đăng nhập bằng tài khoản của bạn để quản lý bài nộp và xem kết quả đánh giá.
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
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Địa chỉ email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten.ho@hcmut.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn..."
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B46]/20 focus:border-[#0F5B46]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Hiện hoặc ẩn mật khẩu"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#0F5B46] focus:ring-[#0F5B46]"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
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
              {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </div>

        {/* Chân trang */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
          <span>UniSystem · Khoa KH&KT Máy tính</span>
          <Link
            href="/signup"
            className="text-[#0F5B46] hover:underline font-semibold"
          >
            Tạo tài khoản mới →
          </Link>
        </div>
      </div>

      {/* BÊN PHẢI: Panel giới thiệu */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-[#0F5B46] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-emerald-100 border border-white/15">
            Đồ án chuyên ngành · HK261
          </span>
          <span className="text-xs text-emerald-200 font-medium">
            HCMUT
          </span>
        </div>

        <div className="relative z-10 space-y-6 my-auto py-8 max-w-xl">
          <div className="space-y-3">
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Quản lý và chấm điểm đồ án minh bạch, thuận tiện.
            </h2>
            <p className="text-sm text-emerald-100/85 leading-relaxed">
              Không gian làm việc chung giúp giảng viên và sinh viên theo dõi bài nộp, kiểm tra báo cáo, đối chiếu mã nguồn và tổng hợp kết quả đánh giá.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-white/10 border border-white/15 flex items-start gap-3">
              <FileText className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-white">
                  Rà soát báo cáo & tài liệu tham khảo
                </div>
                <div className="text-[11px] text-emerald-100/80 mt-0.5">
                  Kiểm tra nhanh các trích dẫn và nội dung trình bày trong báo cáo PDF.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/15 flex items-start gap-3">
              <Code2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-white">
                  Đối chiếu báo cáo với mã nguồn
                </div>
                <div className="text-[11px] text-emerald-100/80 mt-0.5">
                  So sánh các chức năng đã mô tả trong báo cáo với mã nguồn thực tế của nhóm.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/15 flex items-start gap-3">
              <ListOrdered className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-white">
                  Chấm điểm theo tiêu chí rõ ràng
                </div>
                <div className="text-[11px] text-emerald-100/80 mt-0.5">
                  Tổng hợp điểm theo từng mục và lưu lại nhận xét chi tiết của giảng viên.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center gap-2 text-xs text-emerald-100/85">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>Hỗ trợ giảng viên và sinh viên trong suốt học kỳ.</span>
        </div>
      </div>
    </div>
  );
}
