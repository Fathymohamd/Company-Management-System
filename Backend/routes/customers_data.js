import express from "express"
const router = express.Router();
import db from "../config/db.js";

router.get("/" , async (req , res) => {
    try{
const [customers] = await db.execute(`SELECT * FROM customers_data`)

    return res.status(200).json({
      customers,
    });
    }catch(error){
         return res.status(500).json({
      message: "حدث خطأ أثناء جلب الطلبات",
    });
    }
})

export default router;