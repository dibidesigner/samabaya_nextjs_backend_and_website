import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import userModel from "../Models/userSchema";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await verifyToken();
    await connectDB();

    const stafflist = await userModel.find({ userRole: "staff" }).select("username fullname gender createdAt mobile email active duty");

  
    if (!stafflist || stafflist.length <= 0) {
      return NextResponse.json({
        success: false,
        message: "No staff users found",
      });
    }


    return NextResponse.json({
      success: true,
      stafflist,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }



    const mailexist = await userModel.findOne({email:body.newemail})



    if(mailexist){
        return NextResponse.json({
            success:false,
            message:"Email already Exist"
        },{
            status:404
        })
    }

    function generateUserId(): string {
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        return `sambaya${randomNum}`;
    }

    const password = "Samabaya@1234"

    const hashpassword = await bcrypt.hash(password, 10)

    await userModel.create({
        username:generateUserId(),
        fullname:body.fullname,
        mobile:body.mobile,
        email:body.newemail,
        active:true,
        userRole:body.userlevel,
        password:hashpassword,
        // duty:false,
        gender:body.gender
    })



    return NextResponse.json(
      {
        success: true,
        data: body,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

