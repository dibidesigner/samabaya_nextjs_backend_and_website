import mongoose from "mongoose";

const productDetails = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productModel",
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },

  quantity: {
    type: Number,
   
  },
  discountPercent:{
    type:Number
  },
  weight: {
    type: Number,
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const offLineOrderSchema = new mongoose.Schema({
    orderid:{
       type:String,
       unique: true,
       require:true,
    },
    customername: {
        type: String,
        required: true
    },
    cutomermobileno: {
        type: String
    },
    customermembership: {
        type: Boolean,
        default: false
    },
    billingProcessby: {
        type: String
    },
    totalPrice: {
        type: Number,
        required: true
    },
    product: [productDetails],
    billingDone: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


const offLineOrderModel = mongoose.models.offLineOrderSchema || mongoose.model("offLineOrderSchema", offLineOrderSchema)

export default offLineOrderModel