
import express from "express";
const router = express.Router();
import db from "../config/db.js";

router.get("/", async (req, res) => {
  try {
    const [materials] = await db.query( "SELECT * FROM materials");

    res.json({
      success: true,
      data: materials,
    });
  } catch (error) {
    console.error("Fetch employees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch materials",
    });
  }
});

export default router;

