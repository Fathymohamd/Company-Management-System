import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;

    const [employees] = await db.execute(
      "SELECT * FROM employees WHERE name LIKE ?",
      [`%${name || ""}%`]
    );

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Error searching employees",
    });
  }
});

export default router;