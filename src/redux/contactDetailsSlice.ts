import axiosInstance from "@/Apicall/apiInstance"
import ApiList from "@/Apicall/ApiList"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"



export const admindetails = createAsyncThunk("fetch/fetchdetails",
    async ()=>{
      const res = await axiosInstance.get(ApiList.webdetails)
      return res?.data?.contactdetails
    }
)

type contacDataType ={
    copyrightDetails?:string | null
    developerInformation?:string | null
    emailid?:string | null,
    facebookLink?:string | null
    fulladdress?:string | null
    instatgramLink?:string | null
    locationMap?:string | null
    mobile?:string | null
    storelogo?:string | null
    storename?:string | null
    twitterLink?:string | null
}

interface InitialDataType{
    details:contacDataType | null
    contactdetailsloading:boolean
}

const initialState:InitialDataType = {
    details:null,
    contactdetailsloading:false
}


const contactdetails = createSlice({
    name:"contactdetails",
    initialState,
    reducers:{},
    extraReducers(builder) {
        builder.addCase(admindetails.pending,(state)=>{
            state.contactdetailsloading = true
        })

        builder.addCase(admindetails.fulfilled,(state,action)=>{
           state.details=action.payload,
           state.contactdetailsloading =false
        })

        builder.addCase(admindetails.rejected, (state)=>{
            state.contactdetailsloading =false
        })
    },
})

export default contactdetails.reducer