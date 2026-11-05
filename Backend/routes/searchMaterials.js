import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;

    const [materials] = await db.execute(
      "SELECT * FROM materials WHERE name LIKE ?",
      [`%${name || ""}%`]
    );

    res.json(materials);
  } catch (error) {
    res.status(500).json({
      message: "Error searching employees",
    });
  }
});

export default router;