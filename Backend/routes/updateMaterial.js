import express from "express";
import db from "../config/db.js";

const router = express.Router();


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      quantity,
      alert_limit,
      unit_price,
      status,
    } = req.body;

    const sql = `
      UPDATE materials
      SET 
        name = ?,
        category = ?,
        quantity = ?,
        alert_limit = ?,
        unit_price = ?,
        status = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [
      name,
      category,
      quantity,
      alert_limit,
      unit_price,
      status,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    const [updatedMaterial] = await db.execute(
      "SELECT * FROM materials WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Material updated successfully",
      material: updatedMaterial[0],
    });

  } catch (error) {
  console.error("Update Material Error:", error);

  res.status(500).json({
    message: "Error updating material",
    error: error.message,
  });
}
});

export default router;