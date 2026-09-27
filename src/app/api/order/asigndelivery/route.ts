import { NextResponse } from "next/server"
import { verifyToken } from "../../verifyToken"
import { connectDB } from "@/app/db/dbconnection"
import CustomerOrder from "../../Models/orderSchema"

export async function POST(request: Request) {
  try {
    await verifyToken();
    await connectDB();

    const body = await request.json();

    const orderdetails = await CustomerOrder.findByIdAndUpdate(
      body.itemid,
      { deliveryby: body.deliveryagent },
      { new: true } // returns the updated document
    );

    if (!orderdetails) {
      return NextResponse.json({
        success: false,
        message: "Failed to update"
      });
    }


    return NextResponse.json({
      success: true,
      body: orderdetails
    });
  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "Internal error"
    });
  }
}