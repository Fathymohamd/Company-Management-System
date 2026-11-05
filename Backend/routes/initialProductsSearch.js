import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/Search", async (req, res) => {
  try {
    const name = req.query.name || "";

    const [products] = await db.execute(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${name}%`]
    );
  console.log("Search name:", name);
    console.log("Products found:", products.length);
    res.json(products);

  } catch (error) {
    console.error("Search Products Error:", error);

    res.status(500).json({
      message: "Error searching products",
      error: error.message,
    });
  }
});

export default router;