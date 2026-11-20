
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


// Get Reports
export const fetchReports = createAsyncThunk(
  "reports/fetchReports",

  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/reports`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        return rejectWithValue(result.message);
      }

      return result.data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Search Reports
export const searchReports = createAsyncThunk(
  "reports/searchReports",

  async (title, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/reports/search?title=${encodeURIComponent(title)}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        return rejectWithValue(result.message);
      }

      return result.data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Create Report
export const createReport = createAsyncThunk(
  "reports/createReport",

  async (report, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/reports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(report),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        return rejectWithValue(result.message);
      }

      return result.data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
