
"use client";

import { useState } from "react";
import {
  FaMoneyBillWave,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaWallet,
  FaChartLine,
  FaReceipt,
} from "react-icons/fa";
import Link from "next/link"
import "../Styles/Expenses.css";

const initialExpenses = [
  {
    id: 1,
    title: "إيجار المكتب",
    category: "الإيجار",
    amount: 12000,
    date: "2026-10-05",
    payment: "تحويل بنكي",
    status: "مدفوع",
  },
  {
    id: 2,
    title: "فاتورة الكهرباء",
    category: "المرافق",
    amount: 1800,
    date: "2026-10-08",
    payment: "نقدًا",
    status: "مدفوع",
  },
  {
    id: 3,
    title: "مستلزمات المكتب",
    category: "المستلزمات",
    amount: 950,
    date: "2026-10-12",
    payment: "بطاقة ائتمان",
    status: "معلق",
  },
  {
    id: 4,
    title: "اشتراك الإنترنت",
    category: "المرافق",
    amount: 650,
    date: "2026-10-15",
    payment: "تحويل بنكي",
    status: "مدفوع",
  },
];

const categories = [
  "الإيجار",
  "المرافق",
  "المستلزمات",
  "الرواتب",
  "التسويق",
  "المواصلات",
  "الصيانة",
  "أخرى",
];

const paymentMethods = [
  "نقدًا",
  "تحويل بنكي",
  "بطاقة ائتمان",
  "محفظة إلكترونية",
];

function Expenses() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "أخرى",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    payment: "نقدًا",
    status: "معلق",
  });

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const paidExpenses = expenses
    .filter((expense) => expense.status === "مدفوع")
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const pendingExpenses = expenses
    .filter((expense) => expense.status === "معلق")
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const filteredExpenses = expenses.filter((expense) =>
    `${expense.title} ${expense.category} ${expense.payment}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatMoney = (amount) =>
    new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 2,
    }).format(amount);

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      category: "أخرى",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      payment: "نقدًا",
      status: "معلق",
    });
    setShowForm(true);
  };

  const openEditForm = (expense) => {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      payment: expense.payment,
      status: expense.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || Number(form.amount) <= 0) {
      alert("من فضلك أدخل اسم المصروف ومبلغًا صحيحًا.");
      return;
    }

    if (editingId !== null) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === editingId
            ? {
                ...form,
                id: editingId,
                amount: Number(form.amount),
              }
            : expense
        )
      );
    } else {
      setExpenses((prev) => [
        {
          ...form,
          id: Date.now(),
          amount: Number(form.amount),
        },
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const deleteExpense = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
      setExpenses((prev) =>
        prev.filter((expense) => expense.id !== id)
      );
    }
  };

  return (
    <div className="expenses-page" dir="rtl">
      <div className="expenses-header">
        <div>
          <Link href="/"> <span className="reports-eyebrow">لوحة التحكم / التقارير</span></Link>
          <h1>إدارة المصروفات</h1>
          <p>تابع مصروفاتك وأدر نفقات العمل بسهولة.</p>
        </div>

        <button className="expense-add-btn" onClick={openAddForm}>
          <FaPlus />
          إضافة مصروف
        </button>
      </div>

      <div className="expenses-stats">
        <div className="expense-stat-card">
          <div className="expense-stat-icon purple">
            <FaWallet />
          </div>
          <div>
            <p>إجمالي المصروفات</p>
            <h2>{formatMoney(totalExpenses)}</h2>
            <span>جميع المصروفات المسجلة</span>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon green">
            <FaChartLine />
          </div>
          <div>
            <p>المصروفات المدفوعة</p>
            <h2>{formatMoney(paidExpenses)}</h2>
            <span>إجمالي المبالغ المدفوعة</span>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon orange">
            <FaReceipt />
          </div>
          <div>
            <p>المصروفات المعلقة</p>
            <h2>{formatMoney(pendingExpenses)}</h2>
            <span>مبالغ في انتظار الدفع</span>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon blue">
            <FaMoneyBillWave />
          </div>
          <div>
            <p>عدد المصروفات</p>
            <h2>{expenses.length}</h2>
            <span>عدد السجلات المسجلة</span>
          </div>
        </div>
      </div>

      <div className="expenses-content">
        <div className="expenses-toolbar">
          <div>
            <h2>جميع المصروفات</h2>
            <p>عرض المصروفات وإدارتها من مكان واحد.</p>
          </div>

          <div className="expense-search">
            <FaSearch />
            <input
              type="text"
              placeholder="ابحث عن مصروف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {showForm && (
          <form className="expense-form" onSubmit={handleSubmit}>
            <h3>
              {editingId !== null
                ? "تعديل المصروف"
                : "إضافة مصروف جديد"}
            </h3>

            <div className="expense-form-grid">
              <label>
                اسم المصروف
                <input
                  type="text"
                  placeholder="مثال: إيجار المكتب"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                التصنيف
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                المبلغ (جنيه)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="أدخل المبلغ"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                التاريخ
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                طريقة الدفع
                <select
                  value={form.payment}
                  onChange={(e) =>
                    setForm({ ...form, payment: e.target.value })
                  }
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                حالة الدفع
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="معلق">معلق</option>
                  <option value="مدفوع">مدفوع</option>
                </select>
              </label>
            </div>

            <div className="expense-form-actions">
              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                إلغاء
              </button>

              <button type="submit" className="expense-save-btn">
                {editingId !== null ? "حفظ التعديلات" : "إضافة المصروف"}
              </button>
            </div>
          </form>
        )}

        <div className="expenses-table-wrapper">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>المصروف</th>
                <th>التصنيف</th>
                <th>التاريخ</th>
                <th>طريقة الدفع</th>
                <th>المبلغ</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <div className="expense-title-cell">
                      <div className="expense-row-icon">
                        <FaReceipt />
                      </div>
                      <strong>{expense.title}</strong>
                    </div>
                  </td>

                  <td>
                    <span className="expense-category">
                      {expense.category}
                    </span>
                  </td>

                  <td>{expense.date}</td>
                  <td>{expense.payment}</td>

                  <td className="expense-amount">
                    {formatMoney(expense.amount)}
                  </td>

                  <td>
                    <span
                      className={`expense-status ${
                        expense.status === "مدفوع"
                          ? "paid"
                          : "pending"
                      }`}
                    >
                      {expense.status}
                    </span>
                  </td>

                  <td>
                    <div className="expense-actions">
                      <button
                        type="button"
                        className="expense-edit-btn"
                        onClick={() => openEditForm(expense)}
                        title="تعديل المصروف"
                        aria-label="تعديل المصروف"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="expense-delete-btn"
                        onClick={() => deleteExpense(expense.id)}
                        title="حذف المصروف"
                        aria-label="حذف المصروف"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="7" className="expense-empty">
                    لا توجد مصروفات مطابقة لبحثك.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="expenses-footer">
          عرض {filteredExpenses.length} من أصل {expenses.length} مصروفات
        </div>
      </div>
    </div>
  );
}

export default Expenses;
