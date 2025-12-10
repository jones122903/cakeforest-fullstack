import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: true, // Chrome Redux DevTools use panna
});

export default store;
