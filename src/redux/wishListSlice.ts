import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiList from "../Apicall/ApiList";
import {Cart,Product} from "./cartType"
import axiosInstance from "@/Apicall/apiInstance";



export const wishListSliceFetch= createAsyncThunk('fetch/wishlist',
    async ()=>{
        const cartproductlist = await axiosInstance.get(ApiList.like)
        return cartproductlist?.data?.wishlist[0]?.product || []
    }
)


interface CartState {
  wishList: Product[];
  wishlistloading: boolean;
  error: string | null;
}

const initialState: CartState = {
  wishList: [],
  wishlistloading: false,
  error: null,
};

const addtocartListSlice=createSlice({
    name:"fetchOrder",
    initialState,
    reducers:{},
    extraReducers:(build)=>{
        build
        .addCase(wishListSliceFetch.pending, (state)=>{
            state.wishlistloading=true
        })
        .addCase(wishListSliceFetch.fulfilled, (state, action)=>{
            state.wishList = action.payload
            state.wishlistloading= false
        })
        .addCase(wishListSliceFetch.rejected,(state)=>{
            state.wishlistloading = false
        })
    }
})


export default addtocartListSlice.reducer