import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

interface AddrType {
  _id: string;
  fullname: string;
  email: string;
  mobileno: string;
  address: string;
  city: string;
  landmark: string;
  pincode: string;
}

interface AddressState {
  recordedaddress: AddrType[];
  cartloading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  recordedaddress: [],
  cartloading: false,
  error: null,
};

export const addressSliceapicall = createAsyncThunk<AddrType[]>(
  "fetch/addressapi",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(ApiList.useraddress);
      return res.data.addresses || [];
    } catch (error: any) {

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses"
      );
    }
  }
);

const addressSlice = createSlice({
  name: "addressslice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(addressSliceapicall.pending, (state) => {
        state.cartloading = true;
        state.error = null;
      })

      .addCase(addressSliceapicall.fulfilled, (state, action) => {
        state.recordedaddress = action.payload;
        state.cartloading = false;
      })

      .addCase(addressSliceapicall.rejected, (state, action) => {
        state.cartloading = false;
        state.error = action.payload as string;
      });
  },
});

export default addressSlice.reducer;