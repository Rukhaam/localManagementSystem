import {
    insertCategory,
    fetchAllCategories,
    fetchCategoryById,
    updateCategoryInDB,
    deleteCategoryFromDB,
  } from "../models/categoryModel.js";
  import { catchAsyncErrors } from "../middlewares/catchAsyncErrorMiddleware.js";
  import { ErrorHandler } from "../middlewares/errorMiddleware.js";
  
  // @desc    Create a new category (Admin only)
  // @route   POST /api/categories
  export const createCategory = catchAsyncErrors(async (req, res, next) => {
    const { name, description } = req.body;
  
    if (!name) {
      return next(new ErrorHandler("Category name is required", 400));
    }
  
    const insertId = await insertCategory(name, description);
  
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: { id: insertId, name, description },
    });
  });
  
  // @desc    Get all categories (Public - Customers need to see these to browse)
  // @route   GET /api/categories
  export const getCategories = catchAsyncErrors(async (req, res, next) => {
    const categories = await fetchAllCategories();
  
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  });
  
  // @desc    Update a category (Admin only)
  // @route   PUT /api/categories/:id
  export const updateCategory = catchAsyncErrors(async (req, res, next) => {
    const { name, description } = req.body;
    const categoryId = req.params.id;
  
    const category = await fetchCategoryById(categoryId);
    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }
  
    await updateCategoryInDB(categoryId, name || category.name, description || category.description);
  
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });
  });
  

  // route   DELETE /api/categories/:id
  export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const categoryId = req.params.id;
  
    const category = await fetchCategoryById(categoryId);
    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }
  
    await deleteCategoryFromDB(categoryId);
  
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  });