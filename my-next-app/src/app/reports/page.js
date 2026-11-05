"use client";

import { useMemo, useState } from "react";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
  FaBox,
  FaDownload,
  FaSearch,
  FaCalendarAlt,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import "../Styles/ReportsPage.css";
import Link from "next/link"
const initialReports = [
  {
    id: 1,
    title: "تقرير المبيعات",
    category: "المبيعات",
    date: "2026-10-18",
    amount: 45000,
    status: "مكتمل",
    description: "ملخص إجمالي المبيعات والطلبات",
  },
  {
    id: 2,
    title: "تقرير المصروفات",
    category: "المصروفات",
    date: "2026-10-17",
    amount: 12500,
    status: "مكتمل",
    description: "تفاصيل المصروفات والمدفوعات",
  },
  {
    id: 3,
    title: "تقرير العملاء",
    category: "العملاء",
    date: "2026-10-16",
    amount: 320,
    status: "مكتمل",
    description: "إحصائيات العملاء الجدد والحاليين",
  },
  {
    id: 4,
    title: "تقرير المنتجات",
    category: "المنتجات",
    date: "2026-10-15",
    amount: 185,
    status: "قيد المراجعة",
    description: "حالة المنتجات والمخزون المتاح",
  },
  {
    id: 5,
    title: "تقرير الأرباح",
    category: "الأرباح",
    date: "2026-10-14",
    amount: 32500,
    status: "مكتمل",
    description: "صافي الأرباح ومقارنة الإيرادات",
  },
];

