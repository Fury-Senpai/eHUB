
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://ehub-c95q.onrender.com/api/cart/';
const initialState = {
    cartItems: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const getToken = (thunkAPI) => {
    
    return thunkAPI.getState().auth.user?.token;
}

export const addToCart = createAsyncThunk('cart/add', async (itemData, thunkAPI) => {
    try {
        const token = getToken(thunkAPI);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(API_URL, itemData, config);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getCart = createAsyncThunk('cart/getAll', async (_, thunkAPI) => {
    try {
        const token = getToken(thunkAPI);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, thunkAPI) => {
    try {
        const token = getToken(thunkAPI);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(API_URL + productId, config);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      
        resetCart: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => { state.isLoading = true; })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cartItems = action.payload.items;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getCart.pending, (state) => { state.isLoading = true; })
            .addCase(getCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cartItems = action.payload.items;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(removeFromCart.pending, (state) => { state.isLoading = true; })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cartItems = action.payload.items;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});


export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
