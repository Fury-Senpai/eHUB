    // ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
    //      File: client/src/redux/slices/categorySlice.js
    // ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
    import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
    import axios from 'axios';

    const API_URL = 'https://ehub-c95q.onrender.com/api/categories/';

    const initialState = {
        categories: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    };

    const getToken = (thunkAPI) => thunkAPI.getState().auth.user?.token;

    export const getCategories = createAsyncThunk('categories/getAll', async (_, thunkAPI) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            const message = (error.response?.data?.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    });

    export const createCategory = createAsyncThunk('categories/create', async (categoryData, thunkAPI) => {
        try {
            const token = getToken(thunkAPI);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(API_URL, categoryData, config);
            return response.data;
        } catch (error) {
            const message = (error.response?.data?.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    });

    export const deleteCategory = createAsyncThunk('categories/delete', async (id, thunkAPI) => {
        try {
            const token = getToken(thunkAPI);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(API_URL + id, config);
            return id;
        } catch (error) {
            const message = (error.response?.data?.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    });


    export const categorySlice = createSlice({
        name: 'categories',
        initialState,
        reducers: {
            // FIX: This function should reset the entire state to its initial value.
            resetCategories: (state) => initialState
        },
        extraReducers: (builder) => {
            builder
                .addCase(getCategories.pending, (state) => { state.isLoading = true; })
                .addCase(getCategories.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.categories = action.payload;
                })
                .addCase(getCategories.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload;
                })
                .addCase(createCategory.pending, (state) => { state.isLoading = true; })
                .addCase(createCategory.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isSuccess = true;
                    // This will now work correctly because the state is always predictable.
                    state.categories.push(action.payload);
                })
                .addCase(createCategory.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload;
                })
                .addCase(deleteCategory.pending, (state) => { state.isLoading = true; })
                .addCase(deleteCategory.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.categories = state.categories.filter((cat) => cat._id !== action.payload);
                })
                .addCase(deleteCategory.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload;
                });
        },
    });

    export const { resetCategories } = categorySlice.actions;
    export default categorySlice.reducer;
