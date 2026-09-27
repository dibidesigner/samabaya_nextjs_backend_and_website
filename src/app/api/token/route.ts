import { NextResponse } from "next/server";
import getUserFromToken from "../userdata";
import userModel from "../Models/userSchema";
import { connectDB } from "@/app/db/dbconnection";




export async function GET() {
  try {
    await connectDB()
    const token = await getUserFromToken();
  

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Token not available",
      });
    }

    const logeduser = await userModel.findById(token.id).select("-password -otp");
   

    if (!logeduser) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }
 
    return NextResponse.json({
      success: true,
      token,
      logeduser,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: "We are facing technical Issue",
    },
  {
    status:500
  });
  }
}
