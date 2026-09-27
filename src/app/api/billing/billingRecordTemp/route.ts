import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/db/dbconnection";
import { verifyToken } from "../../verifyToken";
import productModel from "../../Models/productShema";
import billingTempModel from "../../Models/billingRecordTempSchema";
import mongoose from "mongoose";



export async function POST(req: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Item id Missing" },
        { status: 400 }
      );
    }

    let product;

    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await productModel.findById(productId)
        .select("_id barcode productName productType stock quantity productUnit price").sort("-createdAt");
    }

    if (!product) {
      product = await productModel.findOne({ barcode: productId })
        .select("_id barcode productName stock quantity productUnit price").sort("-createdAt");
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, product },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}


