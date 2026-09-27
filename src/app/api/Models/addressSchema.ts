import mongoose from "mongoose";


// Sub-schema for single address
export const address = new mongoose.Schema({
  fullname: { type: String },
  mobileno: { type: String },
  email:{ type: String },
  address: { type: String },
  city: { type: String },
  landmark: { type: String },
  pincode: { type: String },
});

// Main address schema
const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
  address: [address], // array of address objects
});

// Correct model creation
const addressModel =
  mongoose.models.addressModel || mongoose.model("addressModel", addressSchema);

export default addressModel;
