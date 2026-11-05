
"use client";

import { useMemo, useState , useEffect  } from "react";

import Link from "next/link";

import {
  Search,
  Plus,
  Trash2,
  Package,
  Boxes,
  AlertTriangle,
  DollarSign,
  X,
  Pencil,
  ArrowRight,
  Warehouse,
} from "lucide-react";

import "../Styles/dashboard.css";

import "../Styles/materials.css";

import { useDispatch, useSelector } from "react-redux";

import { getMaterials  , searchMaterials , deleteMaterial  , remove  , addMaterial , updateMaterial} 
from "../Lip/redux/materialsSlice/page";

import { toast } from "sonner";

const initialMaterials = [
  {
    id: 1,
    name: "خشب زان",
    category: "خشب طبيعي",
    unit: "متر مكعب",
    quantity: 12,
    minQuantity: 5,
    price: 18000,
    supplier: "مصنع الأخشاب الحديثة",
  },
  {
    id: 2,
    name: "خشب MDF",
    category: "ألواح خشبية",
    unit: "لوح",
    quantity: 35,
    minQuantity: 10,
    price: 650,
    supplier: "شركة النور للأخشاب",
  },
  {
    id: 3,
    name: "خشب موسكي",
    category: "خشب طبيعي",
    unit: "متر مكعب",
    quantity: 4,
    minQuantity: 5,
    price: 9500,
    supplier: "مصنع الأخشاب الحديثة",
  },
  {
    id: 4,
    name: "مسامير خشب",
    category: "إكسسوارات",
    unit: "علبة",
    quantity: 3,
    minQuantity: 10,
    price: 120,
    supplier: "محل العدد والأدوات",
  },
  {
    id: 5,
    name: "مفصلات أبواب",
    category: "إكسسوارات",
    unit: "قطعة",
    quantity: 80,
    minQuantity: 20,
    price: 35,
    supplier: "شركة الأمان",
  },
  {
    id: 6,
    name: "دهان ورنيش",
    category: "دهانات",
    unit: "عبوة",
    quantity: 15,
    minQuantity: 5,
    price: 280,
    supplier: "محل الدهانات الحديثة",
  },
  {
    id: 7,
    name: "غراء خشب",
    category: "مواد لاصقة",
    unit: "عبوة",
    quantity: 0,
    minQuantity: 5,
    price: 95,
    supplier: "محل العدد والأدوات",
  },
];

const emptyForm = {
  name: "",
  category: "خشب طبيعي",
  quantity: "",
  alert_limit: "",
  unit_price: "",
  status: "متوفر",
};

const formatMoney = (value) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);

function getStatus(material) {
  if (material.quantity === 0) {
    return { label: "نفد المخزون", className: "out" };
  }

  if (material.quantity <= material.minQuantity) {
    return { label: "كمية منخفضة", className: "low" };
  }

  return { label: "متوفر", className: "available" };
}

export default function MaterialsPage() {
const { data, loading, error } = useSelector(
  (state) => state.materials.data || []
);

  const [materials, setMaterials] = useState(data);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

const dispatch = useDispatch();



const categories = [
  ...new Set(data?.map((material) => material.category)),
];

const materialSearch = useSelector((state) => state.materials.search || [])


useEffect(() => {
  dispatch(getMaterials());
}, [dispatch]);


  // const stats = useMemo(() => {
  //   return {
  //     total: materials.length,
  //     quantity: materials.reduce(
  //       (sum, material) => sum + material.quantity,
  //       0
  //     ),
  //     low: materials.filter(
  //       (material) =>
  //         material.quantity > 0 &&
  //         material.quantity <= material.minQuantity
  //     ).length,
  //     out: materials.filter((material) => material.quantity === 0).length,
  //     value: materials.reduce(
  //       (sum, material) =>
  //         sum + material.quantity * material.price,
  //       0
  //     ),
  //   };
  // }, [materials]);


const sreachMaterials = async (e) => {
const value = e.target.value;

setSearch(value)

if(value.trim() !== ""){
  dispatch(searchMaterials(value.trim()))
}
}

const currentMaterials = search.trim()
  ? materialSearch || []
  : data || [];

const filteredMaterials = currentMaterials.filter((item) => {
  return (
    categoryFilter === "الكل" ||
    item.category === categoryFilter
  );
});

const priceMaterials = filteredMaterials.reduce((sum , item) =>
 (sum + Number(item.unit_price)) , 0)
  
  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }



