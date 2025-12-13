import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import wishlistReducer from "./slice/wishlistSlice";

import storage from "redux-persist/lib/storage"; // localStorage
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
};

// all reducers combine
const rootReducer = combineReducers({
  auth: authReducer,
  wishlist: wishlistReducer,
});

// persist reducer create
const persistedReducer = persistReducer(persistConfig, rootReducer);

// final store
const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
});

// export persistor
export const persistor = persistStore(store);

export default store;
