import express from "express";
import {
  requestBooking,
  updateBookingStatus,
  completeJob,
  getMyBookings,
} from "../controllers/bookingController.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js"; // Import Cloudinary Multer setup
import {
  validateRequest,
  bookingRules,
} from "../middlewares/validatorsMiddleware.js"; // Import your validators

const router = express.Router();

router.use(isAuthenticated);

router.get("/", getMyBookings);

router.post(
  "/",
  authorizeRoles("customer"),
  bookingRules,
  validateRequest,
  requestBooking
);

router.patch(
  "/:id/status",
  authorizeRoles("customer", "provider"),
  updateBookingStatus
);

router.patch(
  "/:id/complete",
  authorizeRoles("provider"),
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  completeJob
);

export default router;
