import { connectDB } from '@/app/db/dbconnection';
import jwt from 'jsonwebtoken';
import UserModel from '../../Models/userSchema';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const SECRET = "noaprojectbestepuraokomarmalangsenbescareerhuykoma"

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    let { email, mobile, password } = body;


    if (!email) {
      return NextResponse.json(
        { error: 'Please provide either email or mobile number' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email })

    if (user.userRole == "customer") {
      return NextResponse.json({
        message: "Unauthorised Request"
      }, {
        status: 500
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);



    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }




    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        {
          success: false,
          message: "You are blocked from the website"
        },
        { status: 403 }
      );
    }


    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      role: user.userRole
    };

    const token = jwt.sign(tokenPayload, SECRET, { expiresIn: "1h" });

    const userResponse = {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.userRole,
    };

    const response = NextResponse.json(
      {
        success: true,
        user: userResponse
      },
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
