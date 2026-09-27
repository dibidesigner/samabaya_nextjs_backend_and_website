import { NextResponse } from "next/server";
import productModel from "../Models/productShema";
import { connectDB } from "@/app/db/dbconnection";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) return NextResponse.json([]);


    const results = await productModel.find({
      $or: [
        { barcode: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { productCategory: { $regex: query, $options: "i" } },
      ],
    }).limit(20).select("productName stock"); 

    return NextResponse.json(results);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
