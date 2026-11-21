
import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Get All Reports
router.get("/", async (req, res) => {
  try {
    const [storedReports] = await db.execute(
      `SELECT
    id,
    report_name AS title,
    category,
    DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
    value AS amount,
    status
FROM reports`
    );

    const [orders] = await db.execute(
      `SELECT id, order_number, customer_name, product_name,
              DATE_FORMAT(order_date, '%Y-%m-%d') AS date,
              price AS amount, status
       FROM customer_orders`
    );

    const [expenses] = await db.execute(
      `SELECT id, title,
              DATE_FORMAT(expense_date, '%Y-%m-%d') AS date,
              amount, status
       FROM expenses`
    );

    const savedReports = storedReports.map((report) => ({
      ...report,
      id: `report-${report.id}`,
      amount: Number(report.amount || 0),
    }));

    const orderReports = orders.map((order) => ({
      id: `order-${order.id}`,
      title: order.order_number || `طلب رقم ${order.id}`,
      category: "المبيعات",
      date: order.date,
      amount: Number(order.amount || 0),
      status: order.status,
      description: `${order.customer_name || ""} - ${order.product_name || ""}`,
    }));

    const expenseReports = expenses.map((expense) => ({
      id: `expense-${expense.id}`,
      title: expense.title,
      category: "المصروفات",
      date: expense.date,
      amount: Number(expense.amount || 0),
      status: expense.status,
      description: "",
    }));

    const reports = [
      ...savedReports,
      ...orderReports,
      ...expenseReports,
    ].sort((a, b) =>
      String(b.date || "").localeCompare(String(a.date || ""))
    );

    return res.status(200).json({
      success: true,
      data: reports,
    });

  } catch (error) {
    console.error("Fetch Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب التقارير",
    });
  }
});


// Search Reports
router.get("/search", async (req, res) => {
  try {
    const title =
      typeof req.query.title === "string"
        ? req.query.title.trim()
        : "";

    const [reports] = await db.execute(
      `SELECT
    id,
    report_name AS title,
    category,
    DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
    value AS amount,
    status
FROM reports
WHERE report_name LIKE ?`,
      [`%${title}%`]
    );

    return res.status(200).json({
      success: true,
      data: reports.map((report) => ({
        ...report,
        id: `report-${report.id}`,
        amount: Number(report.amount || 0),
      })),
    });

  } catch (error) {
    console.error("Search Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء البحث عن التقارير",
    });
  }
});


// Create Report
router.post("/", async (req, res) => {
  try {
    const {
      title,
      category,
      description = "",
      report_date,
      amount = 0,
      status = "قيد المراجعة",
    } = req.body || {};

    const reportAmount = Number(amount);

    const reportDate =
      report_date || new Date().toISOString().slice(0, 10);

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      !Number.isFinite(reportAmount) ||
      reportAmount < 0 ||
      typeof reportDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(reportDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "من فضلك أدخل بيانات التقرير بصورة صحيحة",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO reports
(report_name, category, created_at, value, status)
VALUES (?, ?, ?, ?, ?)`,
      [
        title.trim(),
        category.trim(),
        typeof description === "string" ? description.trim() : "",
        reportDate,
        reportAmount,
        status,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "تمت إضافة التقرير بنجاح",
      data: {
        id: `report-${result.insertId}`,
        title: title.trim(),
        category: category.trim(),
        description,
        date: reportDate,
        amount: reportAmount,
        status,
      },
    });

  } catch (error) {
    console.error("Add Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء إضافة التقرير",
    });
  }
});

export default router;
