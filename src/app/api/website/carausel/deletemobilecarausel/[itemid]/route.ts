import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";
import mobilecarauselImageModel from "@/app/api/Models/mobileCarauselImage";

export async function DELETE(req: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const itemid = pathParts[pathParts.length - 1];

    if (!Types.ObjectId.isValid(itemid)) {
      return NextResponse.json(
        { success: false, message: "Invalid item ID" },
        { status: 400 }
      );
    }

    const deletedImage = await mobilecarauselImageModel.findByIdAndDelete(itemid);

    if (!deletedImage) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully deleted the image",
    });
  } catch (error: unknown) {
   return NextResponse.json({
        message:"Something went wrong"
       },{
        status:500
       })
  }
}
