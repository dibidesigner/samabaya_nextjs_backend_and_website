import CustomerOrder from "@/app/api/Models/orderSchema";
import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await verifyToken()
    await connectDB();

    const orderlist = await CustomerOrder.find().sort({ _id: -1 });


    if (!orderlist || orderlist.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No ordered products found",
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        Orderlist: orderlist,
      },
      {
        status: 200,
      }
    );
  } catch (error:any) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching orders",
      },
      {
        status: 500,
      }
    );
  }
}
