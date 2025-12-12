import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user.user;
    },

    clearToken: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;




// dispatch(clearToken());


// import { useSelector } from "react-redux";

// const token = useSelector((state) => state.auth.token);

// axios.get("/products", {
//   headers: { Authorization: `Bearer ${token}` }
// });


// import { useDispatch } from "react-redux";
// import { setToken } from "../features/auth/authSlice";

// const dispatch = useDispatch();

// axios.post("/login", data).then((res) => {
//   dispatch(setToken(res.data.token));
// });


