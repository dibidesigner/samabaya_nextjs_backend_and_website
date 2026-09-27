import { connectDB } from "@/app/db/dbconnection";
import { NextRequest, NextResponse } from "next/server";
import userModel from "../../../Models/userSchema";
import { verifyToken } from "@/app/api/verifyToken";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params is a Promise
) {
  try {
    await verifyToken();
    await connectDB();

    const { id } = await context.params; // 👈 await the promise
    const { active } = await request.json();

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { active: active },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
