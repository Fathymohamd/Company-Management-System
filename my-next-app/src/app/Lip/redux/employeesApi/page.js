
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/employees`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        return rejectWithValue(
          result.message || "Failed to fetch employees"
        );
      }

      return result.data;
    } catch (error) {
  
    
    }
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
  remove: (state, action) => {
    state.data = state.data.filter(
      (data) => data.id !== action.payload
    );
  },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong";
      });
  },
});

export const { remove } = employeesSlice.actions;

export default employeesSlice.reducer;
