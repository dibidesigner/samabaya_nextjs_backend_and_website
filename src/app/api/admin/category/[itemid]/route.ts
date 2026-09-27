import { connectDB } from "@/app/db/dbconnection";
import { NextResponse } from "next/server";
import productCategoryModel from "../../../Models/productCategorySchema";
import { verifyToken } from "@/app/api/verifyToken";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ itemid: string }> } 
) {
  try {
    await verifyToken();

    const { itemid } = await context.params; 

    if (!itemid) {
      return NextResponse.json({
        success: false,
        message: "Item id not found",
      });
    }

    await connectDB();
    
    const deleteCategory = await productCategoryModel.findByIdAndDelete(itemid);

    if (!deleteCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category Not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully Deleted",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
