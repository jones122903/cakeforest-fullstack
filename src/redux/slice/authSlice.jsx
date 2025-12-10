import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      // Save in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    clearToken: (state) => {
      state.token = null;
      state.user = null;

      // Remove from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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


