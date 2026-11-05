import express from "express";
const router = express.Router();
import db from "../config/db.js";

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM customers_data WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "العامل غير موجود",
      });
    }

    res.json({
      message: "تم حذف العامل بنجاح",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "حدث خطأ أثناء حذف العامل",
    });
  }
});

export default router;