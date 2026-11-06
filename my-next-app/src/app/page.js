
"use client"

import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserRoundCog,
  Armchair,
  Trees,
  Wallet,
  ChartNoAxesCombined,
    Clock,
} from "lucide-react";


import { useEffect, useState } from "react";
import Link from "next/link";
import "./Styles/dashboard.css";

import {fetchOrders} from './Lip/redux/orders/page'

import { useSelector , useDispatch } from "react-redux";

import { fetchEmployees  } from "./Lip/redux/employeesApi/page";

import { orderSearch } from "./Lip/redux/searchRedux/page";

const navigation = [
  { label: "لوحة التحكم", icon: LayoutDashboard, href: "/" },
  { label: "الطلبات", icon: ClipboardList, href: "/orders" },
  { label: "العملاء", icon: Users, href: "/customers" },
  { label: "العمال", icon: UserRoundCog, href: "/employees" },
  { label: "المنتجات", icon: Armchair, href: "/products" },
  { label: "الخامات والمخزون", icon: Trees, href: "/materials" },
  { label: "المصروفات", icon: Wallet, href: "/expenses" },
  { label: "التقارير", icon: ChartNoAxesCombined, href: "/reports"},
];

export default function Home() {
   const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.order.data)
  
  const Employees = useSelector(
    (state) => state.employees.data ?? []
  );
 console.log(Employees)
    const order = useSelector(
    (state) => state.search.order ?? []
  );

  const [active, setActive] = useState("/");


const totalPrice = orders.reduce(
  (total, order) => total + Number(order.price),
  0
);

const activeOrders = orders.filter(
  (order) => order.status === "قيد التنفيذ"
).length;

  const Employeesorders = Employees.filter((item) => item.status === "نشط").length


  useEffect(()=> {
    dispatch(fetchOrders())
    dispatch(fetchEmployees())
  } , [])


  const stats = [
    {
      title: "إجمالي الطلبات",
      value: orders.length,
      icon: ClipboardList,
      color: "blue",
      change: "من قاعدة البيانات",
    },
    {
      title: "الموظفون النشطون",
       value: Employeesorders, 
      icon: Users,
      color: "green",
      change: "من قاعدة البيانات",
    },
    {
      title: "إيرادات الشهر",
      value: `${totalPrice.toLocaleString("en-US")} ج.م`,
      icon: Wallet,
      color: "orange",
      change: "الطلبات المكتملة",
    },
    {
      title: "طلبات قيد التنفيذ",
      value: activeOrders,
      icon: Clock,
      color: "purple",
      change: "طلبات جارية",
    },
  ];

const handleSearch = (e) => {
  const value = e.target.value;

  setSearchTerm(value);

  if (value.trim() !== "") {
    dispatch(orderSearch(value.trim()));
  }
};

  const displayedEmployees = searchTerm.trim()
    ? order
    : orders;

    
  return (
    <div className="dashboard" dir="rtl">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🪵</div>
          <div>
            <h2>ورشة الخشب</h2>
            <span>نظام إدارة الورشة</span>
          </div>
        </div>

        <p className="menu-label">القائمة الرئيسية</p>


<nav className="navigation">
  {navigation.map((item) => {
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        key={item.href}
        className={`nav-item ${
          active === item.href ? "active" : ""
        }`}
        onClick={() => setActive(item.href)}
      >
        <span className="nav-icon">
          <Icon size={20} strokeWidth={1.8} />
        </span>

        <span>{item.label}</span>

        {active === item.href && (
          <span className="active-dot" />
        )}
      </Link>
    );
  })}
</nav>


        <div className="sidebar-bottom">
          <div className="user-avatar">م</div>
          <div className="user-info">
            <strong>مدير الورشة</strong>
            <span>المسؤول الرئيسي</span>
          </div>
          <span className="user-menu">⋯</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">الرئيسية / لوحة التحكم</p>
            <h1>لوحة التحكم</h1>
          </div>
          <div className="topbar-actions">
            <span className="today">📅 17 أكتوبر 2026</span>
            <button className="notification" aria-label="الإشعارات">
              ♧<span />
            </button>
            <div className="user-avatar top-avatar">م</div>
          </div>
        </header>

        <section className="welcome-banner">
          <div>
            <span className="welcome-label">لوحة إدارة الورشة</span>
            <h2>أهلاً بك في ورشتك 👋</h2>
            <p>تابع طلبات العملاء والإنتاج والمخزون من مكان واحد.</p>
          </div>
          <div className="banner-art">🪚</div>
        </section>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.title}>
              <div className={`stat-icon ${stat.color}`}>
  <stat.icon size={24} />
</div>
              <span className="stat-title">{stat.title}</span>
              <h3>{stat.value}</h3>
              <span className="stat-change">{stat.change}</span>
            </article>
          ))}
        </section>

        <section className="orders-section">
          <div className="section-heading">
            <div>
              <h2>أحدث الطلبات</h2>
              <p>تابع حالة طلبات العملاء في الورشة</p>
            </div>
            <Link href="/orders" className="view-all">
              عرض كل الطلبات ←
            </Link>
          </div>

          <div className="table-toolbar">
            <input
              type="search"
              placeholder="ابحث عن طلب أو عميل..."
             value={searchTerm}
            onChange={handleSearch}
              aria-label="البحث في الطلبات"
            />
            <button className="filter-button" onClick={() => setSearchTerm("")}>
              ↻ إعادة ضبط
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>العميل</th>
                  <th>المنتج</th>
                  <th>تاريخ الطلب</th>
                  <th>السعر</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.product_name}</td>
                    <td>{order.order_date}</td>
                    <td className="price">{order.price}</td>
                    <td>
                      <span
                        className={`status ${
                          order.status === "مكتمل"
                            ? "completed"
                            : order.status === "معلق"
                              ? "pending"
                              : "progress"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {displayedEmployees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      لا توجد طلبات مطابقة للبحث.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
   
        </section>
      </main>
    </div>
  );
}