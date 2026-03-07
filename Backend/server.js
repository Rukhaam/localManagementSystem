import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet"; // 🛡️ Import Helmet
import rateLimit from "express-rate-limit"; // 🛡️ Import Rate Limiter
import hpp from "hpp"; // 🛡️ Import HPP

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { errorMiddleware } from "./middlewares/errorMiddleware.js";

dotenv.config();

// Env Var Safety Checks & Fallbacks
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is missing in .env!");
  process.env.JWT_SECRET = "development_fallback_secret_do_not_use_in_prod";
}

const app = express();

//  SECURITY MIDDLEWARE WAREHOUSE

// 1. Set Security HTTP Headers
app.use(helmet());

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 10000,
  message: "Too many requests from this IP, please try again in 15 minutes.",
});
app.use("/api", limiter);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL, // 🌟 ADDED THIS!
    ],
    credentials: true,
  })
);

// 4. Prevent HTTP Parameter Pollution
app.use(hpp());

// STANDARD MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Local Services Booking API is running securely...");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running securely on port ${PORT}`);
  });
}

export default app;
