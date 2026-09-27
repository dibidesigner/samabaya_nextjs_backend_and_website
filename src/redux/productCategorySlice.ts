import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../Apicall/apiInstance";
import ApiList from "../Apicall/ApiList";




export const fetchProductCategory = createAsyncThunk("featch/productCategry",
    async ()=>{
        const res = await axiosInstance.get(ApiList.productCategory)
        return res.data.data
    }
)


interface CategoryType {
  prouctCategory:string
}

interface ProductCategoryState {
  categoryloading: boolean;
  productCategoryList: CategoryType[];
}

const initialState:ProductCategoryState ={
        categoryloading:false,
        productCategoryList:[],

    }

const productCategorySlice = createSlice({
    name:"productCategory",
    initialState,
    reducers:{},
    extraReducers:(builder)=>builder
    .addCase(fetchProductCategory.pending, (state)=>{
       state.categoryloading = true
    })
    .addCase(fetchProductCategory.fulfilled, (state, action)=>{
        state.productCategoryList = action.payload
        state.categoryloading = false
    })
    .addCase(fetchProductCategory.rejected, (state, action)=>{

        state.categoryloading = false
    })
       

})

export default productCategorySlice.reducer