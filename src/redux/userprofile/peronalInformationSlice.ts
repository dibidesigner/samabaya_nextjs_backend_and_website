import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface UserProfile {
  id: string;
  fullname:string,
  gender:string,
  name: string;
  email: string;
  mobile:string,
  authProvider:string,
  profileImage?: string;
}

interface PersonalInformationState {
  userdata: UserProfile | null;
  loading: boolean;
}


export const fetchUserInformation = createAsyncThunk("fetch/userInformation",
    async ()=>{
        const res = await axiosInstance.get(ApiList.userpersonalinformation)
        return res.data.userdata
    }
)


const initialState: PersonalInformationState = {
  userdata: null,
  loading: false,
};


const personalInformationSlice =createSlice({
    name:"personalInformation",
    initialState,
    reducers:{},
    extraReducers:(build)=>build

    .addCase(fetchUserInformation.pending, (state)=>{
        state.loading= true
    })
    .addCase(fetchUserInformation.fulfilled, (state, action)=>{
        state.userdata=action.payload;
        state.loading=false
    })
    .addCase(fetchUserInformation.rejected, (state)=>{
        state.loading=false
    })
})


export default personalInformationSlice.reducer