
import express from "express";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. البحث عن المستخدم
    const [users] = await db.execute(
      `SELECT id, name, email, workshop_id, password_hash
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "البريد الإلكتروني غير صحيح",
      });
    }


    const user = users[0];


    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "كلمة المرور غير صحيحة",
      });
    }


    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        workshop_id: user.workshop_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );


    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

 
    return res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        workshop_id: user.workshop_id,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
        message: error.message,
    });
  }
});

export default router;
