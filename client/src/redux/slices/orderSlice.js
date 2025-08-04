// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/redux/slices/orderSlice.js
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { resetCart } from './cartSlice'; // We use this to clear the cart after an order

const API_URL = 'https://ehub-c95q.onrender.com/api/orders/';

const initialState = {
    orders: [],
    order: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const getToken = (thunkAPI) => {
    return thunkAPI.getState().auth.user?.token;
}

export const createOrder = createAsyncThunk('orders/create', async (orderData, thunkAPI) => {
    try {
        const token = getToken(thunkAPI);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(API_URL, orderData, config);
        thunkAPI.dispatch(resetCart());
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // FIX: Rename reset to be unique
        resetOrder: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

// FIX: Export the new unique action name
export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
