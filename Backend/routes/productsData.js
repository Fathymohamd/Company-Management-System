
import express from "express";
const router = express.Router();
import db from "../config/db.js";

router.get("/", async (req, res) => {
  try {
    const [productsData] = await db.query( "SELECT * FROM products");

    res.json({
      success: true,
      data: productsData,
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

