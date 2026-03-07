import pool from "../config/db.js";

// 1. Create a new booking request (🌟 NOW INCLUDES PHONE NUMBER)
export const insertBooking = async (
  customerId,
  providerId,
  categoryId,
  phoneNumber, // 🌟 ADDED HERE
  address,
  scheduledDate,
  notes
) => {
  const query = `
    INSERT INTO Bookings (customer_id, provider_id, category_id, phone_number, address, scheduled_date, notes, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Requested')
  `;
  const [result] = await pool.query(query, [
    customerId,
    providerId,
    categoryId,
    phoneNumber, // 🌟 ADDED HERE
    address,
    scheduledDate,
    notes,
  ]);
  return result.insertId;
};

// 2. Get a booking by ID
export const getBookingById = async (bookingId) => {
  const query = "SELECT * FROM Bookings WHERE id = ?";
  const [rows] = await pool.query(query, [bookingId]);
  return rows[0];
};

// 3. Update Status
export const updateBookingStatusInDB = async (bookingId, status) => {
  const query = "UPDATE Bookings SET status = ? WHERE id = ?";
  await pool.query(query, [status, bookingId]);
};

// 4. Complete Job (With Images)
export const completeBookingInDB = async (
  bookingId,
  beforeImageUrl,
  afterImageUrl
) => {
  const query =
    "UPDATE Bookings SET status = 'Completed', before_image_url = ?, after_image_url = ? WHERE id = ?";
  await pool.query(query, [beforeImageUrl, afterImageUrl, bookingId]);
};

// 5. Get Bookings for a User (Dynamically handles Customer or Provider)
export const getUserBookings = async (userId, role) => {
  const column = role === "provider" ? "provider_id" : "customer_id";

  const query = `
    SELECT b.*, 
           c.name as category_name, 
           cust.name as customer_name, 
           prov.name as provider_name
    FROM Bookings b
    JOIN Categories c ON b.category_id = c.id
    JOIN Users cust ON b.customer_id = cust.id
    JOIN Users prov ON b.provider_id = prov.id
    WHERE b.${column} = ?
    ORDER BY b.scheduled_date DESC
  `;

  const [rows] = await pool.query(query, [userId]);
  return rows;
};