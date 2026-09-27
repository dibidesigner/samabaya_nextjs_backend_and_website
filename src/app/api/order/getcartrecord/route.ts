import { NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import getUserFromToken from "../../userdata";
import { connectDB } from "@/app/db/dbconnection";
import addToCartModel from "../../Models/addToCartSchema";

export async function POST() {
  try {
    await verifyToken();

    const decoded = await getUserFromToken();

    await connectDB();

    const cartrecord = await addToCartModel
      .find({ user: decoded?.id })
      .populate("products.product"); // populate product details

    if (!cartrecord || cartrecord.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No cart found for this user",
      });
    }

    return NextResponse.json({
      success: true,
      cart: cartrecord,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
