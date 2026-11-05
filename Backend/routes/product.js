import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const name = req.query.customer_name || 0;

    const [customer_orders] = await db.execute(
      "SELECT * FROM customer_orders WHERE customer_name LIKE ?",
      [`%${name || ""}%`]
    );

    res.json(customer_orders);
  } catch (error) {
    res.status(500).json({
      message: "Error searching customer_orders",
    });
  }
});

export default router;