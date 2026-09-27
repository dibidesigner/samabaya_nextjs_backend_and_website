import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



export const homeproductlist = createAsyncThunk('homepage/Productlist',
    async ()=>{
          const res = await axiosInstance.get(ApiList.homeproductlist)
          return res?.data?.productList
    }
)


type ProductType={
    imageBase641:string,
    price:number,
    productName:string,
    productUnit:string,
    quantity:number,
    _id:string,
    stock:number
}

interface Initialtype {
    productList:ProductType[],
    homeproductloading:Boolean
}

const initialState:Initialtype =({
        productList:[],
        homeproductloading:false
    })




const HomeproductList = createSlice({
    name:"homepageproduct",
    initialState,
    reducers:{},
    extraReducers:(builder)=> {
        builder
        
        .addCase(homeproductlist.pending,(state)=>{
             state.homeproductloading=true
        })

        .addCase(homeproductlist.fulfilled, (state, action)=>{
            state.productList = action.payload
            state.homeproductloading = false
        })

        .addCase(homeproductlist.rejected, (state)=>{
               state.homeproductloading = false
        })
    },
}
)

export default HomeproductList.reducer