import express from "express";
import { getAllUsers, getAllBookings } from "../controllers/adminController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🌟 Protect all admin routes automatically
router.use(isAuthenticated);
router.use(authorizeRoles("admin"));

// 🌟 Define the specific endpoints
router.get("/users", getAllUsers);
router.get("/bookings", getAllBookings);

export default router;