import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



export const mobilecarauseImageFetching = createAsyncThunk("fetch/mobilecarauselimage",
    async()=>{
        const res = await axiosInstance.get(ApiList.mobilecarausel)
        return res?.data?.data
    }
)

type CarauselImageType ={
  mobilecarauselImage:string
}

interface InitialType {
    mobilecarauselimage:CarauselImageType[],
    mobilecarauselloading:Boolean,
    mobilecarauselReload:Boolean
}

const initialState:InitialType ={
    mobilecarauselimage:[],
    mobilecarauselloading:false,
    mobilecarauselReload:false
}



const CarauselReducer = createSlice({
     name:"CarauselImage",
     initialState,
     reducers:{},
     extraReducers:(builder)=>
        builder
     .addCase(mobilecarauseImageFetching.pending, (state)=>{
        state.mobilecarauselloading=true
     })
     .addCase(mobilecarauseImageFetching.fulfilled,(state,action)=>{
        state.mobilecarauselimage = action.payload
        state.mobilecarauselloading = false
     })
     .addCase(mobilecarauseImageFetching.rejected, (state)=>{
        state.mobilecarauselloading = false
     })
})

export default CarauselReducer.reducer