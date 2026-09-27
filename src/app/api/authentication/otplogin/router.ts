

import { connectDB } from '@/app/db/dbconnection';
import jwt from 'jsonwebtoken';
import UserModel from '../../Models/userSchema';
import { NextRequest, NextResponse } from 'next/server';
import otpModel from '../../website/registration/getOTPbyEmail/otpSchema';

const SECRET = process.env.JWT_SECRET || "noaprojectbestepuraokomarmalangsenbescareerhuykoma";

export async function POST(request:NextRequest) {
  try {
    await connectDB();

    const body = await request.json();


    let { email, otp} = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }



    const otpNumber = Number(otp)
    
    const record = await otpModel.findOne({ email: email});
    const dbotp = Number(record.otp)
    
    if (dbotp !== otpNumber ) {
              return NextResponse.json({
                success:false,
                message:"Invalid OTP"
              })
            } 


    let query: { email?: string; mobile?: string } = {};
    
    if (email.includes("@")) {
      if (!email.endsWith("@gmail.com")) {
        email += "@gmail.com";
      }
      query.email = email.toLowerCase();
    } else {
      query.mobile = email;
    }

    const user = await UserModel.findOne(query).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.active) {
      return NextResponse.json(
        { success: false, message: "You are blocked from the website" },
        { status: 403 }
      );
    }



    const tokenPayload = {
      id: user._id,
      username: user.username || "defaultUsername",
      email: user.email || "",
      mobile: user.mobile || "",
      role: user.userRole || "staff"
    };

    const token = jwt.sign(tokenPayload, SECRET, { expiresIn: "1h" });

    const userResponse = {
      id: user._id,
      username: user.username || "defaultUsername",
      fullName: user.fullName || "",
      email: user.email || "",
      mobile: user.mobile || "",
      role: user.userRole || "staff",
      profileImage: user.profileImage || null
    };

    const response = NextResponse.json({ success: true, user: userResponse }, { status: 200 });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: false, 
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
      maxAge: 60 * 60 
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
