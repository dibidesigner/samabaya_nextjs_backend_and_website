import { connectDB } from "@/app/db/dbconnection";
import { NextResponse, NextRequest } from "next/server";
import weightunitModel from "../../../Models/unitSchema";
import { Types } from "mongoose";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // Extract itemid from URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const itemid = pathParts[pathParts.length - 1];

    if (!Types.ObjectId.isValid(itemid)) {
      return NextResponse.json(
        { success: false, message: "Invalid item ID" },
        { status: 400 }
      );
    }

    const deleteCategory = await weightunitModel.findByIdAndDelete(itemid);

    if (!deleteCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (error: unknown) {
    return NextResponse.json({
        message:"Something went wrong"
       },{
        status:500
       })
  }
}
