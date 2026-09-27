import mongoose from "mongoose";

const orderedProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productModel",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  landmark: { type: String },
  pincode: { type: String, required: true },
  fullname: { type: String, required: true },
  mobileno: { type: String, required: true },
  emailid: { type: String, required: false }
});

const orderSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true
    },
    orderid:String,
    products: [orderedProductSchema],
    address: orderAddressSchema,
    totalprice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    deliveryby:String,
    ordermode:String

  },
  { timestamps: true }
);

orderSchema.index({ "address.fullname": 1 });
orderSchema.index({ orderid: 1 });

const CustomerOrder =
  mongoose.models.CustomerOrder || mongoose.model("CustomerOrder", orderSchema);

export default CustomerOrder;
