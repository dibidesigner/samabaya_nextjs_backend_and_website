import mongoose from "mongoose";


const wishListSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    },
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"productModel"
    }]
},
{
    timestamps:true
})


const wishListModel = mongoose.models.wishListModel || mongoose.model("wishListModel", wishListSchema)

export default wishListModel;