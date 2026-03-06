import pool from "../config/db.js";

// 1. Create a new profile
export const insertProviderProfile = async (userId, categoryId, bio) => {
  const query =
    "INSERT INTO Provider_Profiles (user_id, category_id, bio) VALUES (?, ?, ?)";
  const [result] = await pool.query(query, [userId, categoryId, bio]);
  return result.insertId;
};

// 2. Get a specific provider's profile (using their user_id)
export const getProviderByUserId = async (userId) => {
  const query = "SELECT * FROM Provider_Profiles WHERE user_id = ?";
  const [rows] = await pool.query(query, [userId]);
  return rows[0];
};

// 3. Update bio and category
export const updateProviderProfileInDB = async (userId, categoryId, bio) => {
  const query =
    "UPDATE Provider_Profiles SET category_id = ?, bio = ? WHERE user_id = ?";
  await pool.query(query, [categoryId, bio, userId]);
};

// 4. Toggle Availability (For the Provider)
export const toggleAvailabilityInDB = async (userId, isAvailable) => {
  const query =
    "UPDATE Provider_Profiles SET is_available = ? WHERE user_id = ?";
  await pool.query(query, [isAvailable, userId]);
};

// 5. Approve Provider (For the Admin)
export const approveProviderInDB = async (profileId, isApproved) => {
  const query = "UPDATE Provider_Profiles SET is_approved = ? WHERE id = ?";
  await pool.query(query, [isApproved, profileId]);
};

// 6. Fetch all approved & available providers (For Customers browsing)
export const getAllApprovedProviders = async (categoryId = null) => {
  let query = `
    SELECT p.id as profile_id, u.name, u.email, c.name as category_name, p.bio 
    FROM Provider_Profiles p
    JOIN Users u ON p.user_id = u.id
    JOIN Categories c ON p.category_id = c.id
    WHERE p.is_approved = TRUE AND p.is_available = TRUE
  `;

  const params = [];
  if (categoryId) {
    query += " AND p.category_id = ?";
    params.push(categoryId);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};
