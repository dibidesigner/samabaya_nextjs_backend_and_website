// app/api/website/singleproduct/[itemid]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/db/dbconnection";
import productModel from "@/app/api/Models/productShema";




export async function POST(req:NextRequest){
  try {
    const itemid = await req.json()

    if (!itemid || itemid.length !== 24) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID format." },
        { status: 400 }
      );
    }

    await connectDB()

    const product = await productModel.findById(itemid).select("imageBase641 availability productName productType productCategory quantity productUnit price stock");

    
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }


    return NextResponse.json({ success: true, singleoproduct: product }, { status: 200 });

    
 } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}