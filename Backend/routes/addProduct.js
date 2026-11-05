import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    name,
    category,
    price,
    quantity,
    status,
  } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO products (
        name,
        category,
        price,
        quantity,
        status
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        category,
        price,
        quantity,
        status || "متوفر",
      ]
    );

    res.status(201).json({
      message: "تمت إضافة المنتج بنجاح",
      data: {
        id: result.insertId,
        name,
        category,
        price,
        quantity,
        status,
      },
    });

  } catch (error) {
    console.log("Add Product Error:", error);

    return res.status(500).json({
      message:
        error.sqlMessage ||
        error.message ||
        "حدث خطأ أثناء إضافة المنتج",
    });
  }
});

export default router;