
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/employees/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل حذف العامل"
        );
      }

      return id;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

const employeesSlice = createSlice({
  name: "employeesDELETE",

  initialState: {
    employees: [],
    loading: false,
    error: null,
  },

reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
         
        state.employees = state.employees.filter(
          (employee) => employee.id !== action.payload
        );
      })

      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});



export default employeesSlice.reducer;
