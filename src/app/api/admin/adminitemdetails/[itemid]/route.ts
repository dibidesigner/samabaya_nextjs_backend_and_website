import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";

import { Types } from "mongoose";
import CustomerOrder from "@/app/api/Models/orderSchema";
import offLineOrderModel from "@/app/api/Models/offLineOrderSchema";

export async function GET(req: NextRequest) {
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

    let itemdetails;

    itemdetails = await CustomerOrder.findById(itemid)
        .select("products.quantity products.productUnit products.price _id")
        .populate({
          path: "products.productId",
          model: "productModel",
          select: "imageBase641 productName stock price"
        });

    if(!itemdetails){
      itemdetails = await offLineOrderModel.findById(itemid)
      .populate("product").select("product")

    }


    
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
    return NextResponse.json(
      { success: false, error: "Internal Issue" },
      { status: 500 }
    );
  }
}
