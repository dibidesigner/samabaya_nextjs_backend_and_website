import addToCartModel from "@/app/api/Models/addToCartSchema";
import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyToken();
    await connectDB();


    const result = await addToCartModel.deleteMany({ user: user?.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Cart not Found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Cart Cleared",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
