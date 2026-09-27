import mongoose from "mongoose";


const storeDetails =new mongoose.Schema({
    storeName:String,
    mobileNo:Number,
    emailId:String,
    storeAddress:String
})

const storeDetailsModel = mongoose.models.storedetailmodel || mongoose.model("storeDetails", storeDetails)

export default storeDetailsModel