import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const search = createAsyncThunk(
  "search/fetchEmployees",
  async (name, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://company-management-system-phi.vercel.app/api/searchRouter/search?name=${encodeURIComponent(name)}`
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



export const orderSearch = createAsyncThunk(
  "search/orderSearch",
  async (name, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://company-management-system-phi.vercel.app/api/orderSearch/search?name=${encodeURIComponent(name)}`
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


const searchSlice = createSlice({
  name: "search",

  initialState: {
    employees: [],
    order:[],
    loading: false,
    error: null,
  },

  reducers: {
    clearSearch: (state) => {
      state.employees = [];
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(search.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(search.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })

      .addCase(search.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "حدث خطأ أثناء البحث";
      });

builder

        .addCase(orderSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(orderSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })

      .addCase(orderSearch.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "حدث خطأ أثناء البحث";
      });


  },
});

export const { clearSearch } = searchSlice.actions;

export default searchSlice.reducer;