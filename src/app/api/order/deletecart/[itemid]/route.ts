import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/db/dbconnection";
import addToCartModel from "@/app/api/Models/addToCartSchema";
import { Types } from "mongoose";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // Get itemid from URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const itemid = pathParts[pathParts.length - 1]; // last segment

    if (!Types.ObjectId.isValid(itemid)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
    }

    const record = await addToCartModel.findOneAndUpdate(
      { "products.product._id": itemid },
      { $pull: { products: { "product._id": itemid } } },
      { new: true }
    );

    if (!record) {
      return NextResponse.json({ success: false, message: "Product not found in cart" }, { status: 404 });
    }

    if (!record.products || record.products.length === 0) {
      await addToCartModel.findByIdAndDelete(record._id);
      return NextResponse.json({
        success: true,
        message: "Product removed & cart deleted (empty)",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from cart",
      data: record,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
