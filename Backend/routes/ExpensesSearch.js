import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const title = req.query.title || "";

    const [expenses] = await db.execute(
      "SELECT * FROM expenses WHERE title LIKE ?",
      [`%${title}%`]
    );

  res.status(200).json({
  data: expenses,
});
  } catch (error) {
    console.error("Orders search error:", error);

    res.status(500).json({
      message: "Error searching orders",
    });
  }
});

export default router;