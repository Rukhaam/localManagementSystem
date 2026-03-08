import pool from "../config/db.js";

// 1. Create a new profile
export const insertProviderProfile = async (userId, categoryId, bio) => {
  const query =
    "INSERT INTO provider_profiles (user_id, category_id, bio) VALUES (?, ?, ?)";
  const [result] = await pool.query(query, [userId, categoryId, bio]);
  return result.insertId;
};

// 2. Get a specific provider's profile (using their user_id)
export const getProviderByUserId = async (userId) => {
  const query = "SELECT * FROM provider_profiles WHERE user_id = ?";
  const [rows] = await pool.query(query, [userId]);
  return rows[0];
};

// 3. Update bio and category
export const updateProviderProfileInDB = async (userId, categoryId, bio) => {
  const query =
    "UPDATE provider_profiles SET category_id = ?, bio = ? WHERE user_id = ?";
  await pool.query(query, [categoryId, bio, userId]);
};

// 4. Toggle Availability (For the Provider)
export const toggleAvailabilityInDB = async (userId, isAvailable) => {
  const query =
    "UPDATE provider_profiles SET is_available = ? WHERE user_id = ?";
  await pool.query(query, [isAvailable, userId]);
};

// 5. Approve Provider (For the Admin)
export const approveProviderInDB = async (profileId, isApproved) => {
  const query = "UPDATE provider_profiles SET is_approved = ? WHERE id = ?";
  await pool.query(query, [isApproved, profileId]);
};

// 6. Fetch all approved & available providers (For Customers browsing)
// backend/models/providerModel.js

export const getAllApprovedProviders = async (categoryId = null) => {
  let query = `
  SELECT 
    p.id as profile_id, 
    p.user_id,             
    p.category_id,        
    u.name, 
    u.email, 
    c.name as category_name, 
    p.bio,
    COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
    COUNT(r.id) AS total_reviews
  FROM provider_profiles p
  JOIN users u ON p.user_id = u.id
  JOIN categories c ON p.category_id = c.id
  LEFT JOIN reviews r ON p.user_id = r.provider_id 
  WHERE p.is_approved = TRUE AND p.is_available = TRUE
`;

  const params = [];
  if (categoryId) {
    query += " AND p.category_id = ?";
    params.push(categoryId);
  }

  query += " GROUP BY p.id, p.user_id, p.category_id, u.name, u.email, c.name, p.bio";

  const [rows] = await pool.query(query, params);
  return rows;
};

// 7. Fetch ALL providers for Admin (includes pending/unapproved)
export const getAllProvidersDB = async () => {
  const query = `
    SELECT 
      p.id as profile_id, 
      u.name, 
      u.email, 
      p.bio, 
      p.is_approved, 
      p.is_available 
    FROM provider_profiles p
    JOIN users u ON p.user_id = u.id
  `;
  const [rows] = await pool.query(query);
  return rows;
};