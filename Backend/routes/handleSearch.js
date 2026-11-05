import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const name = req.query.name || "";

    const [customers] = await db.execute(
      "SELECT * FROM customers_data WHERE name LIKE ?",
      [`%${name}%`]
    );

    res.status(200).json(customers);
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      message: "Error searching customers",
    });
  }
});

export default router;