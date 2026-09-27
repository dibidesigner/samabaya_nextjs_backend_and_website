import mongoose from "mongoose";
import { boolean } from "zod";

const calendarSchema = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const userSchema = new mongoose.Schema({
  username:String,
  fullname:String,
  mobile:String,
  email:String,
  active:Boolean,
  userRole:String,
  gender:String,
  adharNo:Number,
  profileImage:String,
  authProvider:String,
  customertype:Boolean,
  membership:Boolean,
  password:String,
  duty:[calendarSchema],
  otp:Number
},{
  timestamps:true
});

const userModel = mongoose.models.userModel || mongoose.model("userModel", userSchema);

export default userModel