async function openEditModal(material) {
  setEditingId(material.id);

  setForm({
    name: material.name || "",
    category: material.category || "خشب طبيعي",
    quantity: String(material.quantity ?? ""),
    alert_limit: String(material.alert_limit ?? ""),
    unit_price: String(material.unit_price ?? ""),
    status: material.status || "متوفر",
  });

 setShowModal(true);
}

const handleChange = (event) => {
  const { name, value } = event.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};


async function handleSubmit(event) {
  event.preventDefault();

  if (!form.name.trim()) {
    toast.error("من فضلك أدخل اسم الخامة");
    return;
  }

  if (!form.category) {
    toast.error("من فضلك اختر تصنيف الخامة");
    return;
  }

  if (
    form.quantity === "" ||
    !Number.isFinite(Number(form.quantity)) ||
    Number(form.quantity) < 0
  ) {
    toast.error("أدخل كمية صحيحة");
    return;
  }

  if (
    form.alert_limit === "" ||
    !Number.isFinite(Number(form.alert_limit)) ||
    Number(form.alert_limit) < 0
  ) {
    toast.error("أدخل حد التنبيه الصحيح");
    return;
  }

  if (
    form.unit_price === "" ||
    !Number.isFinite(Number(form.unit_price)) ||
    Number(form.unit_price) < 0
  ) {
    toast.error("أدخل سعر الوحدة الصحيح");
    return;
  }

  const quantity = Number(form.quantity);
  const alert_limit = Number(form.alert_limit);

  const status =
    quantity <= 0
      ? "غير متوفر"
      : quantity <= alert_limit
        ? "منخفض"
        : "متوفر";

  const materialData = {
    name: form.name.trim(),
    category: form.category,
    quantity,
    alert_limit,
    unit_price: Number(form.unit_price),
    status,
  };

  try {
    if (editingId) {
      await dispatch(
        updateMaterial({
          id: editingId,
          formData: materialData,
        })
      ).unwrap();

      toast.success("تم تعديل الخامة بنجاح");
    } else {
      await dispatch(addMaterial(materialData)).unwrap();

      toast.success("تمت إضافة الخامة بنجاح");
    }

    setForm(emptyForm);
    setShowModal(false);
    setEditingId(null);
    dispatch(getMaterials());

  } catch (error) {
    console.error("Material Error:", error);

    toast.error(
      typeof error === "string"
        ? error
        : "حدث خطأ أثناء حفظ الخامة"
    );
  }
}


