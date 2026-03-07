import AdminModel from "../models/adminModel.js";

// 🌟 Controller to handle fetching users
export const getAllUsers = async (req, res) => {
  try {
    const users = await AdminModel.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getAllUsers controller:", error);
    res.status(500).json({ message: "Server error while fetching users." });
  }
};

// 🌟 Controller to handle fetching bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await AdminModel.getAllBookings();
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error in getAllBookings controller:", error);
    res.status(500).json({ message: "Server error while fetching bookings." });
  }
};