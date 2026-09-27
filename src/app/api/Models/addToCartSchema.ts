import mongoose from "mongoose";


const addToCartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productModel",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      priceAtAddTime: {
        type: Number,
        required: true
      }
    }
  ],
  totalItems: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});


const addToCartModel = mongoose.models.addToCartModel || mongoose.model("addToCartModel",addToCartSchema)


export default addToCartModel;
