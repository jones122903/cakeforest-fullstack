import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks
export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist/${userId}`);
        return response.data.wishlist;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
});

export const addToWishlistAsync = createAsyncThunk("wishlist/addToWishlist", async ({ userId, productId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/wishlist/add`, { userId, productId });
        return response.data.wishlist;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
});

export const removeFromWishlistAsync = createAsyncThunk("wishlist/removeFromWishlist", async ({ userId, productId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/wishlist/remove`, { userId, productId });
        return response.data.wishlist;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
    }
});

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [],
        status: "idle",
        error: null,
    },
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            state.status = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.items = action.payload; // payload is array of products/IDs
            })
            // Add
            .addCase(addToWishlistAsync.fulfilled, (state, action) => {
                state.items = action.payload; // updated list of IDs
            })
            // Remove
            .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
                state.items = action.payload; // updated list of IDs
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
