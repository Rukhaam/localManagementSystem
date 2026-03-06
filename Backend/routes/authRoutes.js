import express from "express";
import {
  getMe,
  registerUser,
  loginUser,
  verifyOTP,
  forgotPassword,
  resetPassword,
  updatePasswordLoggedIn,

  logoutUser,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

// Import the validator engine and the specific rules!
import {
  validateRequest,
  registerRules,
  loginRules,
} from "../middlewares/validatorsMiddleware.js";

const router = express.Router();


router.post("/register", registerRules, validateRequest, registerUser);
router.post("/login", loginRules, validateRequest, loginUser);

router.get('/me', isAuthenticated, getMe);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", logoutUser);
router.put("/update-password", isAuthenticated, updatePasswordLoggedIn);

export default router;
