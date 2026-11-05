
import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, job_title, salary, status } = req.body;


    if (!name || !phone || !job_title || salary === undefined || salary === "") {
      return res.status(400).json({
        message: "من فضلك أدخل جميع البيانات المطلوبة",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO employees (name, phone, job_title, salary, status)
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone, job_title, salary, status || "نشط"]
    );

    res.status(201).json({
      message: "تمت إضافة العامل بنجاح",
      employee: {
        id: result.insertId,
        name,
        phone,
        job_title,
        salary,
        status: status || "نشط",
      },
    });
  } catch (error) {
    console.error("Add employee error:", error);

    res.status(500).json({
      message: "حدث خطأ أثناء إضافة العامل",
    });
  }
});

export default router;
