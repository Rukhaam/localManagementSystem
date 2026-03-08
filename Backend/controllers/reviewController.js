import {
  insertReview,
  getReviewsByProvider,
  getProviderAverageRating,
  getReviewByBookingId,
} from "../models/reviewModel.js";
import { getBookingById } from "../models/bookingModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrorMiddleware.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";

// @desc    Create a review for a completed booking
// @route   POST /api/reviews
export const createReview = catchAsyncErrors(async (req, res, next) => {
  // Fallback to snake_case just in case!
  const bookingId = req.body.bookingId || req.body.booking_id;
  const { rating, comment } = req.body;
  const customerId = req.user.id;

  if (!bookingId || !rating) {
    return next(new ErrorHandler("Booking ID and rating are required", 400));
  }

  // 1. Verify the booking exists and belongs to this customer
  const booking = await getBookingById(bookingId);
  if (!booking) return next(new ErrorHandler("Booking not found", 404));
  
  if (booking.customer_id !== customerId) {
    return next(new ErrorHandler("You did not make this booking", 403));
  }

  // 2. Verify the job is actually finished
  if (booking.status !== "Completed") {
    return next(new ErrorHandler("You can only review completed jobs", 400));
  }

  // 3. Verify they haven't already reviewed this specific job
  const existingReview = await getReviewByBookingId(bookingId);
  if (existingReview) {
    return next(new ErrorHandler("You have already reviewed this booking", 400));
  }

  // 4. Insert the review
  // Notice: We extract provider_id directly from the verified booking object!
  await insertReview(
    bookingId,
    customerId,
    booking.provider_id,
    rating,
    comment || null
  );

  res.status(201).json({
    success: true,
    message: "Review submitted successfully!",
  });
});

// @desc    Get all reviews and average rating for a provider
// @route   GET /api/reviews/provider/:providerId
export const getProviderReviews = catchAsyncErrors(async (req, res, next) => {
  const providerId = req.params.providerId;

  const reviews = await getReviewsByProvider(providerId);
  const rawStats = await getProviderAverageRating(providerId);

  // 🌟 CRITICAL FIX: MySQL COUNT() often returns a BigInt or String depending on the driver.
  // We must explicitly cast these to Numbers so React's `{stats.totalReviews > 0}` logic works perfectly!
  const totalReviews = rawStats?.totalReviews ? Number(rawStats.totalReviews) : 0;
  const averageRating = rawStats?.averageRating ? Number(rawStats.averageRating).toFixed(1) : "0.0";

  res.status(200).json({
    success: true,
    stats: {
      averageRating,
      totalReviews,
    },
    reviews,
  });
});