const money = (value) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [period, setPeriod] = useState("الكل");
  const [showForm, setShowForm] = useState(false);
  const [newReport, setNewReport] = useState({
    title: "",
    category: "المبيعات",
    description: "",
  });

  const filteredReports = useMemo(() => {
    const today = new Date("2026-10-20T12:00:00");
    return reports.filter((report) => {
      const matchesSearch =
        report.title.includes(search) ||
        report.description.includes(search) ||
        report.category.includes(search);

      const matchesCategory =
        category === "الكل" || report.category === category;

      const reportDate = new Date(`${report.date}T12:00:00`);
      const days = (today - reportDate) / (1000 * 60 * 60 * 24);
      const matchesPeriod =
        period === "الكل" ||
        (period === "7 أيام" && days <= 7 && days >= 0) ||
        (period === "30 يومًا" && days <= 30 && days >= 0);

      return matchesSearch && matchesCategory && matchesPeriod;
    });
  }, [reports, search, category, period]);

  const totalSales = 125000;
  const totalExpenses = 42500;
  const totalProfit = totalSales - totalExpenses;

  const addReport = (e) => {
    e.preventDefault();

    const report = {
      id: Date.now(),
      title: newReport.title.trim(),
      category: newReport.category,
      description: newReport.description.trim(),
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      status: "قيد المراجعة",
    };

    if (!report.title) return;

    setReports((previous) => [report, ...previous]);
    setNewReport({
      title: "",
      category: "المبيعات",
      description: "",
    });
    setShowForm(false);
  };

  const exportCSV = () => {
    const headers = [
      "اسم التقرير",
      "التصنيف",
      "التاريخ",
      "القيمة",
      "الحالة",
      "الوصف",
    ];

    const rows = filteredReports.map((report) => [
      report.title,
      report.category,
      report.date,
      report.amount,
      report.status,
      report.description,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="reports-page" dir="rtl">
      <header className="reports-header">
        <div>
    
          <Link href="/"> <span className="reports-eyebrow">لوحة التحكم / التقارير</span></Link>
          <h1>التقارير والتحليلات</h1>
          <p>تابع أداء نشاطك التجاري من خلال التقارير والإحصائيات.</p>
        </div>

        <button
          className="reports-primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <FaFileAlt />
          إنشاء تقرير
        </button>
      </header>

      <section className="reports-stats">
        <article className="report-stat-card">
          <div className="report-stat-icon sales-icon">
            <FaMoneyBillWave />
          </div>
          <div>
            <p>إجمالي الإيرادات</p>
            <h2>{money(totalSales)}</h2>
            <span className="report-positive">
              <FaArrowUp /> 12.5% مقارنة بالفترة السابقة
            </span>
          </div>
        </article>

        <article className="report-stat-card">
          <div className="report-stat-icon expenses-icon">
            <FaShoppingCart />
          </div>
          <div>
            <p>إجمالي المصروفات</p>
            <h2>{money(totalExpenses)}</h2>
            <span className="report-negative">
              <FaArrowDown /> 4.2% مقارنة بالفترة السابقة
            </span>
          </div>
        </article>

        <article className="report-stat-card">
          <div className="report-stat-icon profit-icon">
            <FaChartLine />
          </div>
          <div>
            <p>صافي الأرباح</p>
            <h2>{money(totalProfit)}</h2>
            <span className="report-positive">
              <FaArrowUp /> 8.3% مقارنة بالفترة السابقة
            </span>
          </div>
        </article>

        <article className="report-stat-card">
          <div className="report-stat-icon customers-icon">
            <FaUsers />
          </div>
          <div>
            <p>عدد التقارير</p>
            <h2>{reports.length}</h2>
            <span className="report-stat-note">إجمالي التقارير المسجلة</span>
          </div>
        </article>
      </section>

      <section className="reports-chart-grid">
        <article className="reports-panel reports-chart-panel">
          <div className="reports-panel-heading">
            <div>
              <h2>ملخص الأداء المالي</h2>
              <p>مقارنة الإيرادات والمصروفات والأرباح</p>
            </div>
            <FaChartLine className="reports-heading-icon" />
          </div>

          <div className="reports-bars">
            {[
              { month: "مايو", sales: 65, expenses: 35 },
              { month: "يونيو", sales: 78, expenses: 42 },
              { month: "يوليو", sales: 58, expenses: 30 },
              { month: "أغسطس", sales: 88, expenses: 48 },
              { month: "سبتمبر", sales: 72, expenses: 38 },
              { month: "أكتوبر", sales: 95, expenses: 45 },
            ].map((item) => (
              <div className="reports-bar-group" key={item.month}>
                <div className="reports-bar-pair">
                  <div
                    className="reports-bar reports-bar-sales"
                    style={{ height: `${item.sales}%` }}
                    title={`الإيرادات ${item.sales}`}
                  />
                  <div
                    className="reports-bar reports-bar-expenses"
                    style={{ height: `${item.expenses}%` }}
                    title={`المصروفات ${item.expenses}`}
                  />
                </div>
                <span>{item.month}</span>
              </div>
            ))}
          </div>

          <div className="reports-legend">
            <span><i className="legend-sales" /> الإيرادات</span>
            <span><i className="legend-expenses" /> المصروفات</span>
          </div>
        </article>

        <article className="reports-panel reports-summary-panel">
          <div className="reports-panel-heading">
            <div>
              <h2>ملخص التقارير</h2>
              <p>نظرة عامة على التقارير المسجلة</p>
            </div>
            <FaBox className="reports-heading-icon" />
          </div>

          {[
            { label: "المبيعات", count: reports.filter((r) => r.category === "المبيعات").length, color: "summary-blue" },
            { label: "المصروفات", count: reports.filter((r) => r.category === "المصروفات").length, color: "summary-orange" },
            { label: "العملاء", count: reports.filter((r) => r.category === "العملاء").length, color: "summary-purple" },
            { label: "المنتجات", count: reports.filter((r) => r.category === "المنتجات").length, color: "summary-green" },
          ].map((item) => (
            <div className="reports-summary-row" key={item.label}>
              <span className={`reports-summary-dot ${item.color}`} />
              <span className="reports-summary-label">{item.label}</span>
              <strong>{item.count} تقرير</strong>
            </div>
          ))}

          <div className="reports-summary-footer">
            <span>إجمالي التقارير</span>
            <strong>{reports.length}</strong>
          </div>
        </article>
      </section>

      {showForm && (
        <section className="reports-panel reports-form-panel">
          <h2>إنشاء تقرير جديد</h2>
          <form onSubmit={addReport}>
            <div className="reports-form-grid">
              <label>
                اسم التقرير
                <input
                  required
                  value={newReport.title}
                  onChange={(e) =>
                    setNewReport({ ...newReport, title: e.target.value })
                  }
                  placeholder="اكتب اسم التقرير"
                />
              </label>

              <label>
                تصنيف التقرير
                <select
                  value={newReport.category}
                  onChange={(e) =>
                    setNewReport({ ...newReport, category: e.target.value })
                  }
                >
                  <option>المبيعات</option>
                  <option>المصروفات</option>
                  <option>العملاء</option>
                  <option>المنتجات</option>
                  <option>الأرباح</option>
                </select>
              </label>

              <label className="reports-description-field">
                وصف التقرير
                <input
                  value={newReport.description}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      description: e.target.value,
                    })
                  }
                  placeholder="اكتب وصفًا مختصرًا"
                />
              </label>
            </div>

            <div className="reports-form-actions">
              <button type="submit" className="reports-primary-btn">
                حفظ التقرير
              </button>
              <button
                type="button"
                className="reports-secondary-btn"
                onClick={() => setShowForm(false)}
              >
                إلغاء
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="reports-panel reports-table-panel">
        <div className="reports-panel-heading reports-table-heading">
          <div>
            <h2>قائمة التقارير</h2>
            <p>ابحث عن التقارير وفلتر النتائج حسب التصنيف والفترة.</p>
          </div>
          <button className="reports-export-btn" onClick={exportCSV}>
            <FaDownload />
            تصدير CSV
          </button>
        </div>

        <div className="reports-filters">
          <div className="reports-search">
            <FaSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن تقرير..."
            />
          </div>

          <div className="reports-filter-select">
            <FaFileAlt />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="الكل">كل التصنيفات</option>
              <option value="المبيعات">المبيعات</option>
              <option value="المصروفات">المصروفات</option>
              <option value="العملاء">العملاء</option>
              <option value="المنتجات">المنتجات</option>
              <option value="الأرباح">الأرباح</option>
            </select>
          </div>

          <div className="reports-filter-select">
            <FaCalendarAlt />
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="الكل">كل الفترات</option>
              <option value="7 أيام">آخر 7 أيام</option>
              <option value="30 يومًا">آخر 30 يومًا</option>
            </select>
          </div>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>اسم التقرير</th>
                <th>التصنيف</th>
                <th>تاريخ الإنشاء</th>
                <th>القيمة</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="reports-name-cell">
                      <span className="reports-file-icon"><FaFileAlt /></span>
                      <div>
                        <strong>{report.title}</strong>
                        <small>{report.description}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="reports-category">{report.category}</span>
                  </td>
                  <td>{report.date}</td>
                  <td className="reports-amount">
                    {report.amount ? money(report.amount) : "—"}
                  </td>
                  <td>
                    <span
                      className={`reports-status ${
                        report.status === "مكتمل"
                          ? "reports-status-complete"
                          : "reports-status-pending"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="5" className="reports-empty">
                    لا توجد تقارير مطابقة لبحثك.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="reports-table-footer">
          <span>عدد النتائج: {filteredReports.length}</span>
          <span>يتم عرض التقارير المطابقة للفلاتر المحددة</span>
        </div>
      </section>
    </main>
  );
}