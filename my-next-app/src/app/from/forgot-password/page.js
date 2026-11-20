
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  LockKeyhole,
  ArrowRight,
  Hammer,
  LoaderCircle,
} from "lucide-react";

import "../../Styles/forgot-password.css";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("من فضلك أدخل البريد الإلكتروني");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "حدث خطأ أثناء إرسال الطلب"
        );
      }

      toast.success(
        result.message || "تم إرسال تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني"
      );

      router.push("/from/login");
    } catch (error) {
      toast.error(error.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-page" dir="rtl">
      <div className="forgot-card">

        <div className="forgot-logo">
          <Hammer size={30} />
        </div>

        <h1>نسيت كلمة المرور؟</h1>

        <p className="forgot-description">
          لا تقلق، أدخل البريد الإلكتروني المرتبط بحسابك
          وسنساعدك على استعادة كلمة المرور.
        </p>

        <form onSubmit={handleSubmit} className="forgot-form">

          <label htmlFor="email">
            البريد الإلكتروني
          </label>

          <div className="forgot-input-wrapper">
            <Mail size={19} />

            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="forgot-submit"
          >
            {loading ? (
              <>
                <LoaderCircle className="forgot-spinner" size={19} />
                جاري الإرسال...
              </>
            ) : (
              <>
                إرسال رابط الاستعادة
                <LockKeyhole size={18} />
              </>
            )}
          </button>

        </form>

        <Link href="/from/login" className="forgot-back">
          <ArrowRight size={17} />
          العودة إلى تسجيل الدخول
        </Link>

        <div className="forgot-footer">
          نظام إدارة الورشة
        </div>

      </div>
    </main>
  );
}
