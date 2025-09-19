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
  updateEmail,
  updatePassword,
} from "./auth.service.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import {
  changePasswordSchema,
  confirmEmailSchema,
  forgetPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  updateEmailSchema,
  updatePasswordSchema,
} from "./auth.validation.js";
const router = Router();

router.post("/register", validation(registerSchema), register);
router.post("/login", validation(loginSchema), login);
router.post("/refresh-token", validation(refreshTokenSchema), refreshToken);
router.post(
  "/confirm-email",
  validation(confirmEmailSchema),
  auth,
  confirmEmail
);
router.patch("/update-email", validation(updateEmailSchema), auth, updateEmail);
router.post("/resend-email-otp", auth, resendEmailOtp);
router.patch(
  "/update-password",
  validation(updatePasswordSchema),
  auth,
  updatePassword
);
router.post(
  "/forget-password",
  validation(forgetPasswordSchema),
  forgetPassword
);
router.patch(
  "/change-password",
  validation(changePasswordSchema),
  changePassword
);
router.post("/logout", auth, logout);

export default router;
