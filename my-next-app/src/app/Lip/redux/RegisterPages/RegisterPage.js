
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// إرسال بيانات إنشاء الحساب إلى Backend
export const RegisterPages = createAsyncThunk(
  "register/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل إنشاء الحساب"
        );
      }

      return result;
    } catch (error) {
      return rejectWithValue("حدث خطأ في الاتصال بالسيرفر");
    }
  }
);

// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

// Slice
const registerSlice = createSlice({
  name: "register",
  initialState,

  reducers: {
    clearRegisterState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(RegisterPages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(RegisterPages.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user || action.payload.data || null;
      })

      .addCase(RegisterPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
        state.success = false;
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;

export default registerSlice.reducer;
