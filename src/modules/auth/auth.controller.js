import { Router } from "express";
import {
  changePassword,
  confirmEmail,
  forgetPassword,
  login,
  logout,
  refreshToken,
  register,
  resendEmailOtp,
  resendPasswordOtp,
  updateEmail,
  updatePassword,
} from "./auth.service.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/confirm-email", auth, confirmEmail);
router.patch("/update-email", auth, updateEmail);
router.post("/resend-email-otp", auth, resendEmailOtp);
router.patch("/update-password", auth, updatePassword);
router.patch("/change-password", auth, changePassword);
router.post("/forget-password", forgetPassword);
router.post("/resend-password-otp", auth, resendPasswordOtp);
router.post("/logout", auth, logout);

export default router;
