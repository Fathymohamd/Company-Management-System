
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:8080/api/customers_data";



export const fetchCustomers = createAsyncThunk(
  "customers_data/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "فشل في جلب العملاء"
        );
      }

      return Array.isArray(data) ? data : data.customers;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

export const handle_search = createAsyncThunk(
  "customers_data/handleSearch",
  async (name, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/search?name=${encodeURIComponent(name)}`
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "فشل في البحث عن العملاء"
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);


export const addCustomer = createAsyncThunk(
  "customers_data/addCustomer",
  async (form, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "فشل في إضافة العميل"
        );
      }

      return data.customer;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers_data/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "فشل في حذف العميل"
        );
      }

      return id;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);






export const updateCustomer = createAsyncThunk(
  "customers_data/updateCustomer",
  async ({ id, ...customer }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "فشل في تعديل بيانات العميل"
        );
      }

      return data.customer;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);


const initialState = {
  data: [],
  Search:[],
  loading: false,
  error: null,
  success: false,
};


const customersDataSlice = createSlice({
  name: "customers",
  initialState,

  reducers: {
    clearCustomersError: (state) => {
      state.error = null;
    },

    clearCustomersSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })


        .addCase(handle_search.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handle_search.fulfilled, (state, action) => {
        state.loading = false;
        state.Search = action.payload;
      })
      .addCase(handle_search.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في حذف العميل";
      })



      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.data.unshift(action.payload);
        }
        state.success = true;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في إضافة العميل";
      })

      // حذف عميل
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(
          (customer) => customer.id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في حذف العميل";
      })

      // تعديل بيانات عميل
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;

        const updatedCustomer = action.payload;

        if (updatedCustomer) {
          const index = state.data.findIndex(
            (customer) => customer.id === updatedCustomer.id
          );

          if (index !== -1) {
            state.data[index] = updatedCustomer;
          }
        }

        state.success = true;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في تعديل العميل";
      });
  },
});

export const {
  clearCustomersError,
  clearCustomersSuccess,
} = customersDataSlice.actions;

export default customersDataSlice.reducer;
