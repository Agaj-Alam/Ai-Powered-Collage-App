import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import userReducer from "./userSlice";
import leaveReducer from "./leaveSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    leave: leaveReducer,
  },
});
