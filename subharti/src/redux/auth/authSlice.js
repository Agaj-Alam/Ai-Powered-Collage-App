import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { enrollment, dob, role } = payload;
      const data = await loginApi(enrollment, dob, role);
      
      if (data && data.token) {
        await AsyncStorage.setItem("token", data.token);
        return data;
      } else {
        return rejectWithValue(data.message || "Login failed: No token received");
      }
    } catch (err) {
      console.log("Login Error:", err);
      const message = err.response?.data?.message || err.message || "Network Error";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    role: null,
    designation: null,
    loading: false,
    error: null,
    user: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.designation = null;
      state.user = null;
      AsyncStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.designation = action.payload.user.designation;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;