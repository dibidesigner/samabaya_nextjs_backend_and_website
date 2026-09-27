import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



export const carauseImageFetching = createAsyncThunk("fetch/carauselimage",
    async()=>{
        const res = await axiosInstance.get(ApiList.webcarausel)
        return res?.data?.data
    }
)

type CarauselImageType ={
  carauselImage:string
}

interface InitialType {
    carauselimage:CarauselImageType[],
    carauselloading:Boolean,
    carauselReload:Boolean
}

const initialState:InitialType ={
    carauselimage:[],
    carauselloading:false,
    carauselReload:false
}



const CarauselReducer = createSlice({
     name:"CarauselImage",
     initialState,
     reducers:{},
     extraReducers:(builder)=>
        builder
     .addCase(carauseImageFetching.pending, (state)=>{
        state.carauselloading=true
     })
     .addCase(carauseImageFetching.fulfilled,(state,action)=>{
        state.carauselimage = action.payload
        state.carauselloading = false
     })
     .addCase(carauseImageFetching.rejected, (state)=>{
        state.carauselloading = false
     })
})

export default CarauselReducer.reducer