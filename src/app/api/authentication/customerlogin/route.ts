

import { connectDB } from '@/app/db/dbconnection';
import jwt from 'jsonwebtoken';
import UserModel from '../../Models/userSchema';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET || "noaprojectbestepuraokomarmalangsenbescareerhuykoma";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }



    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: 'Invalid input type' },
        { status: 400 }
      );
    }

    email = email.trim();
    password = password.trim();

    if (email.length > 100 || password.length > 100) {
      return NextResponse.json(
        { error: 'Input too long' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    let query: { email?: string; mobile?: string } = {};

    if (email.includes("@")) {

      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }

      if (!email.endsWith("@gmail.com")) {
        email += "@gmail.com";
      }

      query.email = email.toLowerCase();

    } else {

      const mobileRegex = /^[0-9]{10,15}$/;

      if (!mobileRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid mobile number' },
          { status: 400 }
        );
      }
      query.mobile = email;
    }


    const user = await UserModel.findOne(query).select('+password');

    // if(user.userRole == "admin"){
    //    return NextResponse.json({
    //       message:"Unauthorised Request"
    //    },{
    //     status:500
    // })
    // }


    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.active) {
      return NextResponse.json(
        { success: false, message: "You are blocked from the website" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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
      secure: isProduction ? true : false,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
      maxAge: 60 * 60
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
