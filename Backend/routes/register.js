
import express from "express";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  let connection;

  try {
    const {
      name,
      workshopName,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;



    // تجهيز البيانات
    const userEmail = email.trim().toLowerCase();
    const userPhone = phone.trim();

    // 3. الاتصال بقاعدة البيانات
    connection = await db.getConnection();

    await connection.beginTransaction();

    // 4. فحص البريد الإلكتروني
    const [existingUser] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [userEmail]
    );

    if (existingUser.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        message: "البريد الإلكتروني مستخدم بالفعل",
      });
    }

    
    const [existingPhone] = await connection.execute(
      "SELECT id FROM users WHERE phone = ?",
      [userPhone]
    );

    if (existingPhone.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        message: "رقم الهاتف مستخدم بالفعل",
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const [workshopResult] = await connection.execute(
      "INSERT INTO workshops (workshop_name) VALUES (?)",
      [workshopName.trim()]
    );

 
    const workshopId = workshopResult.insertId;


    await connection.execute(
      `INSERT INTO users
      (workshop_id, name, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        workshopId,
        name.trim(),
        userEmail,
        userPhone,
        hashedPassword,
        "owner",
      ]
    );

    // 9. تأكيد حفظ البيانات
    await connection.commit();

    return res.status(201).json({
      message: "تم إنشاء حساب الورشة بنجاح",
    });

  } catch (error) {

    // إلغاء العملية لو حصل خطأ
    if (connection) {
      await connection.rollback();
    }

    console.log(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل",
      });
    }

    return res.status(500).json({
      message: "حدث خطأ أثناء إنشاء الحساب",
    });

  } finally {

    // إرجاع الاتصال إلى Pool
    if (connection) {
      connection.release();
    }

  }
});

export default router;
