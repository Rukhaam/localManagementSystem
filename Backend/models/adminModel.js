import db from "../config/db.js"; 

class AdminModel {
  static async getAllUsers() {
    const query = `
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    const [users] = await db.query(query);
    return users;
  }

  static async getAllBookings() {
    const query = `
      SELECT b.*, 
             customer.name AS customer_name, 
             provider.name AS provider_name
      FROM bookings b
      LEFT JOIN users customer ON b.customer_id = customer.id
      LEFT JOIN users provider ON b.provider_id = provider.id
      ORDER BY b.created_at DESC
    `;
    const [bookings] = await db.query(query);
    return bookings;
  }
}

export default AdminModel;