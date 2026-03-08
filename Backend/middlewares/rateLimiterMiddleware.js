import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// 1. Limiter for Registration
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, 
    message: {
        success: false,
        message: "Too many registration attempts from this IP. Please try again after 1 hour."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

// 2. Limiter for Login
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: {
        success: false,
        message: "Too many login attempts for this account. Please try again after 15 minutes."
    },
    keyGenerator: (req, res) => {
        // If email exists, limit by email
        if (req.body && req.body.email) {
            return req.body.email;
        }
        // Safely fallback to IP using the package's built-in helper
        return ipKeyGenerator(req, res); 
    }
});