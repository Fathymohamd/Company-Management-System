import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
  title,
category_id	, 
amount	,
expense_date,
payment_method_id,
status,
  } = req.body;

try {


const [result] = await db.execute(
  `INSERT INTO expenses (
 title,
category_id	, 
amount	,
expense_date,
payment_method_id,
status) VALUES (?, ?, ?, ?, ?, ?)`,
  [
title,
category_id	, 
amount	,
expense_date,
payment_method_id,
status,
  ]
);

res.status(200).json({
   message: "تمت إضافة الطلب بنجاح",
   order:{
    id: result.insertId,
title,
category_id	, 
amount	,
expense_date,
payment_method_id,
status,
   }
})

}catch(error){
      return res.status(500).json({
      message:
        error.sqlMessage ||
        error.message ||
        "حدث خطأ أثناء إضافة الطلب",
    });
}

})

export default router