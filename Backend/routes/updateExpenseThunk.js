import express from "express";
import db from "../config/db.js";

const router = express.Router();


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
title,
category_id	, 
amount	,
expense_date,
payment_method_id,
status,
    } = req.body;

    const sql = `
      UPDATE expenses
      SET 
        title = ?,
        category_id = ?,
        amount = ?,
        expense_date = ?,
        payment_method_id = ?,
        status = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [
title,
category_id	, 
amount	,
expense_date,
payment_method_id,
status,
 id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    const [updatedMaterial] = await db.execute(
      "SELECT * FROM expenses WHERE id = ?",
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