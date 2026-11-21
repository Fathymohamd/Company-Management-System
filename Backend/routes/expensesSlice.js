
import express from "express";
const router = express.Router();
import db from "../config/db.js";

router.get("/", async (req, res) => {
  try {
    const [expenses] = await db.query( "SELECT * FROM expenses");

    res.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error("Fetch expenses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
});

export default router;

