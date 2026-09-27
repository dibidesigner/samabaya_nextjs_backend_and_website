import mongoose from "mongoose";


const ratingvalue = new mongoose.Schema({
  user:String,
  ratingnumber:Number
})


const productSchema = new mongoose.Schema({
  productName:String,
  productCode:String,
  productType:String,
  barcode:Number,
  productCategory:String,
  price:Number,
  purchasePrice:Number,
  quantity:Number,
  initialStock:Number,
  stock:Number,
  benifit:String,
  productUnit:String,
  description:String,
  rating:[ratingvalue],
  availability:Boolean,
  imageBase641: String,
  imageBase642: String,
  imageBase643: String,
  imageBase644: String,
  imageBase645: String,

  
  likeBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userModel"
  }],

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userModel"
  }
},
{
  timestamps:true
})

productSchema.index({ productCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ availability: 1 });


const productModel = mongoose.models.productModel || mongoose.model("productModel", productSchema)


export default productModel