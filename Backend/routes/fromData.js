
import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    customer_name,
    product_name,
    order_date,
    delivery_date,
    price,
    status = "قيد التنفيذ",
  } = req.body;

  if (
    !customer_name?.trim() ||
    !product_name?.trim() ||
    !order_date ||
    !price
  ) {
    return res.status(400).json({
      message: "من فضلك أدخل بيانات الطلب المطلوبة",
    });
  }


  const order_number = `ORD-${Date.now()}`;

  try {
    const [result] = await db.execute(
      `INSERT INTO customer_orders
       (order_number, customer_name, product_name, order_date,
        delivery_date, price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        order_number,
        customer_name.trim(),
        product_name.trim(),
        order_date,
        delivery_date || null,
        Number(price),
        status,
      ]
    );

    return res.status(200).json({
      message: "تمت إضافة الطلب بنجاح",
      customer_orders: {
        id: result.insertId,
        order_number,
        customer_name,
        product_name,
        order_date,
        delivery_date,
        price: Number(price),
        status,
      },
    });
  } catch (error) {
    console.error("Add order error:", error);

    return res.status(500).json({
      message:
        error.sqlMessage ||
        error.message ||
        "حدث خطأ أثناء إضافة الطلب",
    });
  }
});

export default router;
