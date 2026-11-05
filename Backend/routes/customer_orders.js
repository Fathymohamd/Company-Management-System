
import express from "express";
import db from "../config/db.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const [orders] = await db.execute(
      "SELECT * FROM customer_orders"
    );

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      message: "حدث خطأ أثناء جلب الطلبات",
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "قيد التنفيذ",
      "مكتمل",
      "معلق",
      "ملغي",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "حالة الطلب غير صحيحة",
      });
    }

   const [result] = await db.execute(
    `UPDATE customer_orders SET status  = ? WHERE id  = ? `, [status, id]
   )
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "الطلب غير موجود",
      });
    }

    const [orders] = await db.execute(
      "SELECT * FROM customer_orders WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      message: "تم تحديث حالة الطلب بنجاح",
      order: orders[0],
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      message: "حدث خطأ أثناء تحديث حالة الطلب",
    });
  }
});

export default router;
