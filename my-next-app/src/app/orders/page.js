"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ClipboardList,
  Clock,
  CheckCircle2,
  CircleAlert,
  Eye,
  CalendarDays,
  Filter,
  ArrowRight,
} from "lucide-react";

import "../Styles/dashboard.css";

import "../Styles/orders.css";

import { useSelector , useDispatch } from "react-redux";

import {  customer_orders, updateOrderStatus , productName } from "../Lip/redux/customer_orders/page"


import { formData } from "../Lip/redux/employeesThunk/page"

import { toast } from "sonner";



export default function OrdersPage() {

   const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(customer_orders())
    dispatch(productName())
  } , [dispatch])


  const [search, setSearch] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("الكل");

  const [showForm, setShowForm] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const order = useSelector((state) => state.customer.data)

 const product = useSelector(
  (state) => state.customer?.product ?? []
);


const [form, setForm] = useState({
  order_number: "",
  customer_name: "",
  product_name: "",
  order_date: "",
  delivery_date: "",
  price: "",
  status: "قيد التنفيذ",
});

const totalPrice = order
  .filter((item) => item.status === "مكتمل")
  .reduce((total, item) => total + Number(item.price), 0);

const formatPrice = (price) =>
  `${Number(price).toLocaleString("en-US")} ج.م`;

const handleSearch = (e) => {
const value = e.target.value

setSearch(value)

if(value.trim() !== "") {
  dispatch(productName(value.trim()))
}
}

const filteredOrders = ((search.trim() ? product : order)
).filter((item) =>
  selectedStatus === "الكل" || item.status === selectedStatus
);


const handleAddOrders = async (e) => {
  e.preventDefault();

if (
  !form.customer_name.trim() &&
  !form.product_name.trim() &&
  !form.order_date &&
  !form.price &&
  !form.delivery_date &&
  !form.status == ""
) {
  toast.error("من فضلك أدخل جميع البيانات المطلوبة");
  return;
}


  if (!form.customer_name.trim()) {
    toast.error("من فضلك أدخل اسم العميل");
    return;
  }

  if (!form.product_name.trim()) {
    toast.error("من فضلك أدخل اسم المنتج");
    return;
  }

  if (!form.order_date) {
    toast.error("من فضلك أدخل تاريخ الطلب");
    return;
  }

  if (!form.delivery_date) {
    toast.error("من فضلك أدخل تاريخ التسليم");
    return;
  }

  if (!form.price || !Number.isFinite(Number(form.price)) ||
      Number(form.price) <= 0) {
    toast.error("من فضلك أدخل سعرًا صحيحًا");
    return;
  }

  try {
    await dispatch(
      formData({
        customer_name: form.customer_name.trim(),
        product_name: form.product_name.trim(),
        order_date: form.order_date,
        delivery_date: form.delivery_date,
        price: Number(form.price),
        status: form.status || "قيد التنفيذ",
      })
    ).unwrap();

    toast.success("تمت إضافة الطلب بنجاح");

    setForm({
      order_number: "",
      customer_name: "",
      product_name: "",
      order_date: "",
      delivery_date: "",
      price: "",
      status: "قيد التنفيذ",
    });

    setShowForm(false);

    dispatch(customer_orders());
  } catch (error) {
    console.error("فشل إضافة الطلب:", error);

    toast.error(
      typeof error === "string"
        ? error
        : error?.message || "فشل في إضافة الطلب"
    );
  }
};


