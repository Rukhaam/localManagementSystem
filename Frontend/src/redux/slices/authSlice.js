import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Will hold { id, name, email, role } when logged in
  isAuthenticated: false,
  isLoading: false, // We'll use this later when fetching the user session on reload
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Call this when the login API request succeeds
    setCredentials: (state, action) => {
      state.user = action.payload; // The user object from your backend
      state.isAuthenticated = true;
    },
    // Call this when the user clicks "Logout"
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    // Call this if we need to show a spinner while checking the session
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;