import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:3000/api";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Y3NTJjNGQ4NDE1ZGJiMmQxNDZkNjIiLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc0NDM0ODYxNCwiZXhwIjoxNzQ0NDM1MDE0fQ.h0zSXabYwd6dfhiCCYyGkercfxBsUCK58jkh9WE66UY"

interface ISupplier {
    name: string;
    manager: string;
    phoneNo: string;
    email: string;
    address: string;
}

interface ItemDetails {
    name: string;
    eanCode: string;
    brand: string;
    sex: string;
    itemCode: string;
    ml: string;
    type: string;
    subtype: string;
}

interface PricingTiers {
    priceA: number;
    priceB: number;
    priceC: number;
    priceD: number;
}

interface StockInfo {
    quantity: number;
    cost: number;
    freight: number;
    duty: number;
    landed: number;
    minimumPrice: number;
    pricing: PricingTiers;
    meanCP: number;
    totalValue: number;
}

interface Product {
    _id: string,
    itemDetails: ItemDetails;
    stockInfo?: StockInfo;
    supplier: ISupplier;
    imageUrl?: string;
    imagePublicId?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
    currentProduct: Product | null;
}

const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null,
    currentProduct: null,
};


export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async ({ page = 1, limit = 10, q, sort, inventoryType }: { page?: number; limit?: number, q?: string, sort?: string, inventoryType?: string }, thunkAPI) => {
        try {
            const rawParams = { page, limit, q, sort, inventoryType };
            const params = Object.fromEntries(
                Object.entries(rawParams).filter(([_, value]) => value !== "" && value !== undefined)
            );

            const response = await axios.get(`${baseUrl}/products`, {
                params,
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            });
            return response.data.products; // Adjust depending on your API structure
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

export const addProduct = createAsyncThunk(
    "products/addProduct",
    async (newProduct: Omit<Product, "_id">, thunkAPI) => {
        try {
            const response = await axios.post(`${baseUrl}/products`, newProduct);
            return response.data.product;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add product");
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async (updatedProduct: Product, thunkAPI) => {
        try {
            const response = await axios.put(`${baseUrl}/products/${updatedProduct._id}`, updatedProduct);
            return response.data.product;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update product");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (productId: string, thunkAPI) => {
        try {
            await axios.delete(`${baseUrl}/products/${productId}`);
            return productId;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete product");
        }
    }
);


const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setCurrentProductById: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            const product = state.products.find(p => p._id === productId) || null;
            state.currentProduct = product;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchProducts.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                // alert(action.payload[0]._id)
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.products.push(action.payload);
            })

            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) state.products[index] = action.payload;
            })

            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
                state.products = state.products.filter(p => p._id !== action.payload);
            });
    },
});

export const { setCurrentProductById } = productsSlice.actions;
export default productsSlice.reducer;
