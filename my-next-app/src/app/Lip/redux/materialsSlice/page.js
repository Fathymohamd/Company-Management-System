
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:8080/api/materials";

// ================= GET MATERIALS =================

export const getMaterials = createAsyncThunk(
  "materials/getMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message || "فشل تحميل الخامات");
      }

      return result;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

// ================= ADD MATERIAL =================

export const addMaterial = createAsyncThunk(
  "materials/addMaterial",
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
        return rejectWithValue(result.message || "فشل إضافة الخامة");
      }

      return result;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

// ================= Search MATERIAL =================


export const searchMaterials = createAsyncThunk(
  "materials/searchMaterials",
  async (name, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/search?name=${encodeURIComponent(name)}`
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل البحث عن الخامات"
        );
      }

      return result;
    } catch (error) {
      console.error("Search Materials Error:", error);
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);



// ================= UPDATE MATERIAL =================

export const updateMaterial = createAsyncThunk(
  "materials/updateMaterial",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "فشل تعديل الخامة"
        );
      }

      return result;
    } catch (error) {
      console.error("Update Material Error:", error);
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);
// ================= DELETE MATERIAL =================

export const deleteMaterial = createAsyncThunk(
  "materials/deleteMaterial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message || "فشل حذف الخامة");
      }

      return id;
    } catch (error) {
      return rejectWithValue("تعذر الاتصال بالسيرفر");
    }
  }
);

// ================= INITIAL STATE =================

const initialState = {
  data: [],
  search : [],
  loading: false,
  error: null,
  success: false,
};

// ================= MATERIALS SLICE =================

const materialsSlice = createSlice({
  name: "materials",
  initialState,

  reducers: {
    clearMaterialsError: (state) => {
      state.error = null;
    },

    remove: (state, action) => {
      state.data = state.data.filter(
        (item) => item.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder

      // GET MATERIALS
      .addCase(getMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload
         
      })
      .addCase(getMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

.addCase(searchMaterials.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(searchMaterials.fulfilled, (state, action) => {
  state.loading = false;
  state.search = action.payload.data || action.payload;
})
.addCase(searchMaterials.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


      // ADD MATERIAL
      .addCase(addMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
   .addCase(addMaterial.fulfilled, (state, action) => {
    state.loading = false;
     state.data = action.payload.data;
})
      .addCase(addMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE MATERIAL
      .addCase(updateMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedMaterial = action.payload.data;

        if (updatedMaterial) {
          state.data = state.data.map((item) =>
            item.id === updatedMaterial.id ? updatedMaterial : item
          );
        }
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE MATERIAL
      .addCase(deleteMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.loading = false;
    state.data = state.data.filter(
    (item) => item.id !== action.payload
  );
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMaterialsError  , remove} = materialsSlice.actions;

export default materialsSlice.reducer;
