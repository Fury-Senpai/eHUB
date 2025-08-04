import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products/';
const initialState = {
  products: [],
  product: {},
  page: 1,
  pages: 1,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const getToken = (thunkAPI) => thunkAPI.getState().auth.user?.token;

export const getProducts = createAsyncThunk('products/getAll', async ({ keyword = '', pageNumber = '' }, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}?keyword=${keyword}&pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getProductById = createAsyncThunk('products/getById', async (productId, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + productId);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const createProduct = createAsyncThunk('products/create', async (productData, thunkAPI) => {
    try {
        const token = getToken(thunkAPI);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL, productData, config);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
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

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, thunkAPI) => {
    try {
        const token = getToken(thunkAPI);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(API_URL + id, productData, config);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});


export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProducts: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => { state.isLoading = true; })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProductById.pending, (state) => { state.isLoading = true; })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.products = state.products.map((p) =>
              p._id === action.payload._id ? action.payload : p
          );
      })
      .addCase(updateProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      });
  },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
