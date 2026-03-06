import express from "express";
import {
  createOrUpdateProfile,
  toggleAvailability,
  approveProvider,
  getMyProfile,
  getActiveProviders
} from "../controllers/providerController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public / Customer Route: Browse available providers
router.get("/", getActiveProviders);

// Provider Only Routes
router.get("/profile", isAuthenticated, authorizeRoles("provider"), getMyProfile);
router.post("/profile", isAuthenticated, authorizeRoles("provider"), createOrUpdateProfile);
router.patch("/availability", isAuthenticated, authorizeRoles("provider"), toggleAvailability);

// Admin Only Route
router.patch("/:profileId/approve", isAuthenticated, authorizeRoles("admin"), approveProvider);

export default router;