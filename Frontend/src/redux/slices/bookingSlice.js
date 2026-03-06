import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyBookingsAPI,
  updateBookingStatusAPI,
  requestBookingAPI,
  completeJobAPI,
} from "../../api/bookingApi";

// 1. ASYNC THUNKS
export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyBookingsAPI();
      return response.bookings; // Returns the array of bookings
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load bookings"
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const response = await updateBookingStatusAPI(bookingId, status);
      return { bookingId, status, message: response.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);
export const completeJob = createAsyncThunk(
  "bookings/completeJob",
  async ({ bookingId, formData }, { rejectWithValue }) => {
    try {
      const response = await completeJobAPI(bookingId, formData);
      return { bookingId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to complete job"
      );
    }
  }
);
export const requestBooking = createAsyncThunk(
  "bookings/requestBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await requestBookingAPI(bookingData);
      return response; // Contains success message and new bookingId
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to request booking"
      );
    }
  }
);

// 2. THE SLICE
const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    items: [], // Array of booking objects
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBookingMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload; // Save the bookings to Redux
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        // Find the booking in our Redux array and update its status instantly
        const index = state.items.findIndex(
          (b) => b.id === action.payload.bookingId
        );
        if (index !== -1) {
          state.items[index].status = action.payload.status;
        }
      })
      .addCase(completeJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(completeJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        const index = state.items.findIndex(
          (b) => b.id === action.payload.bookingId
        );
        if (index !== -1) {
          state.items[index].status = "Completed"; // Update status locally
        }
      })
      .addCase(completeJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(requestBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(requestBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(requestBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingMessages } = bookingSlice.actions;
export default bookingSlice.reducer;
