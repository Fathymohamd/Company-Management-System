
import express from "express";
const router = express.Router();
import db from "../config/db.js";

router.get("/", async (req, res) => {
  try {
    const [employees] = await db.query( "SELECT * FROM employees");

    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Fetch employees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
});

export default router;

