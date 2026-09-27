import { NextRequest, NextResponse } from "next/server"
import userModel from "../../Models/userSchema"



export async function DELETE(
  req: NextRequest,
  context: any // ✅ IMPORTANT FIX
) {
  try {
    const id = context.params.id; // ✅ no await

    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Successfully Deleted", data: deletedUser },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}