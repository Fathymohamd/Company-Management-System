import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ================= Get All Expenses =================

export const setExpensesData = createAsyncThunk(
  "expenses/setExpensesData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/expenses`);
      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "Failed to fetch expenses"
        );
      }

      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Search Expenses =================

export const ExpensesSearch = createAsyncThunk(
  "expenses/ExpensesSearch",
  async (title, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/expenses/search?title=${encodeURIComponent(title)}`
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "Failed to search expenses"
        );
      }

      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Add Expense =================

export const addExpenseThunk = createAsyncThunk(
  "expenses/addExpense",
  async (expense, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "Failed to add expense"
        );
      }

      return result.order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Update Expense =================

export const updateExpenseThunk = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, ...expense }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "Failed to update expense"
        );
      }

      return result.material;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Delete Expense =================

export const deleteExpenseThunk = createAsyncThunk(
  "expenses/deleteExpense",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "Failed to delete expense"
        );
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Initial State =================

const initialState = {
  data: [],
  search: [],
  loading: false,
  error: null,
};

// ================= Expenses Slice =================

const expensesSlice = createSlice({
  name: "expenses",
  initialState,

  reducers: {
    setExpenses: (state, action) => {
      state.data = action.payload;
    },

    clearSearch: (state) => {
      state.search = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // Get Expenses
      .addCase(setExpensesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(setExpensesData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })

      .addCase(setExpensesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Search Expenses
      .addCase(ExpensesSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(ExpensesSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.search = action.payload || [];
      })

      .addCase(ExpensesSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Add Expense
      .addCase(addExpenseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addExpenseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })

      .addCase(addExpenseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update Expense
      .addCase(updateExpenseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateExpenseThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.data = state.data.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })

      .addCase(updateExpenseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete Expense
      .addCase(deleteExpenseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteExpenseThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.data = state.data.filter(
          (item) => item.id !== action.payload
        );
      })

      .addCase(deleteExpenseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// ================= Export Actions =================

export const {
  setExpenses,
  clearSearch,
} = expensesSlice.actions;

export default expensesSlice.reducer;