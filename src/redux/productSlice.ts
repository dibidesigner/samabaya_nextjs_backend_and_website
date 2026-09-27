import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductItem } from "./productType";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";

/* ---------------- Types ---------------- */

interface Filters {
  categories: string[];
  priceRange: [number, number];
  rating: number;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

interface ProductState {
  products: ProductItem[];
  filters: Filters;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

/* ---------------- Initial State ---------------- */

const initialState: ProductState = {
  products: [],
  filters: {
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
  },
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
  },
  loading: false,
  error: null,
};

/* ---------------- Thunk ---------------- */

export const fetchProductList = createAsyncThunk(
  "product/fetchList",
  async (_, { getState }) => {
    const state = getState() as { productList: ProductState };
    const { filters, pagination } = state.productList;

    const res = await axiosInstance.get(ApiList.productList, {
      params: {
        categories: filters.categories,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        rating: filters.rating,
        page: pagination.page,
        limit: pagination.limit,
      },
    });

    return {
      products: res.data.allproduct as ProductItem[],
      totalPages: res.data.totalPages,
      totalCount: res.data.totalCount,
    };
  }
);

/* ---------------- Slice ---------------- */

const product = createSlice({
  name: "productlist",
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const idx = state.filters.categories.indexOf(action.payload);
      if (idx >= 0) {
        state.filters.categories.splice(idx, 1);
      } else {
        state.filters.categories.push(action.payload);
      }
      state.pagination.page = 1;
    },

    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload;
      state.pagination.page = 1;
    },

    setRating: (state, action: PayloadAction<number>) => {
      state.filters.rating = action.payload;
      state.pagination.page = 1;
    },

    clearFilters: (state) => {
      state.filters = { categories: [], priceRange: [0, 1000], rating: 0 };
      state.pagination.page = 1;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.totalCount = action.payload.totalCount;
        state.loading = false;
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

/* ---------------- Exports ---------------- */

export const {
  toggleCategory,
  setPriceRange,
  setRating,
  clearFilters,
  setPage,
} = product.actions;

export default product.reducer;
