
"use client";

import {  toast } from "sonner";

import { useEffect, useState } from "react";

import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Trash2,
  UserRound,
  X,
  ArrowRight,
} from "lucide-react";

import "../Styles/dashboard.css";

import "../Styles/customers.css";


import { useSelector , useDispatch } from "react-redux";

import {fetchCustomers  , handle_search , deleteCustomer , addCustomer}  from "../Lip/redux/customers_data/page"

import { customer_orders} from "../Lip/redux/customer_orders/page"

import { fetchEmployees } from "../Lip/redux/employeesApi/page";

export default function CustomersPage() {
    
const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(customer_orders())
  }, [dispatch]);


const data = useSelector((state) => state.customers.data)

const searchResults = useSelector(
  (state) => state.customers.Search
);

  const Employees = useSelector(
    (state) => state.employees.data ?? []
  );

  const order = useSelector((state) => state.customer.data)

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  useEffect(()=> {
  dispatch(fetchCustomers())
} , [dispatch])



const handleSearch = (e) => {
  const value = e.target.value;

  setSearch(value);

  if (value.trim() !== "") {
    dispatch(handle_search(value.trim()));
  }
};
const filteredCustomers = search.trim() ? searchResults : data

 
  const totalRevenue = filteredCustomers.reduce(
    (sum, customer) => sum + Number(customer.total_purchases || 0),
    0
  );

   const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",    
    orders_count : "",
   total_purchases : ""
  });


const handleSubmit = async (event) => {
  event.preventDefault();

  // التحقق من اسم العميل
  if (form.name.trim().length < 2) {
    toast.error("يرجى إدخال اسم العميل، على الأقل حرفين");
    return;
  }

  // التحقق من رقم الهاتف
  if (!/^01[0125][0-9]{8}$/.test(form.phone.trim())) {
    toast.error("رقم الهاتف غير صحيح، يجب أن يتكون من 11 رقمًا");
    return;
  }

  // التحقق من البريد الإلكتروني إذا تم إدخاله
  if (
    form.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    toast.error("يرجى إدخال بريد إلكتروني صحيح");
    return;
  }

  // التحقق من عدد الطلبات
  if (
    form.orders_count === "" ||
    !/^\d+$/.test(String(form.orders_count))
  ) {
    toast.error("يرجى إدخال عدد طلبات صحيح");
    return;
  }

  // التحقق من إجمالي المشتريات
  if (
    form.total_purchases === "" ||
    !/^\d+(\.\d{1,2})?$/.test(String(form.total_purchases))
  ) {
    toast.error("يرجى إدخال إجمالي مشتريات صحيح");
    return;
  }

  try {
    const result = await dispatch(addCustomer(form));

    if (addCustomer.fulfilled.match(result)) {
      await dispatch(fetchCustomers());
      setShowModal(false);

      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        orders_count: "",
        total_purchases: "",
      });

      toast.success("تمت إضافة العميل بنجاح");
    } else {
      toast.error(result.payload || "حدث خطأ أثناء إضافة العميل");
    }
  } catch (error) {
    toast.error("حدث خطأ أثناء إضافة العميل");
    console.error(error);
  }
}

const handleDelete = (id) => {
  dispatch(deleteCustomer(id));
  toast.success("تم حذف الموظف بنجاح");
}



  return (
    <div className="customers-page" dir="rtl">
      <header className="customers-header">
        <div>
          <Link href="/" className="customers-back">
            <ArrowRight size={17} />
            العودة للوحة التحكم
          </Link>

          <h1>إدارة العملاء</h1>
          <p>تابع بيانات عملائك وسجل طلباتهم في مكان واحد.</p>
        </div>

        <button
          className="customer-add-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={19} />
          إضافة عميل
        </button>
      </header>

      <section className="customers-stats">
        <article className="customer-stat-card">
          <div className="customer-stat-icon blue">
            <Users size={23} />
          </div>
          <span>إجمالي العملاء</span>
          <h2>{filteredCustomers.length}</h2>
        </article>

        <article className="customer-stat-card">
          <div className="customer-stat-icon green">
            <UserRound size={23} />
          </div>
          <span>العملاء النشطون</span>
          <h2>{Employees.length}</h2>
        </article>

        <article className="customer-stat-card">
          <div className="customer-stat-icon orange">
            <Users size={23} />
          </div>
          <span>إجمالي الطلبات</span>
          <h2>
            {order.length}
          </h2>
        </article>

        <article className="customer-stat-card">
          <div className="customer-stat-icon purple">
            <UserRound size={23} />
          </div>
          <span>إجمالي المبيعات المسجلة</span>
          <h2>{totalRevenue.toLocaleString("en-US")} ج.م</h2>
        </article>
      </section>

      <section className="customers-content">
        <div className="customers-content-heading">
          <div>
            <h2>قائمة العملاء</h2>
            <p>جميع العملاء المسجلين في النظام</p>
          </div>

          <span className="customers-count">
            {filteredCustomers.length} عميل
          </span>
        </div>

        <div className="customers-search">
          <Search size={19} />

          <input
            type="search"
            placeholder="ابحث بالاسم أو رقم الهاتف أو البريد..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>العميل</th>
                <th>رقم الهاتف</th>
                <th>البريد الإلكتروني</th>
                <th>العنوان</th>
                <th>الطلبات</th>
                <th>إجمالي المشتريات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers?.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-name-cell">
                      <div className="customer-avatar">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>

                      <strong>{customer.name}</strong>
                    </div>
                  </td>

                  <td>
                    <span className="customer-contact">
                      <Phone size={15} />
                      {customer.phone}
                    </span>
                  </td>

                  <td>
                    <span className="customer-contact">
                      <Mail size={15} />
                      {customer.email || "غير متوفر"}
                    </span>
                  </td>

                  <td>
                    <span className="customer-contact">
                      <MapPin size={15} />
                      {customer.address || "غير متوفر"}
                    </span>
                  </td>

                  <td>{customer.orders_count}</td>

                  <td className="customer-total">
                    {customer.total_purchases.toLocaleString("en-US")} ج.م
                  </td>

                  <td>
                    <button
                      className="customer-delete-button"
                      title="حذف العميل"
                      aria-label={`حذف ${customer.name}`}
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="customers-empty">
                    لا يوجد عملاء مطابقون للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div
          className="customer-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="customer-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-modal-header">
              <div>
                <h2>إضافة عميل جديد</h2>
                <p>أدخل بيانات العميل لتسجيله في النظام.</p>
              </div>

              <button
                type="button"
                className="customer-close-button"
                aria-label="إغلاق"
                onClick={() => setShowModal(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                اسم العميل *
                <input
                  type="text"
                  minLength={2}
                  placeholder="اكتب اسم العميل"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </label>

              <label>
                رقم الهاتف *
                <input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                />
              </label>

              <label>
                البريد الإلكتروني
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                />
              </label>

              <label>
                العنوان
                <input
                  type="text"
                  placeholder="المحافظة أو المدينة"
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                />
              </label>

     <label>
                الطلبات
                <input
                  type="text"
                  placeholder="الطلبات"
                  value={form.orders_count}
                  onChange={(event) =>
                    setForm({ ...form, orders_count: event.target.value })
                  }
                />
              </label>

                   <label>
                	إجمالي المشتريات
                <input
                  type="text"
                  placeholder="إجمالي المشتريات"
                  value={form.total_purchases}
                  onChange={(event) =>
                    setForm({ ...form, total_purchases: event.target.value })
                  }
                />
              </label>
              <div className="customer-modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>

                <button type="submit" className="customer-save-button">
                  <Plus size={18} />
                  حفظ العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
