import { connectDB } from "@/app/db/dbconnection"
import { Types } from "mongoose";
import { z } from "zod";
import validator from "validator";
import userModel from "../../Models/userSchema"
import { NextResponse } from "next/server"

import getUserFromToken from "../../userdata"
import { verifyToken } from "../../verifyToken"

const tokenSchema = z.object({
  id: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
});

export async function GET(){
    try {
        await verifyToken()
        await connectDB()

        const decoded = await getUserFromToken()

        
       if (!decoded) {
            return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
            );
        }


        const parsed = tokenSchema.safeParse(decoded);
        if (!parsed.success) {
          return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
          );
        }

        const userId = validator.trim(parsed.data.id);

       const userdata = await userModel.findById(userId).select("-password");

        if(!userdata){
            return NextResponse.json({
                success:false,
                message:"User not found"
            })
        }

        return NextResponse.json({
            success:true,
            userdata
        })
    } catch (error) {
          return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
          );
    }
}

export async function POST(request: Request) {
  try {
    await verifyToken();
    await connectDB();

    const body = await request.json();
    if (!body) {
      return NextResponse.json({
        success: false,
        message: "Input data is missing",
      });
    }

    const user = await getUserFromToken();
    if (!user?.id) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const { firstName, phone, email, gender } = body;

    const updateProfile = await userModel.findByIdAndUpdate(
      user.id,
      { fullname: firstName, mobile: phone, email, gender },
      { new: true } 
    );

    if (!updateProfile) {
      return NextResponse.json({
        success: false,
        message: "Failed to update profile details",
      });
    }

    return NextResponse.json({
      success: true,
      data: updateProfile, 
    });
  } catch (error: unknown) {
   return NextResponse.json({
        message:"Something went wrong"
       },{
        status:500
       })
  }
}



// profile image update
export async function PUT(request: Request) {
  try {
    await verifyToken();
    await connectDB();

    const user = await getUserFromToken();
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Image file missing" },
        { status: 400 }
      );
    }

    // Convert File -> Base64 (if storing in MongoDB)
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const updatedUser = await userModel.findByIdAndUpdate(
      user?.id,
      { profileImage: base64Image },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update image" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile image updated successfully",
      data: { profileImage: updatedUser.profileImage },
    });
  } catch (error: unknown) {
      return NextResponse.json({
            message:"Something went wrong"
          },{
            status:500
          })
}

}