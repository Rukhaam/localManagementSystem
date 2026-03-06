import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProvidersAdminAPI,
  approveProviderAPI,
  createCategoryAPI,
  deleteCategoryAPI,
} from "../../api/adminApi";

export const fetchAllProviders = createAsyncThunk(
  "admin/fetchAllProviders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllProvidersAdminAPI();
      return response.providers;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load providers"
      );
    }
  }
);

export const toggleProviderApproval = createAsyncThunk(
  "admin/toggleApproval",
  async ({ profileId, isApproved }, { rejectWithValue }) => {
    try {
      const response = await approveProviderAPI(profileId, isApproved);
      return { profileId, isApproved, message: response.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update approval"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "admin/createCategory",
  async (categoryData, { dispatch, rejectWithValue }) => {
    try {
      const response = await createCategoryAPI(categoryData);
      dispatch(fetchCategories()); // Refresh the public category list
      return response.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteCategoryAPI(id);
      dispatch(fetchCategories()); // Refresh the public category list
      return response.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    providers: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAdminMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  reducers: {
    clearAdminMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProviders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProviders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providers = action.payload;
      })
      .addCase(toggleProviderApproval.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        const index = state.providers.findIndex(
          (p) => p.profile_id === action.payload.profileId
        );
        if (index !== -1) {
          state.providers[index].is_approved = action.payload.isApproved
            ? 1
            : 0;
        }
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.successMessage = action.payload;
      });
  },
});

export const { clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;
