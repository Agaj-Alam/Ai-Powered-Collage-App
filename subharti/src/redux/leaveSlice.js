import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMyLeaves, fetchLeaveById } from "../services/api";

export const loadMyLeaves = createAsyncThunk(
  "leave/loadMyLeaves",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMyLeaves();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadLeaveDetails = createAsyncThunk(
  "leave/loadLeaveDetails",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchLeaveById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    leaves: [],
    currentLeave: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearLeaves: (state) => {
      state.leaves = [];
      state.currentLeave = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load my leaves
      .addCase(loadMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(loadMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load leave details
      .addCase(loadLeaveDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadLeaveDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLeave = action.payload;
      })
      .addCase(loadLeaveDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLeaves } = leaveSlice.actions;
export default leaveSlice.reducer;