const changeStatus = async (orderId, status) => {
  try {
    const updatedOrder = await dispatch(
      updateOrderStatus({
        id: orderId,
        status,
      })
    ).unwrap();

    setSelectedOrder(updatedOrder);

    toast.success("تم تحديث حالة الطلب بنجاح");
  } catch (error) {
    console.error("Update status error:", error);

    toast.error(
      typeof error === "string"
        ? error
        : "فشل تحديث حالة الطلب"
    );
  }
};


  return (
    <div className="orders-page" dir="rtl">
      <header className="orders-header">
        <div>
          <Link href="/" className="back-dashboard">
            <ArrowRight size={16} />
            العودة للوحة التحكم
          </Link>
          <h1>إدارة الطلبات</h1>
          <p>تابع طلبات العملاء ومراحل التصنيع والتسليم.</p>
        </div>

        <button
          className="add-order-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={19} />
          إضافة طلب جديد
        </button>
      </header>

      <section className="order-stats">
        <article className="order-stat-card">
          <div className="order-stat-icon blue">
            <ClipboardList size={22} />
          </div>
          <span>إجمالي الطلبات</span>
          <strong>{filteredOrders.length}</strong>
        </article>

        <article className="order-stat-card">
          <div className="order-stat-icon orange">
            <Clock size={22} />
          </div>
          <span>قيد التنفيذ</span>
          <strong>
            {filteredOrders.filter((order) => order.status === "قيد التنفيذ").length}
          </strong>
        </article>

        <article className="order-stat-card">
          <div className="order-stat-icon green">
            <CheckCircle2 size={22} />
          </div>
          <span>طلبات مكتملة</span>
          <strong>
            {filteredOrders.filter((order) => order.status === "مكتمل").length}
          </strong>
        </article>

        <article className="order-stat-card">
          <div className="order-stat-icon purple">
            <ClipboardList size={22} />
          </div>
          <span>قيمة الطلبات المكتملة</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </article>
      </section>

      <section className="orders-table-card">
        <div className="orders-section-title">
          <div>
            <h2>كل الطلبات</h2>
            <p>عدد النتائج: {filteredOrders.length}</p>
          </div>
        </div>

        <div className="orders-filters">
          <div className="orders-search">
            <Search size={19} />
            <input
              type="search"
              placeholder="ابحث برقم الطلب أو العميل أو المنتج..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="orders-status-filter">
            <Filter size={17} />
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              aria-label="تصفية حسب الحالة"
            >
           <option value="الكل">كل الحالات</option>
    <option value="قيد التنفيذ">قيد التنفيذ</option>
    <option value="مكتمل">مكتمل</option>
    <option value="معلق">معلق</option>
    <option value="ملغي">ملغي</option>
            </select>
          </div>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>العميل</th>
                <th>المنتج</th>
                <th>تاريخ الطلب</th>
                <th>موعد التسليم</th>
                <th>السعر</th>
                <th>الحالة</th>
                <th>التفاصيل</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders?.map((order) => (
                <tr key={order.id}>
                  <td className="orders-id">{order.id}</td>
                  <td className="orders-customer">{order.customer_name}</td>
                  <td>{order.product_name}</td>
                  <td>{order.order_date}</td>
                  <td>
                    <span className="delivery-date">
                      <CalendarDays size={14} />
                      {order.delivery_date}
                    </span>
                  </td>
                  <td className="orders-price">{(order.price)}</td>
                  <td>
                    <span
                      className={`orders-status ${
                        order.status === "مكتمل"
                          ? "status-completed"
                          : order.status === "معلق"
                            ? "status-pending"
                            : "status-progress"
                      }`}
                    >
                      {order.status === "معلق" && <CircleAlert size={14} />}
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="details-button"
                     onClick={() => setSelectedOrder(order)} 
                      aria-label={`تفاصيل الطلب ${order.id}`}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="orders-empty">
                    لا توجد طلبات تطابق البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

{showForm && (
  <div className="order-modal-overlay">
    <form className="order-modal" onSubmit={handleAddOrders}>
      <div className="modal-heading">
        <h2>إضافة طلب جديد</h2>

        <button
          type="button"
          className="modal-close"
          onClick={() => setShowForm(false)}
          aria-label="إغلاق"
        >
          ×
        </button>
      </div>

      <label>
        اسم العميل
        <input
          value={form.customer_name}
          onChange={(event) =>
            setForm({ ...form, customer_name: event.target.value })
          }
          placeholder="اكتب اسم العميل"
        
        />
      </label>

      <label>
        اسم المنتج
        <input
          value={form.product_name}
          onChange={(event) =>
            setForm({ ...form, product_name: event.target.value })
          }
          placeholder="مثال: غرفة نوم"
        
        />
      </label>

      <label>
        السعر بالجنيه المصري
        <input
          type="number"
          min="1"
          value={form.price}
          onChange={(event) =>
            setForm({ ...form, price: event.target.value })
          }
          placeholder="مثال: 15000"
       
        />
      </label>

      <label>
        تاريخ الطلب
        <input
          type="date"
          value={form.order_date}
          onChange={(event) =>
            setForm({ ...form, order_date: event.target.value })
          }
          
        />
      </label>

      <label>
        موعد التسليم
        <input
          type="date"
          value={form.delivery_date}
          onChange={(event) =>
            setForm({ ...form, delivery_date: event.target.value })
          }
         
        />
      </label>

            <label>
          الحالة
        <input
          type="text"
          value={form.status}
          onChange={(event) =>
            setForm({ ...form, status: event.target.value })
          }
    
        />
      </label>

      <button
        type="submit"
        className="add-order-button modal-submit"
      >
        حفظ الطلب
      </button>
    </form>
  </div>
)}

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <section
            className="order-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>تفاصيل الطلب {selectedOrder.id}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="إغلاق"
              >
                ×
              </button>
            </div>

            <div className="order-details">
              <p><strong>العميل:</strong> {selectedOrder.customer_name}</p>
              <p><strong>المنتج:</strong> {selectedOrder.product_name}</p>
              <p><strong>تاريخ الطلب:</strong> {selectedOrder.order_date}</p>
              <p><strong>موعد التسليم:</strong> {selectedOrder.delivery_date}</p>
              <p><strong>السعر:</strong> {formatPrice(selectedOrder.price)}</p>
            </div>

            <label className="status-select-label">
              تحديث حالة الطلب
              <select
       value={selectedOrder.status}
    onChange={(e) =>
      changeStatus(selectedOrder.id, e.target.value)
    }
              >
                <option value="معلق">معلق</option>
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="مكتمل">مكتمل</option>
              </select>
            </label>
          </section>
        </div>
      )}
    </div>
  );
}