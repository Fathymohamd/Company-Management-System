
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const LoginPages = createAsyncThunk(
  "Login/LoginUser",

  async (form, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل تسجيل الدخول"
        );
      }

      return result.user;

    } catch (error) {
      return rejectWithValue(
        "حدث خطأ في الاتصال بالسيرفر"
      );
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

// Login Slice
const loginSlice = createSlice({
  name: "login",

  initialState,

  reducers: {
    resetLogin: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // Loading
      .addCase(LoginPages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      // Success
      .addCase(LoginPages.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
      })

      // Error
      .addCase(LoginPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل تسجيل الدخول";
        state.success = false;
      });
  },
});

export const { resetLogin } = loginSlice.actions;

export default loginSlice.reducer;
