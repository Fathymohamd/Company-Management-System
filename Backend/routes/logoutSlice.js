
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,

    });

    return res.status(200).json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
    });

  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء تسجيل الخروج",
    });
  }
});

export default router;
