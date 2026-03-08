import {
  insertBooking,
  getBookingById,
  updateBookingStatusInDB,
  completeBookingInDB,
  getUserBookings
} from "../models/bookingModel.js";
import { getProviderByUserId } from "../models/providerModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrorMiddleware.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";

// @desc    Customer creates a new booking request
// @route   POST /api/bookings
export const requestBooking = catchAsyncErrors(async (req, res, next) => {
  // 🌟 FIX: Added phoneNumber to the destructuring
  const { providerId, categoryId, phoneNumber, address, scheduledDate, notes } = req.body;
  const customerId = req.user.id;

  // Ensure the provider exists and is available
  const providerProfile = await getProviderByUserId(providerId);
  if (!providerProfile || !providerProfile.is_available || !providerProfile.is_approved) {
    return next(new ErrorHandler("Provider is currently unavailable or not approved", 400));
  }

  // 🌟 FIX: Passed phoneNumber as the 4th argument, matching your SQL model perfectly
  const insertId = await insertBooking(
    customerId, 
    providerId, 
    categoryId, 
    phoneNumber, 
    address, 
    scheduledDate, 
    notes
  );

  res.status(201).json({
    success: true,
    message: "Booking requested successfully. Waiting for provider to confirm.",
    bookingId: insertId
  });
});

// @desc    Update Booking Status (State Machine Logic)
// @route   PATCH /api/bookings/:id/status
export const updateBookingStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const bookingId = req.params.id;
  const { id: userId, role } = req.user;

  const booking = await getBookingById(bookingId);
  if (!booking) return next(new ErrorHandler("Booking not found", 404));

  // Security: Ensure user owns this booking
  if (role === 'customer' && booking.customer_id !== userId) return next(new ErrorHandler("Unauthorized", 403));
  if (role === 'provider' && booking.provider_id !== userId) return next(new ErrorHandler("Unauthorized", 403));

  // --- STATE MACHINE VALIDATION ---
  const validTransitions = {
    'Requested': ['Confirmed', 'Cancelled'],
    'Confirmed': ['In-progress', 'Cancelled'],
    'In-progress': ['Completed'], 
    'Completed': [],
    'Cancelled': []
  };

  if (!validTransitions[booking.status].includes(status)) {
    return next(new ErrorHandler(`Cannot change status from ${booking.status} to ${status}`, 400));
  }

  // Role Validation: Customers can ONLY cancel
  if (role === 'customer' && status !== 'Cancelled') {
    return next(new ErrorHandler("Customers can only cancel bookings.", 403));
  }

  await updateBookingStatusInDB(bookingId, status);

  res.status(200).json({ success: true, message: `Booking status updated to ${status}` });
});

// @desc    Complete a job and upload before/after images
// @route   PATCH /api/bookings/:id/complete
export const completeJob = catchAsyncErrors(async (req, res, next) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  const booking = await getBookingById(bookingId);
  if (!booking) return next(new ErrorHandler("Booking not found", 404));
  if (booking.provider_id !== userId) return next(new ErrorHandler("Unauthorized", 403));

  if (booking.status !== 'In-progress') {
    return next(new ErrorHandler("Job must be 'In-progress' before it can be completed", 400));
  }

  // Extract Cloudinary URLs from multer req.files
  const beforeImageUrl = req.files?.beforeImage ? req.files.beforeImage[0].path : null;
  const afterImageUrl = req.files?.afterImage ? req.files.afterImage[0].path : null;

  await completeBookingInDB(bookingId, beforeImageUrl, afterImageUrl);

  res.status(200).json({ success: true, message: "Job completed successfully!" });
});

// @desc    Get user's bookings (Customer or Provider)
// @route   GET /api/bookings
export const getMyBookings = catchAsyncErrors(async (req, res, next) => {
  const bookings = await getUserBookings(req.user.id, req.user.role);
  res.status(200).json({ success: true, count: bookings.length, bookings });
});