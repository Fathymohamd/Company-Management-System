
"use client";

import { useEffect, useState } from "react";

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

import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";
import { setExpensesData  , ExpensesSearch  , deleteExpenseThunk , addExpenseThunk  , updateExpenseThunk} from "../Lip/redux/expensesSlice/expensesSlice";



function Expenses() {

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(setExpensesData())
  } , [dispatch])


const data = useSelector((state) => state.expenses.data || []);

const searchData = useSelector((state) => state.expenses.search || []);

const [form, setForm] = useState({
  title: "",
  category_id: "",
  amount: "",
  expense_date: "",
  payment_method_id: "",
  status: "Pending",
});

const handleSearch = (e)=> {
  e.preventDefault()
  const value = e.target.value;
  setSearch(value)
  if(value.trim() !== ""){
    dispatch(ExpensesSearch(value))
  }
}
  const filteredExpenses  = search.trim() ? searchData || [] : data  || []


const totalExpenses = filteredExpenses.reduce(
  (total, expense) => total + Number(expense.amount || 0),
  0
);

const paidExpenses = filteredExpenses
  .filter((expense) => expense.status === "Paid")
  .reduce((total, expense) => total + Number(expense.amount || 0), 0);

const pendingExpenses = filteredExpenses
  .filter((expense) => expense.status === "Pending")
  .reduce((total, expense) => total + Number(expense.amount || 0), 0);

const categories = [
  { id: 1, name: "إيجار الورشة" },
  { id: 2, name: "الكهرباء والمياه" },
  { id: 3, name: "الرواتب والأجور" },
  { id: 4, name: "شراء الخامات" },
  { id: 5, name: "الصيانة والإصلاحات" },
  { id: 6, name: "النقل والمواصلات" },
  { id: 7, name: "الأدوات والمعدات" },
  { id: 8, name: "مصروفات أخرى" },
];

const paymentMethods = [
  { id: 1, name: "نقدًا" },
  { id: 2, name: "تحويل بنكي" },
  { id: 3, name: "بطاقة بنكية" },
  { id: 4, name: "محفظة إلكترونية" },
];

  const openAddForm = () => {
    setEditingId(null);
    // setForm({
    //   title: "",
    //   category: "أخرى",
    //   amount: "",
    //   date: new Date().toISOString().slice(0, 10),
    //   payment: "نقدًا",
    //   status: "معلق",
    // });
    setShowForm(true);
  };

const openEditForm = (expense) => {
  setEditingId(expense.id);

  setForm({
    title: expense.title ?? "",
    category_id: expense.category_id ?? "",
    amount: expense.amount ?? "",
    expense_date: expense.expense_date?.slice(0, 10) ?? "",
    payment_method_id: expense.payment_method_id ?? "",
    status: expense.status ?? "Pending",
  });

  setShowForm(true);
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  // التحقق من الحقول الفارغة
  if (
    !form.title.trim() ||
    !form.category_id ||
    !form.amount ||
    !form.expense_date ||
    !form.payment_method_id ||
    !form.status
  ) {
    toast.error("من فضلك املأ جميع الحقول");
    return;
  }

  // التحقق من أن المبلغ أكبر من صفر
  if (Number(form.amount) <= 0) {
    toast.error("يجب أن يكون المبلغ أكبر من صفر");
    return;
  }

  const expenseData = {
    title: form.title.trim(),
    category_id: Number(form.category_id),
    amount: Number(form.amount),
    expense_date: form.expense_date,
    payment_method_id: Number(form.payment_method_id),
    status: form.status,
  };

  try {
    if (editingId) {
      await dispatch(
        updateExpenseThunk({
          id: editingId,
          ...expenseData,
        })
      ).unwrap();

      toast.success("تم تعديل المصروف بنجاح");
    } else {
      await dispatch(addExpenseThunk(expenseData)).unwrap();

      toast.success("تم إضافة المصروف بنجاح");
    }

    setShowForm(false);
    setEditingId(null);

    setForm({
      title: "",
      category_id: "",
      amount: "",
      expense_date: "",
      payment_method_id: "",
      status: "Pending",
    });
  } catch (error) {
toast.error(
  typeof error === "string"
    ? error
    : error?.message || "حدث خطأ أثناء إضافة المصروف"
);
  }
};


  const deleteExpense = (id) => {
 try{
  dispatch(deleteExpenseThunk(id))
 }catch(error){
  console.log(error)
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
            <h2>{totalExpenses} ج.م.</h2>
            <span>جميع المصروفات المسجلة</span>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon green">
            <FaChartLine />
          </div>
          <div>
            <p>المصروفات المدفوعة</p>
            <h2>{paidExpenses} ج.م.</h2>
            <span>إجمالي المبالغ المدفوعة</span>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon orange">
            <FaReceipt />
          </div>
          <div>
            <p>المصروفات المعلقة</p>
            <h2>{pendingExpenses} ج.م.</h2>
            <span>مبالغ في انتظار الدفع</span>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon blue">
            <FaMoneyBillWave />
          </div>
          <div>
            <p>عدد المصروفات</p>
            <h2>{filteredExpenses.length}</h2>
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
              onChange={handleSearch}
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

      {/* Expense Title */}
      <label>
        اسم المصروف
        <input
          type="text"
          placeholder="مثال: إيجار المكتب"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
      
        />
      </label>

      {/* Category */}
      <label>
        التصنيف
        <select
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: e.target.value })
          }
      
        >
          <option value="">اختر التصنيف</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      {/* Amount */}
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
 
        />
      </label>

      {/* Expense Date */}
      <label>
        التاريخ
        <input
          type="date"
          value={form.expense_date}
          onChange={(e) =>
            setForm({ ...form, expense_date: e.target.value })
          }
        />
      </label>

      {/* Payment Method */}
      <label>
        طريقة الدفع
        <select
          value={form.payment_method_id}
          onChange={(e) =>
            setForm({ ...form, payment_method_id: e.target.value })
          }
        >
          <option value="">اختر طريقة الدفع</option>
 
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
      </label>

      {/* Status */}
      <label>
        حالة الدفع
        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="Pending">معلق</option>
          <option value="Paid">مدفوع</option>
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
  {filteredExpenses?.map((expense) => (
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
          {expense.category_id}
        </span>
      </td>

      <td>{expense.expense_date}</td>

      <td>{expense.status}</td>

      <td className="expense-amount">
        {expense.amount}
      </td>

      <td>
        <span
          className={`expense-status ${
            expense.status === "Paid" ? "paid" : "pending"
          }`}
        >
          {expense.status === "Paid" ? "مدفوع" : "معلق"}
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
          عرض {filteredExpenses.length} من أصل {filteredExpenses.length} مصروفات
        </div>
      </div>
    </div>
  );
}

export default Expenses;
