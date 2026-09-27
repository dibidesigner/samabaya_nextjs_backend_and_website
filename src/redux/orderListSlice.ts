import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {Cart} from "./cartType"
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";





export const fetchaddtocartList = createAsyncThunk('fetch/orderlist',
    async ()=>{
        const cartproductlist = await axiosInstance.get(ApiList.addToCart)
        return cartproductlist.data.cartlist || {}
    }
)


interface  CartListype{
    createdAt:string
    totalItems:number
    user:string
    _id:string

}

interface CartState {
  cartList: CartListype;
  cartloading: Boolean;
  error: string | null;
}

const initialState: CartState = {
  cartList: {
    createdAt:"",
    totalItems:0,
    user:"",
    _id:""
  },
  cartloading: false,
  error: null,
};

const addtocartListSlice=createSlice({
    name:"fetchOrder",
    initialState,
    reducers:{},
    extraReducers:(build)=>{
        build
        .addCase(fetchaddtocartList.pending, (state)=>{
            state.cartloading=true
        })
        .addCase(fetchaddtocartList.fulfilled, (state, action)=>{
            state.cartList = action.payload
            state.cartloading= false
        })
        .addCase(fetchaddtocartList.rejected,(state)=>{
            state.cartloading = false
        })
    }
})


export default addtocartListSlice.reducer