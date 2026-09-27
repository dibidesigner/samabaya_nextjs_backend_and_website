import { NextResponse } from "next/server"
import { verifyToken } from "../../verifyToken"
import { connectDB } from "@/app/db/dbconnection"
import CustomerOrder from "../../Models/orderSchema"


export async function GET(){
  try {
    await verifyToken()
    await connectDB()

    const orders = await CustomerOrder.find().sort({ createdAt: 1 });
    if(!orders){
        return NextResponse.json({
            success:false,
            message:"Order List Not found"
        },
    {
        status:404
    })
    }

    const reports = orders.map((data) => ({
        date: data.createdAt.toISOString().split("T")[0], // only YYYY-MM-DD
        totalprice: data.totalprice
        }));

   if(!reports){
    return NextResponse.json({
        success:false,
        message:"Repotrs Not Found"
    })
   }

   return NextResponse.json({
    success:true,
    reports
   })
  } catch (error) {

    return NextResponse.json({
        success:false,
        message:"Internal Error"
    })
  }
}