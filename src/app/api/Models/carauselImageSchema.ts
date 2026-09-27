import mongoose from "mongoose";



const carauselImageSchema = new mongoose.Schema({
    carauselImage:String
},{
   timestamps:true
})


const carauselImageModel = mongoose.models.carauselimage || mongoose.model("carauselimage",carauselImageSchema)

export default carauselImageModel