import mongoose from "mongoose";



const productCategorySchema=new mongoose.Schema({
    prouctCategory:String
},{
  timestamps:true
})

const productCategoryModel = mongoose.models.productCategoryModel || mongoose.model("productCategoryModel", productCategorySchema)


export default productCategoryModel