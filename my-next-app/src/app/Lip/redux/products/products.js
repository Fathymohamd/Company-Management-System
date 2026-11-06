
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://company-management-system-phi.vercel.app/api/product";


export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message || "فشل تحميل المنتجات");
      }

      return result.data ;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (name, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/Search?name=${encodeURIComponent(name)}`
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل البحث عن المنتجات"
        );
      }

      return result;
    } catch (error) {
      console.error("Search Error:", error);

      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

// 3. إضافة منتج
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (form, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل إضافة المنتج"
        );
      }

      return result.data;

    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

// 4. حذف منتج
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message || "فشل حذف المنتج");
      }

      return id;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

// 5. تعديل منتج
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, ...form }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message || "فشل تعديل المنتج");
      }

      return { id, ...form, ...(result.data ?? {}) };
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

const initialState = {
  data: [],
  search: [],
  loading: false,
  error: null,
  success: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    clearProductSearch: (state) => {
      state.search = [];
    },

    clearProductError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // جلب المنتجات
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // البحث
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.search = action.payload.data || [];
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // الإضافة
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload?.id) {
          state.data.unshift(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // الحذف
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // التعديل
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.data = state.data.map((product) =>
          product.id === action.payload.id
            ? { ...product, ...action.payload }
            : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductSearch, clearProductError } =
  productsSlice.actions;

export default productsSlice.reducer;
