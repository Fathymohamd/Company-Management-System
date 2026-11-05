import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const name = req.query.name || "";

    const [orders] = await db.execute(
      "SELECT * FROM orders WHERE name LIKE ?",
      [`%${name}%`]
    );

    res.status(200).json(orders);
  } catch (error) {
    console.error("Orders search error:", error);

    res.status(500).json({
      message: "Error searching orders",
    });
  }
});

export default router;