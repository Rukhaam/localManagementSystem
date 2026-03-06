import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // bookings: bookingReducer, <-- We will add this later!
    // providers: providerReducer, <-- And this!
  },
});