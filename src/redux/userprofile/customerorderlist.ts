import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Order {
  _id: string;
  productName: string;
  quantity: number;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerOrderState {
  customerorderlist: Order[];
  customerorderloading: boolean;
  error: string | null;
}

const initialState: CustomerOrderState = {
  customerorderlist: [],
  customerorderloading: false,
  error: null,
};

export const fetchCustomerOrderlist = createAsyncThunk<Order[]>(
  "fetch/customerorder",
  async () => {
    const res = await axiosInstance.get(ApiList.placeorder);
    return res.data?.orderlist as Order[];
  }
);

const customerOrderSlice = createSlice({
  name: "fetchCustomerorderlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerOrderlist.pending, (state) => {
        state.customerorderloading = true;
        state.error = null;
      })
      .addCase(
        fetchCustomerOrderlist.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.customerorderlist = action.payload;
          state.customerorderloading = false;
        }
      )
      .addCase(fetchCustomerOrderlist.rejected, (state, action) => {
        state.customerorderloading = false;
        state.error = action.error.message || "Failed to fetch orders";
      });
  },
});

export default customerOrderSlice.reducer;
