import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import CustomerOrder from "../../../Models/orderSchema";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    // Extract itemid from the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const itemid = pathParts[pathParts.length - 1];

    if (!Types.ObjectId.isValid(itemid)) {
      return NextResponse.json(
        { success: false, message: "Invalid item ID" },
        { status: 400 }
      );
    }

    const itemdetails = await CustomerOrder.findById(itemid).populate({
      path: "products.productId",
      model: "productModel",
    });

    if (!itemdetails) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: itemdetails,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
