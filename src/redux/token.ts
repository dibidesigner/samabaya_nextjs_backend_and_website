import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../Apicall/apiInstance";
import ApiList from "../Apicall/ApiList";

export const tokenSliceapicall = createAsyncThunk(
  "token/fetchtoken",
  async () => {
    const res = await axiosInstance.get(ApiList.token);
    return res.data;
  }
);

interface tokenType{
  success:Boolean
}
interface stateType{
  token:tokenType | null,
  tokenloading:Boolean
}

const initialState: stateType={
  token: null,
  tokenloading: false,
}

const tokenSlice = createSlice({
  name: "tokenslice",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(tokenSliceapicall.pending, (state) => {
        state.tokenloading = true;
      })
      .addCase(tokenSliceapicall.fulfilled, (state, action) => {
        state.token = action.payload;
        state.tokenloading = false;
      })
      .addCase(tokenSliceapicall.rejected, (state, action) => {
        state.tokenloading = false;
      }),
});

export default tokenSlice.reducer;
