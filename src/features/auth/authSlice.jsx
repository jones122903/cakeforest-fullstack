import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;



dispatch(clearToken());


import { useSelector } from "react-redux";

const token = useSelector((state) => state.auth.token);

axios.get("/products", {
  headers: { Authorization: `Bearer ${token}` }
});


import { useDispatch } from "react-redux";
import { setToken } from "../features/auth/authSlice";

const dispatch = useDispatch();

axios.post("/login", data).then((res) => {
  dispatch(setToken(res.data.token));
});


