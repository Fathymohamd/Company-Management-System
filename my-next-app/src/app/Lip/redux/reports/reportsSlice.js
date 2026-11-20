
import { createSlice } from "@reduxjs/toolkit";

import {
  fetchReports,
  createReport,
} from "./reportsThunk";

const initialState = {
  reports: [],
  loading: false,
  saving: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })

      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Create Report
      .addCase(createReport.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(createReport.fulfilled, (state, action) => {
        state.saving = false;
        state.reports.unshift(action.payload);
      })

      .addCase(createReport.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearReportsError } = reportsSlice.actions;

export default reportsSlice.reducer;
