
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserRoundCog,
  Search,
  Plus,
  Phone,
  BriefcaseBusiness,
  Wallet,
  Trash2,
  X,
  ArrowRight,
   LoaderCircle, AlertCircle, RefreshCw 
} from "lucide-react";


import "../Styles/dashboard.css";
import "../Styles/employees.css";

import { toast } from "sonner";

const emptyForm = {
  name: "",
  phone: "",
  job_title: "",
  salary: "",
  status: "نشط",
};

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchEmployees , remove } from "../Lip/redux/employeesApi/page";

import { search } from "../Lip/redux/searchRedux/page";

import { deleteEmployee } from "../Lip/redux/employeesSlice/page";

import { addEmployee } from "../Lip/redux/employeesThunk/page";


export default function EmployeesPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
 
  const dispatch = useDispatch();

  const Employees = useSelector(
    (state) => state.employees.data ?? []
  );



  const employees = useSelector(
    (state) => state.search.employees ?? []
  );

  const loading = useSelector(
    (state) => state.employees.loading
  );

  const error = useSelector(
    (state) => state.employees.error
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

const handleSearch = (e) => {
  const value = e.target.value;

  setSearchTerm(value);

  if (value.trim() !== "") {
    dispatch(search(value.trim()));
  }
};

  const displayedEmployees = searchTerm.trim()
    ? employees
    : Employees;

  const totalSalaries = Employees.reduce(
    (sum, employee) => sum + Number(employee.salary || 0),
    0
  );


const handleDelete = async (id) => {
  try {
    await dispatch(deleteEmployee(id)).unwrap();
     dispatch(remove(id))
    toast.success("تم حذف الموظف بنجاح");
  } catch (error) {
    console.error("فشل الحذف:", error);
    toast.error(
      typeof error === "string" ? error : "فشل حذف الموظف"
    );
  }
};


if (loading) {
  return (
    <div className="employees-loading">
      <div className="loading-header">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-button"></div>
      </div>

      <div className="loading-card">
        <div className="loading-spinner">
          <LoaderCircle size={32} />
        </div>

        <h3>جاري تحميل الموظفين</h3>
        <p>برجاء الانتظار، نقوم بتجهيز بيانات الموظفين...</p>

        <div className="skeleton-table">
          {[1, 2, 3, 4].map((item) => (
            <div className="skeleton-row" key={item}>
              <div className="skeleton skeleton-avatar"></div>
              <div className="skeleton-content">
                <div className="skeleton skeleton-name"></div>
                <div className="skeleton skeleton-text"></div>
              </div>
              <div className="skeleton skeleton-salary"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


if (error) {
  return (
    <div className="employees-error">
      <div className="error-icon">
        <AlertCircle size={32} />
      </div>

      <h3>تعذر تحميل بيانات الموظفين</h3>

      <p>{error}</p>

      <button
        className="retry-button"
        onClick={() => dispatch(fetchEmployees())}
      >
        <RefreshCw size={17} />
        إعادة المحاولة
      </button>
    </div>
  );
}



const handleSubmit = async (e) => {
  e.preventDefault();


if (!form.name.trim() || form.name.trim().length < 4) {
  toast.error("الاسم مطلوب ولا يقل عن 4 أحرف");
  return;
}

  const phoneRegex = /^01[0125][0-9]{8}$/;

  if (!form.phone.trim()) {
    toast.error("من فضلك أدخل رقم التليفون");
    return;
  }

  if (!phoneRegex.test(form.phone.trim())) {
    toast.error("رقم التليفون يجب أن يكون 11 رقمًا مصريًا صحيحًا");
    return;
  }

  if (!form.job_title.trim()) {
    toast.error("من فضلك اختر الوظيفة");
    return;
  }

  if (
    form.salary === "" ||
    !Number.isFinite(Number(form.salary)) ||
    Number(form.salary) < 0
  ) {
    toast.error("من فضلك أدخل راتبًا صحيحًا لا يقل عن صفر");
    return;
  }


  try {
    await dispatch(addEmployee(form)).unwrap();

    toast.success("تمت إضافة العامل بنجاح");

    setForm(emptyForm);
    setShowModal(false);
    dispatch(fetchEmployees());
  } catch (error) {
    toast.error(
      typeof error === "string"
        ? error
        : "فشل إضافة العامل"
    );
  }
};

  return (
    <div className="employees-page" dir="rtl">
      <header className="employees-header">
        <div>
          <Link href="/" className="employees-back">
            <ArrowRight size={17} />
            العودة للوحة التحكم
          </Link>

          <h1>إدارة العمال</h1>
          <p>تابع بيانات فريق العمل والوظائف والرواتب الشهرية.</p>
        </div>

        <button
          className="employee-add-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={19} />
          إضافة عامل
        </button>
      </header>

      <section className="employees-stats">
        <article className="employee-stat-card">
          <div className="employee-stat-icon blue">
            <Users size={23} />
          </div>
          <span>إجمالي العمال</span>
          <h2>{Employees.length}</h2>
        </article>

        <article className="employee-stat-card">
          <div className="employee-stat-icon green">
            <UserRoundCog size={23} />
          </div>
          <span>على رأس العمل</span>
          <h2>
            {Employees.filter(
              (employee) => employee.status === "نشط"
            ).length}
          </h2>
        </article>

        <article className="employee-stat-card">
          <div className="employee-stat-icon orange">
            <BriefcaseBusiness size={23} />
          </div>
          <span>في إجازة</span>
          <h2>
            {Employees.filter((employee) => employee.status === "غير نشط").length}
          </h2>
        </article>

        <article className="employee-stat-card">
          <div className="employee-stat-icon purple">
            <Wallet size={23} />
          </div>
          <span>إجمالي الرواتب الشهرية</span>
          <h2>{totalSalaries.toLocaleString("en-US")} ج.م</h2>
        </article>
      </section>

      <section className="employees-content">
        <div className="employees-content-heading">
          <div>
            <h2>قائمة العمال</h2>
            <p>بيانات العاملين في ورشة النجارة</p>
          </div>

          <span className="employees-count">
            {Employees.length} عامل
          </span>
        </div>

        <div className="employees-search">
          <Search size={19} />

          <input
            type="search"
            placeholder="ابحث باسم العامل أو الوظيفة أو الهاتف..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="employees-table-wrapper">
          <table className="employees-table">
            <thead>
              <tr>
                <th>العامل</th>
                <th>رقم الهاتف</th>
                <th>الوظيفة</th>
                <th>الراتب الشهري</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

         
<tbody>


  {displayedEmployees?.map((employee) => (
    <tr key={employee.id}>
      <td>
        <div className="employee-name-cell">
          <div className="employee-avatar">
            {employee.name?.charAt(0)}
          </div>
          <strong>{employee.name}</strong>
        </div>
      </td>

      <td>
        <span className="employee-contact">
          <Phone size={15} />
          {employee.phone}
        </span>
      </td>

      <td>{employee.job_title}</td>

      <td className="employee-salary">
        {Number(employee.salary).toLocaleString("en-US")} ج.م
      </td>

      <td>
        <span
          className={`employee-status ${
            employee.status === "على رأس العمل"
              ? "working"
              : "on-leave"
          }`}
        >
          {employee.status}
        </span>
      </td>

      <td>
        <button
          className="employee-delete-button"
          title="حذف العامل"
          aria-label={`حذف ${employee.name}`}
          onClick={() => handleDelete(employee.id)}
        >
          <Trash2 size={17} />
        </button>
      </td>
    </tr>
  ))}

{displayedEmployees.length === 0 && (
  <tr>
    <td colSpan={6} className="employees-empty">
      لا يوجد عمال مطابقون للبحث.
    </td>
  </tr>
)}
</tbody>



            
          </table>
        </div>
      </section>

      {showModal && (
        <div
          className="employee-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="employee-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="employee-modal-header">
              <div>
                <h2>إضافة عامل جديد</h2>
                <p>أدخل بيانات العامل والراتب الشهري.</p>
              </div>

              <button
                type="button"
                className="employee-close-button"
                aria-label="إغلاق"
                onClick={() => setShowModal(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                اسم العامل *
                <input
                 
                  minLength={2}
                  value={form.name}
                  placeholder="اكتب اسم العامل"
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </label>

              <label>
                رقم الهاتف *
                <input
                  
                  type="tel"
                  value={form.phone}
                  placeholder="01xxxxxxxxx"
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                />
              </label>

              <label>
                الوظيفة *
                <select
                  
                  value={form.job_title}
                  onChange={(event) =>
                    setForm({ ...form, job_title: event.target.value })
                  }
                >
                  <option value="">اختر الوظيفة</option>
                  <option value="نجار محترف">نجار محترف</option>
                  <option value="مساعد نجار">مساعد نجار</option>
                  <option value="دهان أخشاب">دهان أخشاب</option>
                  <option value="فني تركيب">فني تركيب</option>
                  <option value="مسؤول مخزن">مسؤول مخزن</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </label>

              <label>
                الراتب الشهري بالجنيه *
                <input
                  
                  type="number"
                  min="0"
                  value={form.salary}
                  placeholder="مثال: 6000"
                  onChange={(event) =>
                    setForm({ ...form, salary: event.target.value })
                  }
                />
              </label>

              <label>
                الحالة
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option value="على رأس العمل">نشط</option>
                  <option value="إجازة">غير نشط</option>
                </select>
              </label>

              <div className="employee-modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>

                <button type="submit" className="employee-save-button">
                  <Plus size={18} />
                  حفظ العامل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}