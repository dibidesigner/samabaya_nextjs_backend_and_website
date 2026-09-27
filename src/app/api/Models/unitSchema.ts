import mongoose from "mongoose";



const weightunitSchema=new mongoose.Schema({
    weightunit:String
},{
  timestamps:true
})

const weightunitModel = mongoose.models.weightunitModel || mongoose.model("weightunitModel", weightunitSchema)


export default weightunitModel