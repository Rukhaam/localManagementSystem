import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route: Anyone can view categories
router.get("/", getCategories);

// Protected routes: Only logged-in Admins can create, update, or delete
router.post("/", isAuthenticated, authorizeRoles("admin"), createCategory);
router.put("/:id", isAuthenticated, authorizeRoles("admin"), updateCategory);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteCategory);

export default router;
