import express from "express";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "غير مسجل الدخول",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const [users] = await db.execute(
      `SELECT id, name, email, workshop_id
       FROM users
       WHERE id = ?`,
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "المستخدم غير موجود",
      });
    }

    return res.json({
      user: users[0],
    });

  } catch (error) {
    return res.status(401).json({
      message: "جلسة تسجيل الدخول غير صالحة",
    });
  }
});

export default router;