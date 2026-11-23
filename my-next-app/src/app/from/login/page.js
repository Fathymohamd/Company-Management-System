
"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import {
  Hammer,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
} from "lucide-react";

import { toast } from "sonner";

import "../../Styles/login.css";

import { useDispatch , useSelector } from "react-redux";

import {LoginPages} from "../../Lip/redux/LoginPages/LoginPages"

export default function Login() {
  const router = useRouter();
  
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email.trim()) {
    toast.error("من فضلك أدخل البريد الإلكتروني");
    return;
  }

  if (!formData.password.trim()) {
    toast.error("من فضلك أدخل كلمة المرور");
    return;
  }

  try {
    const result = await dispatch(LoginPages(formData)).unwrap();
    
toast.success("تم تسجيل الدخول بنجاح");

    setFormData({
      email: "",
      password: "",
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

  } catch (error) {
    console.error("Login Error:", error);
    toast.error(
      typeof error === "string"
        ? error
        : "حدث خطأ أثناء تسجيل الدخول"
    );
  }
};



  return (
    <main className="login-page" dir="rtl">

      <section className="login-container">

        {/* الجانب التعريفي */}
        <div className="login-brand">

          <div className="login-brand-logo">
            <Hammer size={35} />
          </div>

          <h1>ورشة الخشب</h1>

          <p className="login-brand-description">
            نظام متكامل لإدارة الورشة وتنظيم أعمالك
            ومتابعة الطلبات والمصروفات والمخزون بسهولة.
          </p>

          <div className="login-features">
            <div>
              <span>✓</span>
              إدارة الطلبات والعملاء
            </div>

            <div>
              <span>✓</span>
              متابعة المنتجات والخامات
            </div>

            <div>
              <span>✓</span>
              متابعة المصروفات والتقارير
            </div>
          </div>

          <div className="login-brand-footer">
            كل أعمال ورشتك في مكان واحد
          </div>

        </div>

        {/* نموذج تسجيل الدخول */}
        <div className="login-form-section">

          <div className="login-mobile-logo">
            <Hammer size={30} />
            <span>ورشة الخشب</span>
          </div>

          <div className="login-heading">
            <h2>مرحباً بعودتك 👋</h2>
            <p>سجل دخولك للوصول إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            <div className="login-input-group">
              <label htmlFor="email">البريد الإلكتروني</label>

              <div className="login-input-wrapper">
                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="أدخل البريد الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label htmlFor="password">كلمة المرور</label>

              <div className="login-input-wrapper">
                <Lock size={19} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <div className="login-forgot">
              <Link href="/from/forgot-password">
                هل نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                "جاري تسجيل الدخول..."
              ) : (
                <>
                  <LogIn size={20} />
                  تسجيل الدخول
                  <ArrowLeft size={18} />
                </>
              )}
            </button>

          </form>

          <div className="login-register">
            ليس لديك حساب؟
            <Link href="/from/register"> إنشاء حساب جديد</Link>
          </div>

          <p className="login-copyright">
            © 2026 ورشة الخشب - جميع الحقوق محفوظة
          </p>

        </div>

      </section>

    </main>
  );
}
