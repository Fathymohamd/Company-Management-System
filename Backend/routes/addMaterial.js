import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    name,
    category,
    quantity,
    alert_limit,
    unit_price,
  } = req.body;

  try {
    if (!name?.trim()) {
      return res.status(400).json({
        message: "اسم الخامة مطلوب",
      });
    }

    const qty = Number(quantity);
    const alert = Number(alert_limit);
    const price = Number(unit_price);

    if (
      quantity === "" ||
      !Number.isFinite(qty) ||
      qty < 0 ||
      alert_limit === "" ||
      !Number.isFinite(alert) ||
      alert < 0 ||
      unit_price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        message: "بيانات الكمية أو السعر غير صحيحة",
      });
    }

    const status =
      qty <= 0
        ? "غير متوفر"
        : qty <= alert
          ? "منخفض"
          : "متوفر";

    const [result] = await db.execute(
      `INSERT INTO materials (
        name,
        category,
        quantity,
        alert_limit,
        unit_price,
        status
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        category || "خشب طبيعي",
        qty,
        alert,
        price,
        status,
      ]
    );

    return res.status(201).json({
      message: "تمت إضافة الخامة بنجاح",
      data: {
        id: result.insertId,
        name: name.trim(),
        category,
        quantity: qty,
        alert_limit: alert,
        unit_price: price,
        status,
        stock_value: qty * price,
      },
    });

  } catch (error) {
    console.error("Add Material Error:", error);

    return res.status(500).json({
      message: error.sqlMessage || "حدث خطأ أثناء إضافة الخامة",
    });
  }
});

export default router;