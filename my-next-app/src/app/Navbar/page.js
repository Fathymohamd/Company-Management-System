"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Hammer,
  LayoutDashboard,
  ClipboardList,
  Users,
  UserRoundCog,
  Package,
  Trees,
  Wallet,
  ChartNoAxesCombined,
  Menu,
  X,
} from "lucide-react";

import "../Styles/Navbar.css";

const navLinks = [
  {
    title: "الرئيسية",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "الطلبات",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    title: "العملاء",
    href: "/customers",
    icon: Users,
  },
  {
    title: "الموظفين",
    href: "/employees",
    icon: UserRoundCog,
  },
  {
    title: "المنتجات",
    href: "/products",
    icon: Package,
  },
  {
    title: "الخامات",
    href: "/materials",
    icon: Trees,
  },
  {
    title: "المصروفات",
    href: "/expenses",
    icon: Wallet,
  },
  {
    title: "التقارير",
    href: "/reports",
    icon: ChartNoAxesCombined,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="main-navbar" dir="rtl">
      <div className="navbar-container">

        {/* Logo */}
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo">
            <Hammer size={25} />
          </div>

          <div className="navbar-brand-text">
            <h2>ورشة الخشب</h2>
            <span>نظام إدارة الورشة</span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${isActive ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}