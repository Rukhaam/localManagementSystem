import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ErrorHandler } from "./errorMiddleware.js";
import { catchAsyncErrors } from "./catchAsyncErrorMiddleware.js";
import { getUserById } from "../models/userModel.js";

dotenv.config();

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler("User is not authenticated. Please log in.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await getUserById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  delete user.password;
  req.user = user;

  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
