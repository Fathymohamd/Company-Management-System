
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const customer_orders = createAsyncThunk(
  "customer/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://company-management-system-phi.vercel.app/api/customer_orders"
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل جلب الطلبات"
        );
      }

      return result;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "customer/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://company-management-system-phi.vercel.app/api/customer_orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل تحديث حالة الطلب"
        );
      }

      return result.order;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);


export const productName = createAsyncThunk(
  "search/productName",
  async (customer_name, { rejectWithValue }) => {
    try {
const response = await fetch(
  `https://company-management-system-phi.vercel.app/api/product/search?customer_name=${encodeURIComponent(customer_name)}`
);

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "Failed to fetch employees"
        );
      }

      return result;
    } catch (error) {
      console.error("Search employees error:", error);

      return rejectWithValue("Unable to connect to the server");
    }
  }
);


const employeesSlice = createSlice({
  name: "customer",

  initialState: {
    data: [],
    product:[],
    loading: false,
    error: null,
  },

  reducers: {
    remove: (state, action) => {
      state.data = state.data.filter(
        (item) => item.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
     
      .addCase(customer_orders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(customer_orders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(customer_orders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "حدث خطأ أثناء جلب الطلبات";
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;

        state.data = state.data.map((item) =>
          item.id === updatedOrder.id ? updatedOrder : item
        );


builder

        .addCase(productName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(productName.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })

      .addCase(productName.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "حدث خطأ أثناء البحث";
      });



      });
  },
});

export const { remove } = employeesSlice.actions;

export default employeesSlice.reducer;
