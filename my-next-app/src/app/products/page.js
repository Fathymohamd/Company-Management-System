
"use client";
import { toast } from "sonner";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Armchair,
  Search,
  Plus,
  Package,
  Boxes,
  Wallet,
  Trash2,
  X,
  ArrowRight,
} from "lucide-react";

import "../Styles/dashboard.css";

import "../Styles/products.css";

import { useSelector , useDispatch } from "react-redux";

import {fetchProducts , searchProducts , deleteProduct , addProduct} from "../Lip/redux/products/products"


const emptyForm = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  status: "",
};

export default function ProductsPage() {

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("الكل");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const dispatch = useDispatch()
  
  useEffect(()=>{
    dispatch(fetchProducts())
  } , [dispatch])


   const productsdata = useSelector((state) => state.products.data)

    const searchProductsData = useSelector((state) => state.products.search)
     console.log(searchProductsData)
   /*  const searchResults = searchProductsData?.data || []; */
    
const totalStock = productsdata
  .filter((product) => product.status === "متوفر")
  .reduce(
    (sum, product) => sum + Number(product.price),
    0
  );

  const inventoryValue = productsdata.reduce(
    (sum, product) => sum +  Number(product.price),
    0
  );

const handleSubmit = async (e) => {
  e.preventDefault();

  // التأكد من اسم المنتج
  if (!form.name.trim()) {
    toast.error("من فضلك أدخل اسم المنتج");
    return;
  }

  // التأكد من التصنيف
  if (!form.category.trim()) {
    toast.error("من فضلك اختر تصنيف المنتج");
    return;
  }

  // التأكد من السعر
  if (!form.price || Number(form.price) <= 0) {
    toast.error("من فضلك أدخل سعر صحيح");
    return;
  }

  // التأكد من الكمية
  if (form.quantity === "" || Number(form.quantity) < 0) {
    toast.error("من فضلك أدخل كمية صحيحة");
    return;
  }

  try {
    await dispatch(addProduct(form)).unwrap();

    toast.success("تم إضافة المنتج بنجاح");

    setShowModal(false);
    setForm(emptyForm);

  } catch (error) {
    console.log(error);
    toast.error(error?.message || "حدث خطأ أثناء إضافة المنتج");
  }
};



const handleSearch  = (e) => {
  const value = e.target.value

  setSearch(value)
try{
  if(value.trim() !== ""){
    dispatch(searchProducts(value.trim()))
  }

setShowModal(false);

}catch(error){
  console.log(error)
}
  }


const currentProducts = search.trim()
  ? searchProductsData || []
  : productsdata || [];
  
const filteredProducts = currentProducts.filter((item) => {
  const matchesCategory =
    category === "الكل" || item.category === category;

  return matchesCategory;
});;

const categories = [
  "الكل",
  ...new Set(
    productsdata
      .map((product) => product.category)
      .filter(Boolean)
  ),
];

const  handleDelete = async (id) => {
  await dispatch(deleteProduct(id))
  }

  return (
    <div className="products-page" dir="rtl">
      <header className="products-header">
        <div>
          <Link href="/" className="products-back">
            <ArrowRight size={17} />
            العودة للوحة التحكم
          </Link>

          <h1>إدارة المنتجات</h1>
          <p>تابع منتجات ورشة النجارة والأسعار والكميات المتاحة.</p>
        </div>

        <button
          className="product-add-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={19} />
          إضافة منتج
        </button>
      </header>

      <section className="products-stats">
        <article className="product-stat-card">
          <div className="product-stat-icon blue">
            <Package size={23} />
          </div>
          <span>إجمالي المنتجات</span>
          <h2>{filteredProducts.length}</h2>
        </article>

        <article className="product-stat-card">
          <div className="product-stat-icon green">
            <Boxes size={23} />
          </div>
          <span>إجمالي القطع المتاحة</span>
          <h2>{totalStock}</h2>
        </article>

        <article className="product-stat-card">
          <div className="product-stat-icon orange">
            <Armchair size={23} />
          </div>
          <span>منتجات نفدت كميتها</span>
          <h2>
            {filteredProducts.filter((product) => product.status === "غير متوفر").length}
          </h2>
        </article>

        <article className="product-stat-card">
          <div className="product-stat-icon purple">
            <Wallet size={23} />
          </div>
          <span>قيمة المخزون الحالية</span>
          <h2>{inventoryValue.toLocaleString("en-US")} ج.م</h2>
        </article>
      </section>

      <section className="products-content">
        <div className="products-content-heading">
          <div>
            <h2>قائمة المنتجات</h2>
            <p>جميع منتجات الورشة المسجلة</p>
          </div>

          <span className="products-count">
            {filteredProducts.length} منتج
          </span>
        </div>

        <div className="products-toolbar">
          <div className="products-search">
            <Search size={19} />
            <input
              type="search"
              placeholder="ابحث عن اسم المنتج أو التصنيف..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          <select
            className="products-category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="تصفية حسب التصنيف"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>التصنيف</th>
                <th>السعر</th>
                <th>الكمية المتاحة</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-name-cell">
                      <div className="product-avatar">
                        <Armchair size={21} />
                      </div>

                      <div>
                        <strong>{product.name}</strong>
                        <p>{product.description}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="product-category">
                      {product.category}
                    </span>
                  </td>

                  <td className="product-price">
                    {product.price.toLocaleString("en-US")} ج.م
                  </td>

                  <td>{product.quantity}</td>

                  <td>
                    <span
                      className={`product-status ${
                        product.quantity === 0
                          ? "out-of-stock"
                          : product.quantity <= 4
                            ? "low-stock"
                            : "available"
                      }`}
                    >
                      {product.quantity === 0
                        ? "نفد المخزون"
                        : product.quantity <= 4
                          ? "كمية منخفضة"
                          : "متوفر"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="product-delete-button"
                      title="حذف المنتج"
                      aria-label={`حذف ${product.name}`}
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="products-empty">
                    لا توجد منتجات مطابقة للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div
          className="product-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="product-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-modal-header">
              <div>
                <h2>إضافة منتج جديد</h2>
                <p>أدخل تفاصيل المنتج والكميات المتاحة.</p>
              </div>

              <button
                type="button"
                className="product-close-button"
                aria-label="إغلاق"
                onClick={() => setShowModal(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                اسم المنتج *
                <input
                  minLength={2}
                  value={form.name}
                  placeholder="مثال: باب خشب طبيعي"
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </label>

              <label>
                التصنيف *
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  <option value="">اختر التصنيف</option>
                  <option value="غرف نوم">غرف نوم</option>
                  <option value="مطابخ">مطابخ</option>
                  <option value="أبواب">أبواب</option>
                  <option value="مكاتب">مكاتب</option>
                  <option value="أثاث منزلي">أثاث منزلي</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </label>

              <label>
                السعر بالجنيه *
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  placeholder="مثال: 6500"
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                />
              </label>

              <label>
                الكمية المتاحة *
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  placeholder="مثال: 10"
                  onChange={(event) =>
                    setForm({ ...form, quantity: event.target.value })
                  }
                />
              </label>

              <label>
               الحالة
                <input
                  rows={3}
                  value={form.status}
                  placeholder="اكتب وصفًا مختصرًا للمنتج"
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                />
              </label>

              <div className="product-modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>

                <button type="submit" className="product-save-button">
                  <Plus size={18} />
                  حفظ المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
