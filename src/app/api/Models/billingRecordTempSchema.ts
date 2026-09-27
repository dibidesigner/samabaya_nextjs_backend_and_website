import mongoose from "mongoose";


const billingTempSchema=new mongoose.Schema({
    customername:{
        type:String,
    },
    cutomermobileno:{
        type:String,
    },
    customermembership:{
        type:Boolean,
        default:false
    },
    billingProcessby:{
         type:String
    },
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"productModel"
    }]
    
},
{
    timestamps:true
})

const billingTempModel = mongoose.models.billingTempModel || mongoose.model("billingTempModel", billingTempSchema)

export default billingTempModel