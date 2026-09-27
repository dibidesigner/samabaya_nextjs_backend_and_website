import { configureStore } from '@reduxjs/toolkit'
import productSlice from "@/redux/productSlice"
import productCategory from "@/redux/productCategorySlice"
import fetchaddtocartList  from './orderListSlice'
import userprofileSlice from "@/redux/userprofile/peronalInformationSlice"
import customerorder  from "@/redux/userprofile/customerorderlist"
import tokenSlice from "@/redux/token"
import userAddress from "@/redux/userprofile/addressSlice"
import contactdetails from "@/redux/contactDetailsSlice"
import whichpage from "@/redux/pageSwitch"
import wishliststore from "@/redux/wishListSlice"
import Homepageproduct from "@/redux/homeProductList"
import CarauselStore  from "@/redux/Carauselmages"
import mobilecarausel from "@/redux/mobilecarausel"



export const store = configureStore({
  reducer: {
   productList : productSlice,
   productCategory,
   fetchaddtocartList,
   userprofileSlice,
   customerorder,
   tokenSlice,
   userAddress,
   contactdetails,
   whichpage,
   wishliststore,
   Homepageproduct,
   CarauselStore,
   mobilecarausel
  },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;