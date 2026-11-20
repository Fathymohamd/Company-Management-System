import Link from "next/link";

import {
  Hammer,
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
  ShieldCheck,
  Mail,
  Phone,
  Heart,
  ArrowUpLeft,
  Globe,
  MessageCircle,
} from "lucide-react";

import "../Styles/Footer.css";

export default function Footer() {
  return (
    <footer className="main-footer" dir="rtl">
      <div className="footer-container">

        {/* Top Section */}
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Hammer size={25} />
            </div>

            <div>
              <h3>ورشة الخشب</h3>
              <span>نظام إدارة الورشة</span>
            </div>
          </div>

          <p className="footer-description">
            نظام متكامل لإدارة أعمال الورشة،
            وتنظيم الطلبات والعملاء والموظفين
            ومتابعة جميع تفاصيل العمل بسهولة.
          </p>

          <div className="footer-social">
            <span>تابعنا</span>

            <a href="#" aria-label="Website">
              <Globe size={18} />
            </a>

            <a href="#" aria-label="Contact">
              <MessageCircle size={18} />
            </a>
          </div>

        </div>

        {/* Middle Section */}
        <div className="footer-middle">

          <div className="footer-column">
            <h4>روابط النظام</h4>

            <Link href="/">
              <LayoutDashboard size={17} />
              لوحة التحكم
              <ArrowUpLeft size={14} className="footer-arrow" />
            </Link>

            <Link href="/orders">
              <ClipboardList size={17} />
              الطلبات
              <ArrowUpLeft size={14} className="footer-arrow" />
            </Link>

            <Link href="/customers">
              <Users size={17} />
              العملاء
              <ArrowUpLeft size={14} className="footer-arrow" />
            </Link>

            <Link href="/products">
              <Package size={17} />
              المنتجات
              <ArrowUpLeft size={14} className="footer-arrow" />
            </Link>
          </div>

          <div className="footer-column">
            <h4>معلومات النظام</h4>

            <div>
              <ShieldCheck size={17} />
              نظام إدارة الورشة
            </div>

            <div>
              <Package size={17} />
              إدارة المخزون والمنتجات
            </div>

            <div>
              <ClipboardList size={17} />
              متابعة الطلبات
            </div>

            <span className="footer-version">
              Version 1.0.0
            </span>
          </div>

          <div className="footer-column">
            <h4>الدعم والتواصل</h4>

            <div>
              <Mail size={17} />
              الدعم الفني
            </div>

            <div>
              <Phone size={17} />
              خدمة العملاء
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} ورشة الخشب.
            جميع الحقوق محفوظة.
          </p>

          <p className="footer-made">
            صُنع بكل <Heart size={15} fill="currentColor" />
          </p>

        </div>

      </div>
    </footer>
  );
}