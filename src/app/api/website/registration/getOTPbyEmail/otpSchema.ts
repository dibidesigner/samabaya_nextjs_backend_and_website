import mongoose from "mongoose";
import { boolean } from "zod";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    emailVerified:{
        type:Boolean,
        default:false
    },
    mobile: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    mobileVerified:{
        type:Boolean,
        default:false
    },
    otp: {
      type: Number,
      required: true,
      min: 100000,
      max: 999999,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 5 * 60 * 1000, // expires in 5 minutes
    },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel =
  mongoose.models.OtpModel || mongoose.model("OtpModel", otpSchema);

export default otpModel;
