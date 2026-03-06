import express from "express";
import { createReview, getProviderReviews } from "../controllers/reviewController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validateRequest, reviewRules } from "../middlewares/validatorsMiddleware.js"; // Import Validators!

const router = express.Router();

// Public: Anyone can see a provider's reviews
router.get("/provider/:providerId", getProviderReviews);

// Customer Only: Write a review (Validation applied here!)
router.post(
  "/", 
  isAuthenticated, 
  authorizeRoles("customer"), 
  reviewRules, 
  validateRequest, 
  createReview
);

export default router;