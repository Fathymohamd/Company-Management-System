
"use client";

import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  FaChartLine,
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
  FaDownload,
  FaSearch,
  FaCalendarAlt,
  FaFileAlt,
  FaArrowUp,
  FaBox,
} from "react-icons/fa";

import "../Styles/ReportsPage.css";

import {
  createReport,
  fetchReports,
} from "../Lip/redux/reports/reportsThunk";

const money = (value) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function ReportsPage() {
  const dispatch = useDispatch();

  // Redux State
  const reports = useSelector(
    (state) => state.reports.reports
  );

  const loading = useSelector(
    (state) => state.reports.loading
  );

  const saving = useSelector(
    (state) => state.reports.saving
  );

  const error = useSelector(
    (state) => state.reports.error
  );

  // Local State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [period, setPeriod] = useState("الكل");
  const [showForm, setShowForm] = useState(false);

  const [newReport, setNewReport] = useState({
    title: "",
    category: "المبيعات",
    description: "",
  });

  // Fetch Reports from Backend
  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  // Search and Filter Reports
  const filteredReports = useMemo(() => {
    const today = new Date();

    return reports.filter((report) => {
      const matchesSearch =
        (report.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (report.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (report.category || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "الكل" || report.category === category;

      const reportDate = report.date
        ? new Date(`${report.date}T12:00:00`)
        : null;

      const days = reportDate
        ? (today - reportDate) / (1000 * 60 * 60 * 24)
        : -1;

      const matchesPeriod =
        period === "الكل" ||
        (period === "7 أيام" && days >= 0 && days <= 7) ||
        (period === "30 يومًا" && days >= 0 && days <= 30);

      return matchesSearch && matchesCategory && matchesPeriod;
    });
  }, [reports, search, category, period]);


  const totalSales = reports
    .filter(
      (report) =>
        String(report.id).startsWith("order-") &&
        report.status === "مكتمل"
    )
    .reduce((sum, report) => sum + Number(report.amount || 0), 0);


  const totalExpenses = reports
    .filter((report) =>
      String(report.id).startsWith("expense-")
    )
    .reduce((sum, report) => sum + Number(report.amount || 0), 0);

 
  const totalProfit = totalSales - totalExpenses;


  const monthlyPerformance = useMemo(() => {
    const now = new Date();

    const months = Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      );

      return {
        key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
        month: new Intl.DateTimeFormat("ar-EG", {
          month: "short",
        }).format(monthDate),
        sales: 0,
        expenses: 0,
      };
    });

    const monthsByKey = new Map(
      months.map((month) => [month.key, month])
    );

    reports.forEach((report) => {
      if (!report.date) return;

      const date = new Date(`${report.date}T12:00:00`);

      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const month = monthsByKey.get(key);

      if (!month) return;

      if (
        String(report.id).startsWith("order-") &&
        report.status === "مكتمل"
      ) {
        month.sales += Number(report.amount || 0);
      }

      if (String(report.id).startsWith("expense-")) {
        month.expenses += Number(report.amount || 0);
      }
    });

    const maxAmount = Math.max(
      1,
      ...months.flatMap((month) => [
        month.sales,
        month.expenses,
      ])
    );

    return months.map((month) => ({
      ...month,
      salesHeight: (month.sales / maxAmount) * 95,
      expensesHeight: (month.expenses / maxAmount) * 95,
    }));
  }, [reports]);

  // Add New Report
  const handleAddReport = async (e) => {
    e.preventDefault();

    const report = {
      title: newReport.title.trim(),
      category: newReport.category,
      description: newReport.description.trim(),
      report_date: new Date().toISOString().slice(0, 10),
      amount: 0,
      status: "قيد المراجعة",
    };

    if (!report.title) return;

    const result = await dispatch(createReport(report));

    if (createReport.fulfilled.match(result)) {
      setNewReport({
        title: "",
        category: "المبيعات",
        description: "",
      });

      setShowForm(false);
    }
  };

  // Export Reports to CSV
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
        row
          .map((value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
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

      {/* Header */}
      <header className="reports-header">
        <div>
          <Link href="/">
            <span className="reports-eyebrow">
              لوحة التحكم / التقارير
            </span>
          </Link>

          <h1>التقارير والتحليلات</h1>

          <p>
            تابع أداء نشاطك التجاري من خلال التقارير والإحصائيات.
          </p>
        </div>

        <button
          className="reports-primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <FaFileAlt />
          إنشاء تقرير
        </button>
      </header>

      {/* Statistics */}
      <section className="reports-stats">

        <article className="report-stat-card">
          <div className="report-stat-icon sales-icon">
            <FaMoneyBillWave />
          </div>

          <div>
            <p>إجمالي الإيرادات</p>
            <h2>{money(totalSales)}</h2>
            <span className="report-positive">
              <FaArrowUp /> الطلبات المكتملة
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
            <span className="report-stat-note">
              المصروفات المسجلة
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
            <span className="report-stat-note">
              الإيرادات - المصروفات
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
            <span className="report-stat-note">
              إجمالي التقارير المسجلة
            </span>
          </div>
        </article>

      </section>

      {/* Chart */}
      <section className="reports-chart-grid">

        <article className="reports-panel reports-chart-panel">
          <div className="reports-panel-heading">
            <div>
              <h2>ملخص الأداء المالي</h2>
              <p>مقارنة الإيرادات والمصروفات</p>
            </div>

            <FaChartLine className="reports-heading-icon" />
          </div>

          <div className="reports-bars">
            {monthlyPerformance.map((item) => (
              <div
                className="reports-bar-group"
                key={item.key}
              >
                <div className="reports-bar-pair">

                  <div
                    className="reports-bar reports-bar-sales"
                    style={{
                      height: `${item.salesHeight}%`,
                    }}
                    title={`الإيرادات ${money(item.sales)}`}
                  />

                  <div
                    className="reports-bar reports-bar-expenses"
                    style={{
                      height: `${item.expensesHeight}%`,
                    }}
                    title={`المصروفات ${money(item.expenses)}`}
                  />

                </div>

                <span>{item.month}</span>
              </div>
            ))}
          </div>

          <div className="reports-legend">
            <span>
              <i className="legend-sales" />
              الإيرادات
            </span>

            <span>
              <i className="legend-expenses" />
              المصروفات
            </span>
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
            { label: "إيرادات", color: "summary-blue" },
            { label: "مصروفات", color: "summary-orange" },
            { label: "أرباح", color: "summary-blue" },
            { label: "طلبات", color: "summary-orange" },
          ].map((item) => (
            <div
              className="reports-summary-row"
              key={item.label}
            >
              <span
                className={`reports-summary-dot ${item.color}`}
              />

              <span className="reports-summary-label">
                {item.label}
              </span>

              <strong>
                {
                  reports.filter(
                    (report) => report.category === item.label
                  ).length
                }{" "}
                تقرير
              </strong>
            </div>
          ))}

          <div className="reports-summary-footer">
            <span>إجمالي التقارير</span>
            <strong>{reports.length}</strong>
          </div>
        </article>

      </section>

      {/* Add Report Form */}
      {showForm && (
        <section className="reports-panel reports-form-panel">

          <h2>إنشاء تقرير جديد</h2>

          <form onSubmit={handleAddReport}>
            <div className="reports-form-grid">

              <label>
                اسم التقرير

                <input
                  required
                  value={newReport.title}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      title: e.target.value,
                    })
                  }
                  placeholder="اكتب اسم التقرير"
                />
              </label>

              <label>
                تصنيف التقرير

                <select
                  value={newReport.category}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="المبيعات">المبيعات</option>
                  <option value="المصروفات">المصروفات</option>
                  <option value="إيرادات">إيرادات</option>
                  <option value="العملاء">العملاء</option>
                  <option value="المنتجات">المنتجات</option>
                  <option value="الأرباح">الأرباح</option>
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
              <button
                type="submit"
                className="reports-primary-btn"
                disabled={saving}
              >
                {saving ? "جاري الحفظ..." : "حفظ التقرير"}
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

      {/* Reports Table */}
      <section className="reports-panel reports-table-panel">

        <div className="reports-panel-heading reports-table-heading">
          <div>
            <h2>قائمة التقارير</h2>
            <p>
              ابحث عن التقارير وفلتر النتائج حسب التصنيف والفترة.
            </p>
          </div>

          <button
            className="reports-export-btn"
            onClick={exportCSV}
          >
            <FaDownload />
            تصدير CSV
          </button>
        </div>

        {/* Search and Filters */}
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
              <option value="إيرادات">إيرادات</option>
              <option value="مصروفات">مصروفات</option>
              <option value="أرباح">أرباح</option>
              <option value="طلبات">طلبات</option>
              <option value="مخزون">مخزون</option>
              <option value="موظفين">موظفين</option>
              <option value="المبيعات">المبيعات</option>
              <option value="العملاء">العملاء</option>
              <option value="المنتجات">المنتجات</option>
            </select>
          </div>

          <div className="reports-filter-select">
            <FaCalendarAlt />

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="الكل">كل الفترات</option>
              <option value="7 أيام">آخر 7 أيام</option>
              <option value="30 يومًا">آخر 30 يومًا</option>
            </select>
          </div>

        </div>

        {/* Table */}
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

              {loading && (
                <tr>
                  <td colSpan="5" className="reports-empty">
                    جاري تحميل التقارير...
                  </td>
                </tr>
              )}

              {error && !loading && (
                <tr>
                  <td
                    colSpan="5"
                    className="reports-empty"
                    role="alert"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                filteredReports.map((report) => (
                  <tr key={report.id}>

                    <td>
                      <div className="reports-name-cell">
                        <span className="reports-file-icon">
                          <FaFileAlt />
                        </span>

                        <div>
                          <strong>{report.title}</strong>
                          <small>{report.description}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="reports-category">
                        {report.category}
                      </span>
                    </td>

                    <td>{report.date}</td>

                    <td className="reports-amount">
                      {money(report.amount)}
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

              {!loading &&
                !error &&
                filteredReports.length === 0 && (
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
