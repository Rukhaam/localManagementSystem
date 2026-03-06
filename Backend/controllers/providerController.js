import {
    insertProviderProfile,
    getProviderByUserId,
    updateProviderProfileInDB,
    toggleAvailabilityInDB,
    approveProviderInDB,
    getAllApprovedProviders,
    getAllProvidersDB
  } from "../models/providerModel.js";
  import { catchAsyncErrors } from "../middlewares/catchAsyncErrorMiddleware.js";
  import { ErrorHandler } from "../middlewares/errorMiddleware.js";
  
  // @desc    Create or update provider profile
  // @route   POST /api/providers/profile
  export const createOrUpdateProfile = catchAsyncErrors(async (req, res, next) => {
    const { categoryId, bio } = req.body;
    const userId = req.user.id; // From your secure cookie!
  
    if (!categoryId || !bio) {
      return next(new ErrorHandler("Category ID and bio are required", 400));
    }
  
    // Check if profile already exists
    const existingProfile = await getProviderByUserId(userId);
  
    if (existingProfile) {
      // Update existing
      await updateProviderProfileInDB(userId, categoryId, bio);
      return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } else {
      // Create new
      await insertProviderProfile(userId, categoryId, bio);
      return res.status(201).json({ success: true, message: "Profile created successfully. Waiting for admin approval." });
    }
  });
  
  // @desc    Toggle availability status (on/off duty)
  // @route   PATCH /api/providers/availability
  export const toggleAvailability = catchAsyncErrors(async (req, res, next) => {
    const { isAvailable } = req.body;
    const userId = req.user.id;
  
    if (typeof isAvailable !== "boolean") {
      return next(new ErrorHandler("isAvailable must be a boolean (true or false)", 400));
    }
  
    const profile = await getProviderByUserId(userId);
    if (!profile) return next(new ErrorHandler("Please create a profile first", 404));
  
    await toggleAvailabilityInDB(userId, isAvailable);
  
    res.status(200).json({ success: true, message: `You are now ${isAvailable ? 'available' : 'unavailable'} for jobs.` });
  });
  
  // @desc    Approve or reject a provider profile (Admin only)
  // @route   PATCH /api/providers/:profileId/approve
  export const approveProvider = catchAsyncErrors(async (req, res, next) => {
    const { isApproved } = req.body;
    const { profileId } = req.params;
  
    if (typeof isApproved !== "boolean") {
      return next(new ErrorHandler("isApproved must be a boolean", 400));
    }
  
    await approveProviderInDB(profileId, isApproved);
  
    res.status(200).json({ success: true, message: `Provider has been ${isApproved ? 'approved' : 'unapproved'}.` });
  });
  
  // @desc    Get all available & approved providers (Public/Customers)
  // @route   GET /api/providers
  export const getActiveProviders = catchAsyncErrors(async (req, res, next) => {
    // Optional: filter by category ?categoryId=1
    const categoryId = req.query.categoryId || null; 
    
    const providers = await getAllApprovedProviders(categoryId);
  
    res.status(200).json({ success: true, count: providers.length, providers });
  });
  export const getMyProfile = catchAsyncErrors(async (req, res, next) => {
    const profile = await getProviderByUserId(req.user.id);
    res.status(200).json({ success: true, profile: profile || null });
  });
  export const getAllProvidersForAdmin = catchAsyncErrors(async (req, res, next) => {
    const providers = await getAllProvidersDB();

    res.status(200).json({
        success: true,
        count: providers.length,
        providers
    });
});