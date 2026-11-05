import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    name,
    phone,
    email,
    address,
    orders_count,
    total_purchases,
  } = req.body;

try {


const [result] = await db.execute(
  `INSERT INTO customers_data (
    name,
    phone,
    email,
    address,
    orders_count,
    total_purchases ) VALUES (?, ?, ?, ?, ?, ?)`,
  [
    name,
    phone,
    email,
    address,
    orders_count,
    total_purchases,
  ]
);

res.status(200).json({
   message: "تمت إضافة الطلب بنجاح",
   order:{
    id: result.insertId,
    name,
    phone,
    email,
    address,
    orders_count,
    total_purchases,
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