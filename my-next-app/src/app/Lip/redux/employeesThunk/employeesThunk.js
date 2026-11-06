
import { createAsyncThunk } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";



export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://company-management-system-phi.vercel.app/api/employeesThunk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل إضافة العامل"
        );
      }

      return result.employee || result;
    } catch (error) {
      console.error("Add employee error:", error);

  return res.status(500).json({
    message: error.sqlMessage || error.message || "حدث خطأ أثناء إضافة العامل",
  })
    }
  }
);



export const formData = createAsyncThunk(
  "employees/formData",
  async (form, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://company-management-system-phi.vercel.app/api/formData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل إضافة الطلب"
        );
      }

     return result.customer_orders;
    } catch (error) {
      console.error("Add order error:", error);

      return rejectWithValue(
        "تعذر الاتصال بالسيرفر"
      );
    }
  }
);


const initialState = {
  employees: [],
  formData : [],
  loading: false,
  error: null,
  success: false,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
 
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })


      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.employees.push(action.payload);
      })

    
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "حدث خطأ أثناء إضافة العامل";
      });



          builder
 
      .addCase(formData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })


      .addCase(formData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.formData.push(action.payload);
      })

    
      .addCase(formData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "حدث خطأ أثناء إضافة العامل";
      });
  },
});

export const { clearStatus } = employeesSlice.actions;

export default employeesSlice.reducer;
