import mongoose from "mongoose";



const mobilecarauselImageSchema = new mongoose.Schema({
    mobilecarauselImage:String
},{
   timestamps:true
})


const mobilecarauselImageModel = mongoose.models.mobilecarausel || mongoose.model("mobilecarausel",mobilecarauselImageSchema)

export default mobilecarauselImageModel