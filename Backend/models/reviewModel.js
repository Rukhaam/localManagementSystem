import pool from "../config/db.js";

// 1. Insert a new review
export const insertReview = async (
  bookingId,
  customerId,
  providerId,
  rating,
  comment
) => {
  const query = `
    INSERT INTO Reviews (booking_id, customer_id, provider_id, rating, comment) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [
    bookingId,
    customerId,
    providerId,
    rating,
    comment,
  ]);
  return result.insertId;
};

// 2. Get all reviews for a specific provider (includes customer name)
export const getReviewsByProvider = async (providerId) => {
  const query = `
    SELECT r.id, r.rating, r.comment, r.created_at, u.name as customer_name 
    FROM Reviews r
    JOIN Users u ON r.customer_id = u.id
    WHERE r.provider_id = ?
    ORDER BY r.created_at DESC
  `;
  const [rows] = await pool.query(query, [providerId]);
  return rows;
};

// 3. Get average rating for a provider
export const getProviderAverageRating = async (providerId) => {
  const query =
    "SELECT AVG(rating) as averageRating, COUNT(*) as totalReviews FROM Reviews WHERE provider_id = ?";
  const [rows] = await pool.query(query, [providerId]);
  return rows[0];
};

// 4. Check if a review already exists for a booking
export const getReviewByBookingId = async (bookingId) => {
  const query = "SELECT * FROM Reviews WHERE booking_id = ?";
  const [rows] = await pool.query(query, [bookingId]);
  return rows[0];
};