const handleDeleteMaterial = async (id) => {
  try {
    await dispatch(deleteMaterial(id)).unwrap();
      dispatch(remove(id))
    toast.success("تم حذف الخامة بنجاح");
  } catch (error) {
   toast.error(error?.message || String(error));
  }
};

  return (
    <main className="materials-page" dir="rtl">
      <header className="materials-header">
        <div className="materials-heading">
          <Link href="/" className="materials-back">
            <ArrowRight size={18} />
            العودة للوحة التحكم
          </Link>

          <h1>الخامات والمخزون</h1>
          <p>تابع خامات الورشة وكميات المخزون وتكلفتها.</p>
        </div>

        <button
          className="materials-primary-btn"
          onClick={openAddModal}
        >
          <Plus size={19} />
          إضافة خامة جديدة
        </button>
      </header>

      <section className="materials-stats">
        <article className="material-stat-card">
          <div className="material-stat-icon purple">
            <Boxes size={23} />
          </div>
          <div>
            <p>إجمالي أنواع الخامات</p>
            <h2>{filteredMaterials.length}</h2>
            <span>نوع خامة مسجل</span>
          </div>
        </article>

        <article className="material-stat-card">
          <div className="material-stat-icon blue">
            <Package size={23} />
          </div>
          <div>
            <p>إجمالي الكميات</p>
            <h2>{filteredMaterials.quantity}</h2>
            <span>وحدة مخزنة</span>
          </div>
        </article>

        <article className="material-stat-card">
          <div className="material-stat-icon orange">
            <AlertTriangle size={23} />
          </div>
          <div>
            <p>مخزون منخفض</p>
            <h2>{filteredMaterials.filter((item)=>(item.status === "منخفض")).length}</h2>
            <span>خامات تحتاج متابعة</span>
          </div>
        </article>

        <article className="material-stat-card">
          <div className="material-stat-icon green">
            <DollarSign size={23} />
          </div>
          <div>
            <p>قيمة المخزون</p>
            <h2 className="material-money">
              {priceMaterials}
            </h2>
            <span>{filteredMaterials.filter((item)=>(item.status === "غير متوفر"))
            .length }خامة نفدت بالكامل</span>
          </div>
        </article>
      </section>

      <section className="materials-content">
        <div className="materials-toolbar">
          <div>
            <h2>قائمة الخامات</h2>
            <p>إدارة ومراجعة الخامات المسجلة في الورشة.</p>
          </div>

          <div className="materials-filters">
            <div className="materials-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="ابحث عن خامة أو مورد..."
                value={search}
                onChange={sreachMaterials}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="فلترة حسب نوع الخامة"
            >
              <option value="الكل">كل الأنواع</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="materials-table-wrap">
          <table className="materials-table">
            <thead>
              <tr>
                <th>اسم الخامة</th>
                <th>التصنيف</th>
                <th>الكمية</th>
                <th>حد التنبيه</th>
                <th>سعر الوحدة</th>
                <th>قيمة المخزون</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

  
<tbody>
  {filteredMaterials.map((material) => {
    const status = getStatus(material);

    return (
      <tr key={material.id}>
        <td>
          <div className="material-name-cell">
            <div className="material-row-icon">
              <Warehouse size={19} />
            </div>

            <div>
              <strong>{material.name}</strong>
            </div>
          </div>
        </td>

        <td>{material.category}</td>

        <td>
          <strong>{material.quantity}</strong>
        </td>

        <td>{material.alert_limit}</td>

        <td>{formatMoney(material.unit_price)}</td>

        <td>
          <strong>{formatMoney(material.stock_value)}</strong>
        </td>

        <td>
          <span className={`material-status ${status.className}`}>
            {material.status}
          </span>
        </td>

        <td>
          <div className="material-actions">
            <button
              className="material-edit-btn"
              title="تعديل الخامة"
              aria-label={`تعديل ${material.name}`}
              onClick={() => openEditModal(material)}
            >
              <Pencil size={17} />
            </button>

            <button
              className="material-delete-btn"
              title="حذف الخامة"
              aria-label={`حذف ${material.name}`}
              onClick={() => handleDeleteMaterial(material.id)}
            >
              <Trash2 size={17} />
            </button>
          </div>
        </td>
      </tr>
    );
  })}

  {filteredMaterials.length === 0 && (
    <tr>
      <td colSpan={8} className="materials-empty">
        لا توجد خامات تطابق البحث.
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>

        <div className="materials-table-footer">
          <span>
            عرض {filteredMaterials.length} من {filteredMaterials.length} خامة
          </span>
          <span>بيانات المخزون الحالية</span>
        </div>
      </section>

      {showModal && (
        <div
          className="materials-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <section
            className="materials-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="materials-modal-title"
          >
            <div className="materials-modal-header">
              <div>
                <h2 id="materials-modal-title">
                  {editingId !== null ? "تعديل بيانات الخامة" : "إضافة خامة جديدة"}
                </h2>
                <p>أدخل بيانات الخامة والكميات والأسعار.</p>
              </div>

              <button
                type="button"
                className="materials-close-btn"
                onClick={() => setShowModal(false)}
                aria-label="إغلاق"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
           <div className="materials-form-grid">

  <label>
    اسم الخامة
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="مثال: خشب زان"
    />
  </label>

  <label>
    التصنيف
    <select
      name="category"
      value={form.category}
      onChange={handleChange}
    >
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  </label>

  <label>
    الكمية الحالية
    <input
      name="quantity"
      type="number"
      min="0"
      step="any"
      value={form.quantity}
      onChange={handleChange}
    />
  </label>

  <label>
    حد التنبيه للمخزون
    <input
      name="alert_limit"
      type="number"
      min="0"
      step="any"
      value={form.alert_limit}
      onChange={handleChange}
    />
  </label>

  <label className="materials-full-width">
    سعر الوحدة بالجنيه
    <input
      name="unit_price"
      type="number"
      min="0"
      step="any"
      value={form.unit_price}
      onChange={handleChange}
    />
  </label>

</div>

              <div className="materials-modal-actions">
                <button type="button" className="materials-cancel-btn" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="materials-primary-btn">
                  {editingId !== null ? "حفظ التعديلات" : "إضافة الخامة"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
