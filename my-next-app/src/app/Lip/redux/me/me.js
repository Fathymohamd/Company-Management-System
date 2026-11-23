
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetCurrentUser = createAsyncThunk(
  "login/GetCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message);
      }

      return result.user;
    } catch (error) {
      return rejectWithValue("فشل الاتصال بالسيرفر");
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

const users =  createSlice({

initialState,

name : "userToken",

 extraReducers: (builder) => {
  builder

    .addCase(GetCurrentUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(GetCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(GetCurrentUser.rejected, (state) => {
      state.loading = false;
      state.user = null;
    });
}


})


export default users.reducer

