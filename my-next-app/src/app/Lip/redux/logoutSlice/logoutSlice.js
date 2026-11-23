
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = "http://localhost:8080"


export const LogoutUser = createAsyncThunk(
  "logout/LogoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout Slice
const LogoutName = createSlice({
  name: "logout",

  initialState: {
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    resetLogout: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(LogoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(LogoutUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(LogoutUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetLogout } = LogoutName.actions;

export default LogoutName.reducer;
