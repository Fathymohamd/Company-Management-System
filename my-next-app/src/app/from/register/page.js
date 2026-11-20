
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Hammer,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Store,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

import { toast } from "sonner";

import "../../Styles/register.css"

import { useDispatch , useSelector } from "react-redux";

import { RegisterPages } from "../../Lip/redux/RegisterPages/RegisterPage";

import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   
  const router = useRouter()
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    workshopName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.workshopName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("من فضلك املأ جميع البيانات");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }

    if (form.password.length < 8) {
      toast.error("كلمة المرور يجب ألا تقل عن 8 أحرف");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

  try {
    const result = await dispatch(RegisterPages(form));

    if (RegisterPages.fulfilled.match(result)) {
      toast.success("تم إنشاء الحساب بنجاح");
      setForm({
      name: "",
    workshopName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
      })

setTimeout(() => {
  router.push("/from/login")
}, 2000)
    } else {
      toast.error(result.payload || "فشل إنشاء الحساب");
    }
  } catch (error) {
    toast.error("حدث خطأ أثناء إنشاء الحساب");
  }

  };

  return (
    <main className="register-page" dir="rtl">
      <div className="register-container">

        <div className="register-side">
          <div className="register-side-content">
            <div className="register-brand">
              <div className="register-brand-icon">
                <Hammer size={30} />
              </div>
              <div>
                <h2>ورشة الخشب</h2>
                <span>نظام إدارة الورشة</span>
              </div>
            </div>

            <div className="register-welcome">
              <span className="register-tag">مرحباً بك في نظامنا</span>

              <h1>
                ابدأ إدارة ورشتك
                <br />
                بطريقة أكثر احترافية
              </h1>

              <p>
                نظم طلباتك وعملاءك وموظفيك ومخزونك من مكان واحد،
                وتابع أداء ورشتك بسهولة.
              </p>

              <div className="register-features">
                <div>
                  <span>✓</span>
                  إدارة الطلبات والعملاء
                </div>
                <div>
                  <span>✓</span>
                  متابعة المنتجات والمخزون
                </div>
                <div>
                  <span>✓</span>
                  تقارير ومتابعة المصروفات
                </div>
              </div>
            </div>

            <div className="register-side-footer">
              كل أدوات ورشتك في مكان واحد
            </div>
          </div>
        </div>

        <div className="register-form-section">
          <div className="register-form-wrapper">

            <div className="register-mobile-brand">
              <div className="register-brand-icon">
                <Hammer size={25} />
              </div>
              <h2>ورشة الخشب</h2>
            </div>

            <div className="register-heading">
              <span className="register-heading-icon">
                <UserPlus size={24} />
              </span>
              <h1>إنشاء حساب جديد</h1>
              <p>أدخل بياناتك لإنشاء حساب وإدارة ورشتك</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">

              <div className="register-input-group">
                <label htmlFor="name">اسم صاحب الورشة</label>
                <div className="register-input-wrapper">
                  <User size={19} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="أدخل اسمك بالكامل"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="register-input-group">
                <label htmlFor="workshopName">اسم الورشة</label>
                <div className="register-input-wrapper">
                  <Store size={19} />
                  <input
                    id="workshopName"
                    name="workshopName"
                    type="text"
                    placeholder="مثال: ورشة الأمل للأثاث"
                    value={form.workshopName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="register-input-group">
                <label htmlFor="email">البريد الإلكتروني</label>
                <div className="register-input-wrapper">
                  <Mail size={19} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="register-input-group">
                <label htmlFor="phone">رقم الهاتف</label>
                <div className="register-input-wrapper">
                  <Phone size={19} />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="register-input-group">
                <label htmlFor="password">كلمة المرور</label>
                <div className="register-input-wrapper">
                  <Lock size={19} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8 أحرف على الأقل"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="register-eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="إظهار كلمة المرور"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div className="register-input-group">
                <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                <div className="register-input-wrapper">
                  <Lock size={19} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="أعد كتابة كلمة المرور"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="register-eye-button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label="إظهار تأكيد كلمة المرور"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="register-submit">
                إنشاء الحساب
                <ArrowLeft size={19} />
              </button>

            </form>

            <div className="register-login-link">
              لديك حساب بالفعل؟
            <Link href="/from/login">تسجيل الدخول</Link>
            </div>

            <p className="register-terms">
              بإنشاء حساب، أنت توافق على شروط الاستخدام وسياسة الخصوصية.
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}
