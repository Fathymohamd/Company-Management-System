import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
    
      const response = await fetch("https://company-management-system-phi.vercel.app/api/orders");

      const result = await response.json();

      if (!response.ok || !result.success) {
        return rejectWithValue(
          result.message || "فشل تحميل الطلبات"
        );
      }

      return result.data;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",

  initialState: {
    data: [],
    loading: false,
    error: null,
  },

  reducers: {
    remove: (state, action) => {
      state.data = state.data.filter(
        (order) => order.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ أثناء تحميل الطلبات";
      });

  },
});

export const { remove } = ordersSlice.actions;
export default ordersSlice.reducer;