// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/redux/slices/dashboardSlice.js
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://ehub-c95q.onrender.com/api/orders/';

const initialState = {
    orders: [],
    totalSales: 0,
    totalRevenue: 0,
    isError: false,
    isLoading: false,
    message: '',
};

const getToken = (thunkAPI) => {
    return thunkAPI.getState().auth.user?.token;
}

export const getSellerOrders = createAsyncThunk('dashboard/getAllOrders', async (_, thunkAPI) => {
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

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // FIX: Rename reset to be unique
        resetDashboard: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSellerOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSellerOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
                state.totalSales = action.payload.length;
                state.totalRevenue = action.payload.reduce((acc, order) => acc + order.totalAmount, 0);
            })
            .addCase(getSellerOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

// FIX: Export the new unique action name
export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
